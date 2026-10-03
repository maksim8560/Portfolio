<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { LINKS, PROJECTS } from './content'
import { useLang } from './i18n'
import { vCount, vReveal } from './directives'
import ConsoleLog from './components/ConsoleLog.vue'
import DiscordButton from './components/DiscordButton.vue'
import ProjectCard from './components/ProjectCard.vue'
import TopoField from './components/TopoField.vue'

const { lang, setLang, t } = useLang()

const year = new Date().getFullYear()

const reduceMotion =
  typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches

/* ---------- язык в <html lang> ---------- */
watch(
  lang,
  (l) => {
    document.documentElement.lang = l
  },
  { immediate: true },
)

/* ---------- тема: тёмная по умолчанию, светлая из системы ---------- */
const THEMES = ['dark', 'light'] as const
function initTheme(): void {
  let saved: string | null = null
  try {
    saved = localStorage.getItem('portfolio.theme')
  } catch {
    /* пусто */
  }
  document.documentElement.dataset.theme =
    saved && (THEMES as readonly string[]).includes(saved)
      ? saved
      : matchMedia('(prefers-color-scheme: light)').matches
        ? 'light'
        : 'dark'
}
initTheme()

/* ---------- цифры ---------- */
interface Stat {
  count: number
  suffix?: string
  labelKey: string
}
const stats: Stat[] = [
  { count: 3, labelKey: 'stats.k1' },
  { count: 59000, labelKey: 'stats.k2' },
  { count: 600, suffix: '+', labelKey: 'stats.k3' },
  { count: 0, labelKey: 'stats.k4' },
]

/* ---------- принципы ---------- */
const creeds = computed(() =>
  [1, 2, 3, 4, 5, 6].map((n) => ({
    num: String(n).padStart(2, '0'),
    title: t(`ap.c${n}.t`),
    body: t(`ap.c${n}.d`),
  })),
)

/* ---------- активный пункт меню ---------- */
const SECTION_IDS = ['work', 'approach', 'contact'] as const
const activeSection = ref<string | null>(null)
let ticking = false
function onScroll(): void {
  if (ticking) return
  ticking = true
  requestAnimationFrame(() => {
    let current: string | null = null
    for (const id of SECTION_IDS) {
      const sec = document.getElementById(id)
      if (sec && sec.getBoundingClientRect().top <= window.innerHeight * 0.32) current = id
    }
    activeSection.value = current
    ticking = false
  })
}
onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
})

/* ---------- уровень нагрузки ---------- */
function perfTier(): void {
  const root = document.documentElement
  const lite = () => root.setAttribute('data-perf', 'lite')

  if (reduceMotion) {
    lite()
    return
  }
  if (!('IntersectionObserver' in window) || !('requestAnimationFrame' in window)) {
    lite()
    return
  }
  if (document.hidden) return // в фоновой вкладке кадры врут

  // даём первой отрисовке закончиться, иначе меряем загрузку, а не страницу
  setTimeout(() => {
    const samples: number[] = []
    let last = performance.now()
    const started = last

    const tick = (now: number) => {
      samples.push(now - last)
      last = now
      if (now - started < 900 && samples.length < 90) {
        requestAnimationFrame(tick)
        return
      }
      if (samples.length < 8) return // слишком мало данных — не выносим вердикт
      const sorted = samples.slice(1).sort((a, b) => a - b)
      const median = sorted[Math.floor(sorted.length / 2)] ?? 0
      if (median > 20) lite() // ниже ~50 fps
    }
    requestAnimationFrame(tick)
  }, 350)
}
onMounted(perfTier)
</script>

