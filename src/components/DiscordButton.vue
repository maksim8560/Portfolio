<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
import { LINKS } from '../content'
import { useLang } from '../i18n'

defineProps<{ big?: boolean }>()

const { t } = useLang()
const done = ref(false)
let timer: number | undefined

async function copyHandle(): Promise<void> {
  const handle = LINKS.discordHandle.trim()
  if (!handle) return
  let ok = false
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(handle)
      ok = true
    }
  } catch {
    /* нужен запасной путь */
  }
  if (!ok) {
    // execCommand живёт в незащищённом контексте и в старых браузерах
    const ta = document.createElement('textarea')
    ta.value = handle
    ta.setAttribute('readonly', '')
    ta.style.cssText = 'position:fixed;top:-1000px;opacity:0'
    document.body.appendChild(ta)
    ta.select()
    try {
      ok = document.execCommand('copy')
    } catch {
      ok = false
    }
    ta.remove()
  }
  done.value = ok
  if (timer !== undefined) clearTimeout(timer)
  timer = window.setTimeout(() => {
    done.value = false
  }, 1800)
}

onBeforeUnmount(() => {
  if (timer !== undefined) clearTimeout(timer)
})
</script>

<template>
  <a
    v-if="LINKS.discord"
    class="pill"
    :class="{ 'pill-big': big }"
    :href="LINKS.discord"
    target="_blank"
    rel="noopener noreferrer"
  >
    <span class="pill-dot" aria-hidden="true"></span><span>{{ t('ct.discord') }}</span>
  </a>
  <button
    v-else
    type="button"
    class="pill is-copy"
    :class="[{ 'is-done': done }, { 'pill-big': big }]"
    :title="LINKS.discordHandle"
    @click="copyHandle"
  >
    <span class="pill-dot" aria-hidden="true"></span
    ><span>{{ done ? t('ct.copied') : t('ct.discord') }}</span>
  </button>
</template>
