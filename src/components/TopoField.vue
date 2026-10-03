<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'

/* Карту тянем fetch'ем, а не ?raw-импортом: 435 КБ строкой в модуле
   роняют vue-tsc с out-of-memory, а отдельным файлом карта кэшируется.
   Относительный путь работает и в подпапке Pages, и в корне Vercel. */
const TOPO_URL = `${import.meta.env.BASE_URL}assets/topo.svg`

/* Карта режется как background-size: cover, а не вписывается в рамку. */
const svgHtml = ref('')

const svgHost = ref<HTMLDivElement | null>(null)
const fx = ref<HTMLCanvasElement | null>(null)

/* --- геометрия в экранных px ---
   Пути лежат под вложенными scale (сырые координаты до ~25000 при
   viewBox 5120), поэтому работаем через getScreenCTM, а не getBBox.
   Сдвигаем не по центру bbox (у крупных контуров он далеко от линий
   под курсором), а по ближайшей семпл-точке вдоль пути. Сдвиг задаём
   атрибутом transform, делённым на личный масштаб пути: атрибут живёт
   в локальных единицах. */
const RADIUS = 150 // радиус отталкивания, px
const PUSH = 30 // максимальный сдвиг в центре, px

interface Entry {
  el: SVGPathElement
  /** плоский массив экранных точек вдоль пути: [x0, y0, x1, y1, ...] */
  pts: number[]
  k: number
}

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  max: number
  size: number
}

interface Ripple {
  x: number
  y: number
  r: number
  a: number
}

let entries: Entry[] = []
let displaced = new Set<SVGPathElement>()
let raf = 0
let loopOn = false
let ctx: CanvasRenderingContext2D | null = null
let dpr = 1

const pointer = { x: -9999, y: -9999, lastMove: 0 }
let particles: Particle[] = []
let ripples: Ripple[] = []
let lastRipple = 0

const CURSOR_CLASS = 'fx-cursor'

function calm(): boolean {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return true
  if (document.documentElement.dataset.perf === 'lite') return true
  return false
}

/** Семпл-точки и масштабы всех путей. Вызывать при монтировании
 *  и ресайзе: фон fixed, так что координаты уже клиентские и от
 *  скролла не зависят. Точек на путь — от 1 до 8 по длине. */
function recache(): void {
  entries = []
  const host = svgHost.value
  if (!host) return
  host.querySelectorAll('path').forEach((node) => {
    const el = node as SVGPathElement
    try {
      const m = el.getScreenCTM()
      if (!m || !isFinite(m.a) || m.a === 0) return
      const k = Math.abs(m.a)
      const pts: number[] = []
      let len = 0
      try {
        len = el.getTotalLength()
      } catch {
        len = 0
      }
      if (isFinite(len) && len > 0) {
        const n = Math.min(8, Math.max(1, Math.round(len / 220)))
        for (let i = 0; i < n; i++) {
          try {
            const p = el.getPointAtLength((len * i) / n)
            const s = new DOMPoint(p.x, p.y).matrixTransform(m)
            pts.push(s.x, s.y)
          } catch {
            /* битую точку пропускаем */
          }
        }
      }
      if (pts.length === 0) {
        // запасной вариант: центр bbox
        const r = el.getBoundingClientRect()
        pts.push(r.left + r.width / 2, r.top + r.height / 2)
      }
      entries.push({ el, pts, k })
    } catch {
      /* пустой путь — пропускаем */
    }
  })
}

function settle(): void {
  for (const el of displaced) el.removeAttribute('transform')
  displaced.clear()
}