<template>
  <a class="skip" href="#work">{{ t('a11y.skip') }}</a>

  <TopoField />

  <!-- ============================ HEADER ============================ -->
  <header class="topbar" id="topbar">
    <a class="brand" href="#top">
      <b>{{ t('nav.name') }}</b>
      <i>{{ t('nav.role') }}</i>
    </a>

    <nav class="nav" aria-label="Разделы">
      <a href="#work" :class="{ 'is-active': activeSection === 'work' }">{{ t('nav.work') }}</a>
      <a href="#approach" :class="{ 'is-active': activeSection === 'approach' }">{{
        t('nav.approach')
      }}</a>
      <a href="#contact" :class="{ 'is-active': activeSection === 'contact' }">{{
        t('nav.contact')
      }}</a>
    </nav>

    <div class="lang" role="group" aria-label="Язык / Language">
      <button
        type="button"
        class="lang-btn"
        data-set-lang="ru"
        :aria-pressed="lang === 'ru'"
        @click="setLang('ru')"
      >
        Ru
      </button>
      <button
        type="button"
        class="lang-btn"
        data-set-lang="en"
        :aria-pressed="lang === 'en'"
        @click="setLang('en')"
      >
        En
      </button>
    </div>
  </header>

  <main id="top">
    <!-- ============================ HERO ============================ -->
    <section class="hero">
      <div class="wrap">
        <p class="kicker" v-reveal>{{ t('hero.kicker') }}</p>

        <h1 class="display" v-reveal>
          <span class="display-line">{{ t('hero.line1') }}</span>
          <span class="display-row">
            <a class="btn-pill" href="#work"
              ><span>{{ t('hero.cta.work') }}</span></a
            >
            <a class="btn-arrow" href="#work" :aria-label="t('hero.cta.work')">
              <svg
                viewBox="0 0 24 24"
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </a>
          </span>
          <span class="display-line right">{{ t('hero.line2') }}</span>
        </h1>

        <p class="hero-lead" v-reveal>{{ t('hero.lead') }}</p>

        <div class="socials" v-reveal>
          <DiscordButton />
          <a v-if="LINKS.telegram" class="pill" :href="LINKS.telegram">
            <span class="pill-dot" aria-hidden="true"></span
            ><span>{{ t('ct.telegram') }}</span>
          </a>
        </div>

        <ConsoleLog />
      </div>
    </section>

    <!-- ============================ STATS ============================ -->
    <section class="stats-wrap" aria-label="Цифры">
      <div class="stats" id="stats">
        <div v-for="s in stats" :key="s.labelKey" class="stat" v-reveal>
          <div class="stat-num">
            <span v-count="s.count" :data-count-suffix="s.suffix ?? ''">0</span>
          </div>
          <div class="stat-label">{{ t(s.labelKey) }}</div>
        </div>
      </div>
    </section>

    <!-- ============================ WORK ============================ -->
    <section id="work" class="section">
      <div class="wrap">
        <p class="kicker" v-reveal>{{ t('work.kicker') }}</p>
        <h2 class="mega right" v-reveal>{{ t('work.title') }}</h2>
        <p class="section-lead" v-reveal>{{ t('work.lead') }}</p>

        <div id="projects" class="projects">
          <ProjectCard v-for="(p, i) in PROJECTS" :key="p.id" :project="p" :index="i" />
        </div>
      </div>
    </section>

    <!-- ============================ APPROACH ============================ -->
    <section id="approach" class="section">
      <div class="wrap">
        <p class="kicker" v-reveal>{{ t('ap.kicker') }}</p>
        <h2 class="mega" v-reveal>{{ t('ap.title') }}</h2>
        <p class="section-lead" v-reveal>{{ t('ap.lead') }}</p>

        <ul class="creeds">
          <li v-for="c in creeds" :key="c.num" class="creed" v-reveal>
            <span class="creed-num">{{ c.num }}</span>
            <h3>{{ c.title }}</h3>
            <p v-html="c.body"></p>
          </li>
        </ul>
      </div>
    </section>

    <!-- ============================ CONTACT ============================ -->
    <section id="contact" class="section">
      <div class="wrap">
        <p class="kicker" v-reveal>{{ t('ct.kicker') }}</p>
        <h2 class="mega" v-reveal>{{ t('ct.title') }}</h2>
        <p class="section-lead" v-reveal>{{ t('ct.lead') }}</p>

        <div class="socials" v-reveal>
          <DiscordButton big />
          <a v-if="LINKS.telegram" class="pill pill-big" :href="LINKS.telegram">
            <span class="pill-dot" aria-hidden="true"></span
            ><span>{{ t('ct.telegram') }}</span>
          </a>
        </div>

        <p class="work-note" v-reveal>{{ t('ct.note') }}</p>
      </div>
    </section>
  </main>

  <footer class="footer">
    <p>{{ t('footer.note') }}</p>
    <p class="footer-meta">{{ year }}</p>
  </footer>
</template>
