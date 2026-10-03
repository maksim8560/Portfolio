<script setup lang="ts">
import { computed } from 'vue'
import type { Lang, Project } from '../content'
import { useLang } from '../i18n'
import { vReveal } from '../directives'

const props = defineProps<{
  project: Project
  index: number
}>()

const { lang, t } = useLang()

const links = computed(() => props.project.links())
const num = computed(() => String(props.index + 1).padStart(2, '0'))
const l = computed((): Lang => lang.value)

/** Экранирует всё, кроме <code> и <em> — доверенный локальный контент. */
function rich(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/&lt;code&gt;/g, '<code>')
    .replace(/&lt;\/code&gt;/g, '</code>')
    .replace(/&lt;em&gt;/g, '<em>')
    .replace(/&lt;\/em&gt;/g, '</em>')
}

/** Настоящий адрес кнопки — для data-x больше нет нужды в пост-обработке. */
function hrefFor(kind: 'demo' | 'apk'): string {
  return links.value[kind] ?? '#'
}

function externalAttrs(url: string): Record<string, string> {
  return /^https?:/i.test(url) ? { target: '_blank', rel: 'noopener noreferrer' } : {}
}
</script>

<template>
  <article :id="project.id" v-reveal class="project">
    <div class="project-visual" aria-hidden="true">
      <span class="project-num">{{ num }}</span>
      <span class="project-aka">{{ project.aka[l] }}</span>
    </div>
    <div class="project-body">
      <div class="project-head">
        <div class="project-titles">
          <h3 class="project-name">{{ project.name[l] }}</h3>
          <p class="project-tagline">{{ project.tagline[l] }}</p>
        </div>
        <div class="project-actions">
          <template v-if="links.demo">
            <a class="btn-pill" :href="hrefFor('demo')" v-bind="externalAttrs(links.demo)">
              <span>{{ t('p.demo') }}</span>
            </a>
            <a
              class="btn-arrow"
              :href="hrefFor('demo')"
              v-bind="externalAttrs(links.demo)"
              :aria-label="project.name[l] + ' — ' + t('p.demo')"
            >
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
          </template>
          <a v-if="links.apk" class="btn-pill" :href="hrefFor('apk')" v-bind="externalAttrs(links.apk)">
            <span>{{ t('p.apk') }}</span>
          </a>
        </div>
      </div>

      <p class="sub-h">{{ t('p.stack') }}</p>
      <ul class="chips">
        <li v-for="tag in project.stack" :key="tag">{{ tag }}</li>
      </ul>

      <p class="sub-h">{{ t('p.metrics') }}</p>
      <div class="metrics">
        <div v-for="m in project.metrics" :key="m.v" class="metric">
          <div class="metric-num">{{ m.v }}</div>
          <div class="metric-label">{{ m.l[l] }}</div>
        </div>
      </div>

      <div class="project-cols">
        <div>
          <p class="sub-h">{{ t('p.inside') }}</p>
          <ul class="feat">
            <li v-for="(f, i) in project.features[l]" :key="i" v-html="rich(f)"></li>
          </ul>
        </div>
        <div>
          <p class="sub-h">{{ t('p.cuts') }}</p>
          <div class="cuts">
            <div v-for="(c, i) in project.cuts[l]" :key="i" class="cut">
              <h4>{{ c.t }}</h4>
              <p v-html="rich(c.d)"></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </article>
</template>