function frame(): void {
  if (!loopOn) return

  if (calm()) {
    settle()
    particles = []
    ripples = []
    document.documentElement.classList.remove(CURSOR_CLASS)
    loopOn = false
    return
  }

  const now = performance.now()
  const fresh = now - pointer.lastMove < 2500

  /* --- 1. отталкивание линий --- */
  if (fresh && pointer.x > -9998) {
    const r2 = RADIUS * RADIUS
    for (const e of entries) {
      const pts = e.pts
      let best = Infinity
      let bx = 0
      let by = 0
      for (let i = 0; i < pts.length; i += 2) {
        const dx = (pts[i] ?? 0) - pointer.x
        const dy = (pts[i + 1] ?? 0) - pointer.y
        const d2 = dx * dx + dy * dy
        if (d2 < best) {
          best = d2
          bx = dx
          by = dy
          if (best === 0) break
        }
      }
      if (best < r2) {
        const d = Math.max(Math.sqrt(best), 4) // ближе 4px не подпускаем: деление на ноль
        const f = 1 - d / RADIUS
        const m = (PUSH * f * f) / (d * e.k)
        e.el.setAttribute('transform', `translate(${(bx * m).toFixed(2)} ${(by * m).toFixed(2)})`)
        displaced.add(e.el)
      } else if (displaced.has(e.el)) {
        e.el.removeAttribute('transform')
        displaced.delete(e.el)
      }
    }
  } else if (displaced.size > 0) {
    settle()
  }

  /* --- 2. частицы, рябь, курсор --- */
  if (ctx && fx.value) {
    const w = fx.value.clientWidth
    const h = fx.value.clientHeight
    ctx.clearRect(0, 0, w, h)

    if (fresh) {
      // шлейф
      for (let i = 0; i < 2; i++) {
        if (particles.length > 160) particles.shift()
        const a = Math.random() * Math.PI * 2
        const sp = 0.3 + Math.random() * 0.9
        particles.push({
          x: pointer.x + (Math.random() - 0.5) * 6,
          y: pointer.y + (Math.random() - 0.5) * 6,
          vx: Math.cos(a) * sp,
          vy: Math.sin(a) * sp - 0.25,
          life: 1,
          max: 0.6 + Math.random() * 0.7,
          size: 1 + Math.random() * 2.2,
        })
      }
      // рябь не чаще раза в 700 мс
      if (now - lastRipple > 700) {
        lastRipple = now
        ripples.push({ x: pointer.x, y: pointer.y, r: 6, a: 0.35 })
      }
    }

    ctx.globalCompositeOperation = 'lighter'
    particles = particles.filter((p) => p.life > 0)
    for (const p of particles) {
      p.x += p.vx
      p.y += p.vy
      p.vx *= 0.96
      p.vy *= 0.96
      p.life -= 0.016 / p.max
      const a = Math.max(0, p.life) * 0.7
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.size * Math.max(0, p.life), 0, Math.PI * 2)
      ctx.fillStyle = `rgba(180,200,255,${a.toFixed(3)})`
      ctx.fill()
    }

    ripples = ripples.filter((g) => g.a > 0.01)
    for (const g of ripples) {
      g.r += 2.6
      g.a *= 0.94
      ctx.beginPath()
      ctx.arc(g.x, g.y, g.r, 0, Math.PI * 2)
      ctx.strokeStyle = `rgba(170,190,255,${g.a.toFixed(3)})`
      ctx.lineWidth = 1.2
      ctx.stroke()
    }

    // свой курсор вместо спрятанного системного
    if (fresh && pointer.x > -9998) {
      ctx.beginPath()
      ctx.arc(pointer.x, pointer.y, 2.4, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(220,230,255,0.95)'
      ctx.fill()
      ctx.beginPath()
      ctx.arc(pointer.x, pointer.y, 9, 0, Math.PI * 2)
      ctx.strokeStyle = 'rgba(180,200,255,0.5)'
      ctx.lineWidth = 1.2
      ctx.stroke()
      ctx.beginPath()
      ctx.arc(pointer.x, pointer.y, 22, 0, Math.PI * 2)
      ctx.strokeStyle = 'rgba(170,190,255,0.16)'
      ctx.lineWidth = 1
      ctx.stroke()
    }
    ctx.globalCompositeOperation = 'source-over'
  }

  /* --- 3. спать, когда нечего рисовать --- */
  const busy = fresh || particles.length > 0 || ripples.length > 0
  if (busy) {
    raf = requestAnimationFrame(frame)
  } else {
    settle()
    loopOn = false
  }
}

function kick(): void {
  // lite могли включить уже после монтирования (perfTier меряет ~1.2 с):
  // тогда первое же движение мыши гасит поле и возвращает курсор,
  // а не оставляет спрятанный курсор при мёртвом цикле
  if (calm()) {
    settle()
    particles = []
    ripples = []
    document.documentElement.classList.remove(CURSOR_CLASS)
    return
  }
  if (!loopOn) {
    loopOn = true
    raf = requestAnimationFrame(frame)
  }
}

function onMove(e: PointerEvent): void {
  pointer.x = e.clientX
  pointer.y = e.clientY
  pointer.lastMove = performance.now()
  kick()
}

function onLeave(): void {
  pointer.lastMove = 0
  kick()
}

function onResize(): void {
  sizeCanvas()
  recache()
}

function sizeCanvas(): void {
  const c = fx.value
  if (!c) return
  dpr = Math.min(window.devicePixelRatio || 1, 1.5)
  c.width = Math.floor(c.clientWidth * dpr)
  c.height = Math.floor(c.clientHeight * dpr)
  ctx = c.getContext('2d')
  ctx?.setTransform(dpr, 0, 0, dpr, 0, 0)
}

function onVis(): void {
  if (document.hidden && loopOn) {
    loopOn = false
    cancelAnimationFrame(raf)
  } else if (!document.hidden && !loopOn && performance.now() - pointer.lastMove < 2500) {
    kick()
  }
}

onMounted(async () => {
  try {
    const res = await fetch(TOPO_URL)
    if (res.ok) {
      const raw = await res.text()
      // Карта режется как background-size: cover, а не вписывается в рамку.
      svgHtml.value = raw.replace(/<svg[\s>]/, '<svg preserveAspectRatio="xMidYMid slice" ')
      await nextTick()
      // семплы путей кэшируем один раз (плюс на каждый ресайз)
      recache()
    }
  } catch {
    /* фон отсутствует — страница живёт без него */
  }

  // только для мыши/тачпада: на таче курсора нет, а дёргать карту скроллом не надо
  if (!matchMedia('(pointer: fine)').matches) return
  if (calm()) return // статичная карта, без курсора и цикла

  document.documentElement.classList.add(CURSOR_CLASS)
  sizeCanvas()

  window.addEventListener('pointermove', onMove, { passive: true })
  document.documentElement.addEventListener('pointerleave', onLeave)
  window.addEventListener('resize', onResize)
  document.addEventListener('visibilitychange', onVis)
})

onBeforeUnmount(() => {
  loopOn = false
  cancelAnimationFrame(raf)
  document.documentElement.classList.remove(CURSOR_CLASS)
  window.removeEventListener('pointermove', onMove)
  document.documentElement.removeEventListener('pointerleave', onLeave)
  window.removeEventListener('resize', onResize)
  document.removeEventListener('visibilitychange', onVis)
})
</script>

<template>
  <!-- Два слоя: карта с линиями — под контентом, канвас с курсором,
       шлейфом и рябью — поверх всего. Иначе светящийся курсор тонет
       за непрозрачными карточками, а системный при этом спрятан. -->
  <div class="topo" aria-hidden="true">
    <div ref="svgHost" class="topo-svg" v-html="svgHtml"></div>
  </div>
  <canvas ref="fx" class="topo-fx" aria-hidden="true"></canvas>
</template>
