<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from 'vue'
import { useLang } from '../i18n'
import { vReveal } from '../directives'

const { lang, t, tLines } = useLang()

const reduceMotion =
  typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches

const SHOWN = 4
const visible = ref<string[]>([])
const tick = ref(0)
let timer: number | undefined

function draw(): void {
  const lines = tLines('console.lines')
  const out: string[] = []
  for (let k = 0; k < SHOWN; k++) out.push(lines[(tick.value + k) % lines.length] ?? '')
  visible.value = out
}

function restart(): void {
  if (timer !== undefined) {
    clearInterval(timer)
    timer = undefined
  }
  draw()
  if (reduceMotion) return // статичный кадр, без мигания
  timer = window.setInterval(() => {
    tick.value += 1
    draw()
  }, 2600)
}

// смена языка перетасовывает строки — перезапускаем цикл
watch(lang, restart)
restart()

onBeforeUnmount(() => {
  if (timer !== undefined) clearInterval(timer)
})
</script>

<template>
  <aside class="log" v-reveal aria-label="Рабочий журнал">
    <div class="log-head">
      <span class="log-title">{{ t('hero.console') }}</span>
    </div>
    <ol class="log-body">
      <li
        v-for="(line, n) in visible"
        :key="tick + '-' + n"
        :class="['log-line', { 'is-new': n === 0 }]"
      >
        <b>{{ String(((tick + n) % 1000) + 1).padStart(3, '0') }}</b
        ><span>{{ line }}</span>
      </li>
      <li class="log-line"><b>&nbsp;</b><span class="cursor"></span></li>
    </ol>
  </aside>
</template>
