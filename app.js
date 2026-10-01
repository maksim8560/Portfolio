/* ==========================================================================
   app.js — рендер карточек, переключение языка, анимации.
   Без зависимостей и без сборки.
   ========================================================================== */

(() => {
  'use strict';

  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const STORE_KEY = 'portfolio.lang';
  const THEMES = ['dark', 'light'];
  const lang = { current: 'ru' };

  /* ---------------------------------------------------------------- i18n */

  const t = (key) => (I18N[lang.current] && I18N[lang.current][key]) ?? I18N.ru[key] ?? key;

  function applyI18n() {
    // Словарь — локальный доверенный контент, поэтому innerHTML:
    // в текстах встречаются <code>, <em> и <br>.
    $$('[data-i18n]').forEach((el) => { el.innerHTML = t(el.dataset.i18n); });

    document.documentElement.lang = lang.current;
    $('.lang').dataset.lang = lang.current;
    $$('.lang-btn').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.setLang === lang.current)));
    $('#year').textContent = new Date().getFullYear();
  }

  function setLang(next, { persist = true } = {}) {
    if (!I18N[next] || next === lang.current) {
      if (next === lang.current) applyI18n();
      return;
    }
    lang.current = next;
    if (persist) { try { localStorage.setItem(STORE_KEY, next); } catch { /* приватный режим */ } }
    applyI18n();
    renderProjects();
    startConsole();
  }

  function detectLang() {
    let saved = null;
    try { saved = localStorage.getItem(STORE_KEY); } catch { /* пусто */ }

    const url = new URLSearchParams(location.search).get('lang');
    if (url && I18N[url]) return url;
    if (saved && I18N[saved]) return saved;

    return (navigator.language || '').toLowerCase().startsWith('ru') ? 'ru' : 'en';
  }

  /* -------------------------------------------------------------- ССЫЛКИ */

  /** Подставляет адреса из LINKS. Пустая строка → элемент скрыт. */
  function wireLink(el, url) {
    if (!url) { el.hidden = true; return false; }
    el.href = url;
    if (/^https?:/i.test(url)) { el.target = '_blank'; el.rel = 'noopener noreferrer'; }
    return true;
  }

  function wireGlobalLinks() {
    $$('[data-link]').forEach((el) => {
      const key = el.dataset.link;
      const url = LINKS[key] || '';
      const ok = wireLink(el, url);

      // Discord без ссылки — не мёртвая кнопка, а копирование ника.
      if (key === 'discord' && !ok) {
        const handle = (LINKS.discordHandle || '').trim();
        if (!handle) { el.hidden = true; return; }
        el.hidden = false;
        el.href = '#';
        el.removeAttribute('target');
        el.classList.add('is-copy');
        el.title = handle;
        el.addEventListener('click', (e) => { e.preventDefault(); copyHandle(handle, el); });
      }
    });
  }

  /** Копирование ника с подтверждением прямо на кнопке. */
  async function copyHandle(text, el) {
    const span = el.querySelector('span');
    const original = span ? span.textContent : '';
    let done = false;

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        done = true;
      }
    } catch { /* нужен запасной путь */ }

    if (!done) {
      // execCommand живёт в незащищённом контексте и в старых браузерах
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.cssText = 'position:fixed;top:-1000px;opacity:0';
      document.body.appendChild(ta);
      ta.select();
      try { done = document.execCommand('copy'); } catch { done = false; }
      ta.remove();
    }

    if (span) {
      span.textContent = done ? t('ct.copied') : text;
      el.classList.toggle('is-done', done);
      setTimeout(() => { span.textContent = original; el.classList.remove('is-done'); }, 1800);
    }
  }

  /* ------------------------------------------------------------ ПРОЕКТЫ */

  const ICON = {
    demo:  '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 4h7v7"/><path d="M20 4 10 14"/><path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/></svg>',
    repo:  '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18-6-6 6-6"/><path d="m15 6 6 6-6 6"/></svg>',
    apk:   '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M5 21h14"/></svg>',
  };

  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]
  ));

  /** Экранирует всё, кроме <code> и <em> — чтобы в тексте можно было
   *  писать `<code>msg:send</code>`, и он не превращался в видимую разметку. */
  const rich = (s) => esc(s)
    .replace(/&lt;code&gt;/g, '<code>').replace(/&lt;\/code&gt;/g, '</code>')
    .replace(/&lt;em&gt;/g, '<em>').replace(/&lt;\/em&gt;/g, '</em>');

  /** Выбирает нужный язык из объекта {ru, en}. */
  const pick = (o) => (o && typeof o === 'object' && 'ru' in o) ? o[lang.current] : o;

  function projectCard(p, i) {
    const L = p.links() || {};
    const id = String(i + 1).padStart(2, '0');

    const actions = [
      L.demo ? `<a class="btn btn-primary" data-x="demo">${ICON.demo}<span>${esc(t('p.demo'))}</span></a>` : '',
      L.apk  ? `<a class="btn btn-primary" data-x="apk">${ICON.apk}<span>${esc(t('p.apk'))}</span></a>` : '',
      L.repo ? `<a class="btn" data-x="repo">${ICON.repo}<span>${esc(t('p.repo'))}</span></a>` : '',
    ].filter(Boolean).join('');

    const metrics = (p.metrics || []).map((m) => `
      <div class="metric">
        <dd>${esc(m.v)}</dd>
        <dt>${esc(pick(m.l))}</dt>
      </div>`).join('');

    const chips = (p.stack || []).map((s) => `<li>${esc(s)}</li>`).join('');

    const feats = (p.features?.[lang.current] || []).map((f) => `<li>${rich(f)}</li>`).join('');
    const cuts = (p.cuts?.[lang.current] || []).map((c) => `
      <div class="cut">
        <h4>${esc(c.t)}</h4>
        <p>${rich(c.d)}</p>
      </div>`).join('');

    return `
      <article class="project glass reveal" id="${esc(p.id)}"
               style="--pa:${p.accent[0]}; --pb:${p.accent[1]}">
        <div class="project-inner">
          <div class="project-head">
            <span class="project-index">${id}</span>
            <div class="project-titles">
              <h3 class="project-name">${esc(pick(p.name))}<span class="aka">${esc(pick(p.aka))}</span></h3>
              <p class="project-tagline">${esc(pick(p.tagline))}</p>
            </div>
          </div>

          <div class="project-actions">${actions}</div>

          <p class="sub-h" style="margin-top:28px">${esc(t('p.metrics'))}</p>
          <div class="metrics">${metrics}</div>

          <p class="sub-h">${esc(t('p.stack'))}</p>
          <ul class="chips">${chips}</ul>

          <div class="project-cols">
            <div>
              <p class="sub-h">${esc(t('p.inside'))}</p>
              <ul class="feat">${feats}</ul>
            </div>
            <div>
              <p class="sub-h">${esc(t('p.cuts'))}</p>
              <div class="cuts">${cuts}</div>
            </div>
          </div>
        </div>
      </article>`;
  }

  function renderProjects() {
    const host = $('#projects');
    if (!host) return;
    host.innerHTML = PROJECTS.map(projectCard).join('');

    // кнопки внутри карточек получают настоящие адреса уже после вставки
    $$('#projects [data-x]').forEach((el) => {
      const card = el.closest('.project');
      const p = PROJECTS.find((x) => x.id === card?.id);
      wireLink(el, p?.links?.()?.[el.dataset.x] || '');
    });

    observeReveal();
  }

  /* ------------------------------------------------------- ЖУРНАЛ В HERO */

  let consoleTimer = null;

  function startConsole() {
    const host = $('#consoleBody');
    if (!host) return;
    clearInterval(consoleTimer);
    host.innerHTML = '';

    const lines = I18N[lang.current]['console.lines'];
    const shown = 4;
    let i = 0;

    const draw = () => {
      const visible = [];
      for (let k = 0; k < shown; k++) visible.push(lines[(i + k) % lines.length]);

      // анимируется только свежая строка — иначе весь блок мигает раз в 2.6 с
      host.innerHTML = visible
        .map((l, n) => `<li class="log-line${n === 0 ? ' is-new' : ''}">
            <b>${String(((i + n) % 1000) + 1).padStart(3, '0')}</b><span>${esc(l)}</span></li>`)
        .join('') + '<li class="log-line"><b>&nbsp;</b><span class="cursor"></span></li>';
    };

    draw();
    if (reduceMotion) return;                       // статичный кадр, без мигания
    consoleTimer = setInterval(draw, 2600);
  }

  /* ---------------------------------------------------------- АНИМАЦИИ */

  let revealObserver = null;

  function observeReveal() {
    const items = $$('.reveal:not(.is-in)');

    // Страница открыта в фоне: смотреть некому, а IntersectionObserver
    // в скрытой вкладке может не сработать вовсе. Показываем всё сразу —
    // иначе кто-то увидит пустоту вместо текста.
    if (reduceMotion || document.hidden || !('IntersectionObserver' in window)) {
      items.forEach((el) => el.classList.add('is-in'));
      return;
    }
    if (!revealObserver) {
      revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          e.target.classList.add('is-in');
          revealObserver.unobserve(e.target);
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });
    }
    items.forEach((el) => revealObserver.observe(el));
  }

  function animateCount(el) {
    const target = Number(el.dataset.count || 0);
    const suffix = el.dataset.countSuffix || '';
    if (reduceMotion) { el.textContent = fmt(target) + suffix; return; }

    const dur = 1100;
    const start = performance.now();
    const fmt0 = new Intl.NumberFormat(lang.current === 'ru' ? 'ru-RU' : 'en-US');

    const fmt = (n) => fmt0.format(Math.round(n)) + suffix;

    const tick = (now) => {
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - t, 3);       // outCubic
      el.textContent = fmt(target * eased);
      if (t < 1) requestAnimationFrame(tick);
    };
    el.textContent = fmt(0);
    requestAnimationFrame(tick);
  }

  function observeCounters() {
    const els = $$('[data-count]');
    if (!('IntersectionObserver' in window)) { els.forEach(animateCount); return; }

    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        animateCount(e.target);
        io.unobserve(e.target);
      });
    }, { threshold: 0.4 });

    els.forEach((el) => io.observe(el));
  }

  /* ------------------------------------------------------ ШАПКА И НАВИГАЦИЯ */

  function observeNav() {
    const bar = $('#topbar');
    const links = $$('.nav a');
    const map = new Map(links.map((a) => [a.getAttribute('href').slice(1), a]));

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        bar?.classList.toggle('is-stuck', window.scrollY > 12);

        // активная секция — последняя, чей верх уже прошёл треть экрана
        let current = null;
        for (const id of map.keys()) {
          const sec = document.getElementById(id);
          if (sec && sec.getBoundingClientRect().top <= window.innerHeight * 0.32) current = id;
        }
        links.forEach((a) => a.classList.toggle('is-active', a === map.get(current)));
        ticking = false;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ------------------------------------------------------------- ТЕМА */

  function initTheme() {
    let saved = null;
    try { saved = localStorage.getItem('portfolio.theme'); } catch { /* пусто */ }

    const initial = saved && THEMES.includes(saved)
      ? saved
      : (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');

    document.documentElement.dataset.theme = initial;
  }

  /* --------------------------------------------------- УРОВЕНЬ НАГРУЗКИ */

  /* Идея из Aura: сначала смотрим на систему, потом меряем, и понижаем
     уровень только если кадры действительно не идут. Не «на всякий случай».
     Дорогое здесь — backdrop-filter (19 панелей) и полноэкранное зерно. */
  function perfTier() {
    const root = document.documentElement;
    const lite = () => root.setAttribute('data-perf', 'lite');

    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { lite(); return; }
    if (!('IntersectionObserver' in window) || !('requestAnimationFrame' in window)) { lite(); return; }
    if (document.hidden) return;                 // в фоновой вкладке кадры врут

    // даём первой отрисовке закончиться, иначе меряем загрузку, а не страницу
    setTimeout(() => {
      const samples = [];
      let last = performance.now();
      const started = last;

      const tick = (now) => {
        samples.push(now - last);
        last = now;
        if (now - started < 900 && samples.length < 90) {
          requestAnimationFrame(tick);
          return;
        }
        if (samples.length < 8) return;          // слишком мало данных — не выносим вердикт
        const sorted = samples.slice(1).sort((a, b) => a - b);
        const median = sorted[Math.floor(sorted.length / 2)];
        if (median > 20) lite();                 // ниже ~50 fps
      };
      requestAnimationFrame(tick);
    }, 350);
  }

  /* --------------------------------------------------------------- СТАРТ */

  function boot() {
    lang.current = detectLang();
    initTheme();
    applyI18n();
    renderProjects();
    wireGlobalLinks();
    startConsole();
    observeCounters();
    observeNav();
    perfTier();

    $$('.lang-btn').forEach((b) => {
      b.addEventListener('click', () => setLang(b.dataset.setLang));
    });

    observeReveal();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
