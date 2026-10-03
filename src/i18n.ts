import { computed, ref } from 'vue'
import { I18N, type DictValue, type Lang } from './content'

const STORE_KEY = 'portfolio.lang'

function detectLang(): Lang {
  let saved: string | null = null
  try {
    saved = localStorage.getItem(STORE_KEY)
  } catch {
    /* приватный режим — живём без памяти */
  }

  const fromUrl = new URLSearchParams(location.search).get('lang')
  if (fromUrl === 'ru' || fromUrl === 'en') return fromUrl
  if (saved === 'ru' || saved === 'en') return saved

  return (navigator.language || '').toLowerCase().startsWith('ru') ? 'ru' : 'en'
}

const current = ref<Lang>(detectLang())

function setLang(next: Lang): void {
  if (current.value === next) return
  current.value = next
  try {
    localStorage.setItem(STORE_KEY, next)
  } catch {
    /* приватный режим */
  }
  document.documentElement.lang = next
}

/** Строка из словаря. Словарь — локальный доверенный контент. */
function t(key: string): string {
  const v: DictValue | undefined = I18N[current.value][key] ?? I18N.ru[key]
  return typeof v === 'string' ? v : key
}

/** Строки из словаря (для журнала). */
function tLines(key: string): readonly string[] {
  const v: DictValue | undefined = I18N[current.value][key] ?? I18N.ru[key]
  return Array.isArray(v) ? v : []
}

const lang = computed(() => current.value)

export function useLang() {
  return { lang, setLang, t, tLines }
}
