import type { Directive } from 'vue'

const reduceMotion = () =>
  typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches

let revealObserver: IntersectionObserver | null = null

function getRevealObserver(): IntersectionObserver | null {
  if (typeof IntersectionObserver === 'undefined') return null
  if (!revealObserver) {
    revealObserver = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue
          e.target.classList.add('is-in')
          revealObserver?.unobserve(e.target)
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.06 },
    )
  }
  return revealObserver
}

/**
 * v-reveal — появление при прокрутке.
 * Страница открыта в фоне: IntersectionObserver в скрытой вкладке может
 * не сработать вовсе, поэтому показываем всё сразу — иначе кто-то увидит
 * пустоту вместо текста.
 */
export const vReveal: Directive<HTMLElement> = {
  mounted(el) {
    el.classList.add('reveal')
    if (reduceMotion() || document.hidden) {
      el.classList.add('is-in')
      return
    }
    const io = getRevealObserver()
    if (io) io.observe(el)
    else el.classList.add('is-in')
  },
  unmounted(el) {
    revealObserver?.unobserve(el)
  },
}

function formatCount(target: number, locale: string, suffix: string): string {
  return new Intl.NumberFormat(locale === 'ru' ? 'ru-RU' : 'en-US').format(Math.round(target)) + suffix
}

/**
 * v-count — анимированный счётчик. Ждёт пересечения с вьюпортом,
 * считает outCubic 1100 мс. Использование: v-count="59000".
 * Суффикс — через модификатор аргумента: data-count-suffix больше не нужен,
 * но для совместимости разметки читаем el.dataset.countSuffix.
 */
export const vCount: Directive<HTMLElement, number> = {
  mounted(el, binding) {
    const target = Number(binding.value || 0)
    const suffix = el.dataset.countSuffix || ''
    const docLang = document.documentElement.lang === 'en' ? 'en' : 'ru'

    const run = () => {
      if (reduceMotion()) {
        el.textContent = formatCount(target, docLang, suffix)
        return
      }
      const dur = 1100
      const start = performance.now()
      const tick = (now: number) => {
        const k = Math.min(1, (now - start) / dur)
        const eased = 1 - Math.pow(1 - k, 3)
        el.textContent = formatCount(target * eased, docLang, suffix)
        if (k < 1) requestAnimationFrame(tick)
      }
      el.textContent = formatCount(0, docLang, suffix)
      requestAnimationFrame(tick)
    }

    if (typeof IntersectionObserver === 'undefined') {
      run()
      return
    }
    const io = new IntersectionObserver(
      (entries, obs) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue
          run()
          obs.disconnect()
        }
      },
      { threshold: 0.4 },
    )
    io.observe(el)
  },
}
