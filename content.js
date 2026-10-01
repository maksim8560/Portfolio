/* ==========================================================================
   content.js — всё содержимое сайта в одном месте.
   --------------------------------------------------------------------------
   ПРАВИТЕЛЬНОЕ МЕСТО ДЛЯ ССЫЛОК НА ДЕМО → см. LINKS ниже.
   Просто вставь URL в поле, и кнопка появится сама. Пустая строка = кнопка скрыта.

   Ссылки на исходный код намеренно НЕ выведены на страницу — наружу
   смотрят только живые проекты.
   ========================================================================== */

const LINKS = {
  // Discord: либо ссылка на профиль — тогда кнопка обычная,
  // либо пусто — тогда кнопка копирует ник в буфер обмена.
  discord:  '',
  discordHandle: 'MaxDiWay',

  telegram: '',   // ← https://t.me/...

  resume:   '',   // ← ссылка на PDF резюме

  aura: {
    demo:    'https://aura-messenger-q5yk.onrender.com/',   // ← живой адрес Aura
    apk:     '',   // ← ссылка на APK, если хочешь кнопку «Скачать APK»
    // repo:  'https://github.com/maksim8560/Aura-',
  },

  sonora: {
    demo:    'https://maksim8560.github.io/music-app/',   // ← живой адрес Sonora
  },

  filedropper: {
    demo:    'https://filedropper-api.sonora-online.workers.dev/#/',   // ← живой адрес FileDropper
  },
};


/* ==========================================================================
   СЛОВАРЬ ПЕРЕВОДОВ
   ========================================================================== */

const I18N = {

ru: {
  'a11y.skip': 'К проектам',

  'nav.name': 'MaxDiWay (Максим)',
  'nav.role': 'разработчик',
  'nav.work': 'Проекты',
  'nav.approach': 'Подход',
  'nav.stack': 'Стек',
  'nav.contact': 'Контакты',

  'hero.eyebrow': 'Портфолио · 2026',
  'hero.title': 'Делаю продукты,<br />которые <em>честно работают</em>',
  'hero.lead': 'Шифрование, которое действительно шифрует. Загрузки, которые не упираются в лимит платформы. Интерфейс, который не притворяется, что знает больше, чем знает.',
  'hero.cta.work': 'Смотреть проекты',
  'hero.cta.resume': 'Резюме',
  'hero.console': 'рабочий журнал',

  'console.lines': [
    'durability: ждём зеркало перед ack',
    'turn: Allocate 401 → это запрос пароля',
    'storage: configured ≠ reachable',
    'sonora: @property × 19 токенов',
    'files: байты не проходят через worker',
    'guard: 20 паттернов, ru + en',
    'ui: лучше пусто, чем выдумано',
  ],

  'stats.k1': 'Проекта в продакшене',
  'stats.k2': 'Строк кода',
  'stats.k3': 'Автоматических проверок',
  'stats.k4': 'UI-фреймворков',

  'work.kicker': '01 — Проекты',
  'work.title': 'Что сделано',
  'work.lead': 'Три продукта, каждый доведён до публичного деплоя. Ниже — не фичи списком, а то, что на самом деле оказалось сложным.',

  'ap.kicker': '02 — Подход',
  'ap.title': 'Принципы, которые повторяются',
  'ap.lead': 'Они выросли из конкретных отказов, а не из методологии. Каждый пункт ниже — это то, что пришлось переделать, потому что «и так работало» оказалось неправдой.',

  'ap.c1.t': '«Настроено» ≠ «работает»',
  'ap.c1.d': 'Зеркало, TURN, хранилище, почта — каждая подсистема отдаёт <code>configured</code> и <code>reachable</code> отдельными полями. Потому что однажды хранилище отвечало 502 целый день, а код проверял только, что переменные окружения проставлены.',
  'ap.c2.t': 'Долговечность важнее удобства API',
  'ap.c2.d': '«Отправлено» значит «сохранено». Ответ клиенту ждёт, пока запись действительно легла на диск и в зеркало. Тест растягивает окно до трёх секунд, убивает процесс <code>SIGKILL</code> внутри него и требует, чтобы переписка вернулась целиком.',
  'ap.c3.t': 'Честный интерфейс лучше красивого',
  'ap.c3.d': 'Счётчик посетителей не показывает ноль, пока сервер не ответил «нет данных». Плеер не рисует спектрограмму у потока, который не прошёл через аудио-граф. Если система деградировала — на странице висит табличка с командой, которую надо выполнить, а не пустая 500.',
  'ap.c4.t': 'Зависимость — это решение',
  'ap.c4.d': 'Один из проектов живёт вообще без npm-пакетов: свой бандлер, свой парсер ID3, свой STUN/TURN-клиент, свой PRNG. Не из любви к аскетизму — а потому что лишняя зависимость в чужом реестре обновляется не в твой день релизов.',
  'ap.c5.t': 'Тест, который не может упасть, — не тест',
  'ap.c5.d': 'Один из скриптов проверки админки печатал отчёт и всегда завершался с нулём — он ничего не проверял. Другой держит зеркало на 800 мс, чтобы окно стало фактом, а не гонкой. Третий поднимает настоящий SMTP-сервер прямо в тесте, чтобы проверить отправку кода.',
  'ap.c6.t': 'Комментарий — это запись о причине',
  'ap.c6.d': 'В коде ~35–40 % строк — комментарии, и почти каждый объясняет не что делает код, а какой отказ породил эту строку. Через год это единственное, что спасёт, когда архитектуру придётся менять.',

  'st.kicker': '03 — Стек',
  'st.title': 'Инструменты',
  'st.lead': 'Всё, с чем реально работал. Подчёркнуто то, что написано руками, а не взято из коробки.',
  'st.c1': 'Языки',
  'st.c2': 'Интерфейс',
  'st.c3': 'Бэкенд',
  'st.c4': 'Мобильные',
  'st.c5': 'Инфраструктура',
  'st.c6': 'Руками',

  'ct.kicker': '04 — Контакты',
  'ct.title': 'Давайте поговорим',
  'ct.lead': 'Открыт к задачам, где есть нетривиальная инженерная часть: шифрование, realtime, медиапайплайны, деплой на бесплатных тарифах.',
  'ct.discord': 'Discord MaxDiWay',
  'ct.telegram': 'Telegram',
  'ct.email': 'savin.maksim952@yandex.ru',

  'ct.copied': 'Ник скопирован',

  'footer.note': 'Сделано без фреймворков и сборщиков — так же, как проекты на этой странице.',
  'footer.russian': 'Русский / English',

  'p.demo': 'Демо',
  'p.repo': 'Код',
  'p.apk': 'Скачать APK',
  'p.inside': 'Что внутри',
  'p.cuts': 'Где было сложно',
  'p.metrics': 'Метрики',
  'p.stack': 'Стек',
},

en: {
  'a11y.skip': 'Skip to projects',

  'nav.name': 'MaxDiWay (Maksim)',
  'nav.role': 'developer',
  'nav.work': 'Work',
  'nav.approach': 'Approach',
  'nav.stack': 'Stack',
  'nav.contact': 'Contact',

  'hero.eyebrow': 'Portfolio · 2026',
  'hero.title': 'I build products that<br /><em>honestly work</em>',
  'hero.lead': 'Encryption that actually encrypts. Uploads that never hit a platform limit. An interface that never pretends to know more than it does.',
  'hero.cta.work': 'See the work',
  'hero.cta.resume': 'Résumé',
  'hero.console': 'work log',

  'console.lines': [
    'durability: await the mirror before ack',
    'turn: Allocate 401 means "send a credential"',
    'storage: configured ≠ reachable',
    'sonora: @property × 19 tokens',
    'files: bytes never touch the worker',
    'guard: 20 patterns, ru + en',
    'ui: better empty than invented',
  ],

  'stats.k1': 'Products in production',
  'stats.k2': 'Lines of code',
  'stats.k3': 'Automated assertions',
  'stats.k4': 'UI frameworks',

  'work.kicker': '01 — Work',
  'work.title': 'What got built',
  'work.lead': 'Three products, each one shipped to a public deployment. Below is not a feature list — it is what actually turned out to be hard.',

  'ap.kicker': '02 — Approach',
  'ap.title': 'Principles that repeat',
  'ap.lead': 'They grew out of specific failures, not out of a methodology. Each item below is something that had to be rewritten because "it works fine" turned out to be untrue.',

  'ap.c1.t': '"Configured" ≠ "working"',
  'ap.c1.d': 'The mirror, TURN, storage, mail — every subsystem reports <code>configured</code> and <code>reachable</code> as separate fields. Because once the store answered 502 for a whole day while the code only checked that the environment variables were set.',
  'ap.c2.t': 'Durability beats a convenient API',
  'ap.c2.d': '"Sent" means "kept". The client response waits until the write has actually landed on disk and in the mirror. One test stretches that window to three seconds, <code>SIGKILL</code>s the process inside it, and demands the whole thread come back.',
  'ap.c3.t': 'An honest UI beats a pretty one',
  'ap.c3.d': 'The visitor counter shows nothing until the server has actually answered "no data". The player draws no spectrum for a stream that never entered the audio graph. When the system degrades you get a notice with the exact command to run — not a blank 500.',
  'ap.c4.t': 'A dependency is a decision',
  'ap.c4.d': 'One of these projects runs on no npm packages at all: its own bundler, its own ID3 parser, its own STUN/TURN client, its own PRNG. Not out of asceticism — because somebody else\'s dependency updates on somebody else\'s release day.',
  'ap.c5.t': 'A test that cannot fail is not a test',
  'ap.c5.d': 'One admin verification script printed a report and always exited zero — it verified nothing. Another holds the mirror at 800 ms so the window becomes a fact rather than a race. A third spins up a real SMTP server inside the test to check the code email.',
  'ap.c6.t': 'A comment is a record of the reason',
  'ap.c6.d': 'Roughly 35–40 % of these codebases are comments, and almost every one explains not what the line does but which failure produced it. A year from now that is the only thing that saves you when the architecture has to change.',

  'st.kicker': '03 — Stack',
  'st.title': 'Tools',
  'st.lead': 'Everything actually worked with. What was written by hand rather than unboxed is called out.',
  'st.c1': 'Languages',
  'st.c2': 'Interface',
  'st.c3': 'Backend',
  'st.c4': 'Mobile',
  'st.c5': 'Infrastructure',
  'st.c6': 'By hand',

  'ct.kicker': '04 — Contact',
  'ct.title': 'Let\'s talk',
  'ct.lead': 'Open to work where the engineering is the interesting part: encryption, realtime, media pipelines, deploying on free tiers.',
  'ct.discord': 'Discord MaxDiWay',
  'ct.telegram': 'Telegram',
  'ct.email': 'savin.maksim952@yandex.ru',

  'ct.copied': 'Handle copied',

  'footer.note': 'Built with no frameworks and no bundler — same as the projects on this page.',
  'footer.russian': 'Русский / English',

  'p.demo': 'Live demo',
  'p.repo': 'Source',
  'p.apk': 'Download APK',
  'p.inside': "What's inside",
  'p.cuts': 'Where it got hard',
  'p.metrics': 'Metrics',
  'p.stack': 'Stack',
},

};


/* ==========================================================================
   ПРОЕКТЫ
   Каждый объект двуязычный: { ru: '...', en: '...' }
   ========================================================================== */

const PROJECTS = [
  {
    id: 'aura',
    accent: ['#7c8cff', '#c07cff'],
    links: () => LINKS.aura,

    name:   { ru: 'Aura',  en: 'Aura' },
    aka:    { ru: 'мессенджер',  en: 'messenger' },
    tagline: {
      ru: 'Сквозное шифрование, WebRTC-звонки и голосовые — в интерфейсе из жидкого стекла.',
      en: 'End-to-end encryption, WebRTC calls and voice notes inside a liquid-glass interface.',
    },

    metrics: [
      { v: '41 300', l: { ru: 'строк кода',    en: 'lines of code' } },
      { v: '~500',   l: { ru: 'проверок',      en: 'assertions' } },
      { v: '4',      l: { ru: 'зависимости',  en: 'dependencies' } },
      { v: '80',     l: { ru: 'REST-маршрутов', en: 'REST routes' } },
    ],

    stack: ['Node.js', 'Express', 'Socket.IO', 'WebCrypto', 'WebRTC', 'Web Audio', 'Cloudflare Workers', 'Docker', 'Render', 'Android'],

    features: {
      ru: [
        'Сквозное шифрование: ECDH P-256 → HKDF → AES-256-GCM. Сервер хранит только <code>{iv, ct}</code> и никогда не видит открытый текст.',
        'Звонки один-на-один и групповые (mesh до 6 человек). SDP и ICE тоже шифруются ключом чата — сигнальный сервер только пересылает конверты.',
        'Голосовые сообщения: запись, волновая форма из декодированного аудио, расшифровка речи, скорость воспроизведения.',
        'Ключевое хранилище: приватная часть ключа запечатана PBKDF2 на 600 000 итераций, 512 бит делятся на ключ AES и ключ HMAC, схема encrypt-then-MAC.',
        'RBAC с арифметикой иерархии: 9 прав, роль не может оказаться на уровне ниже автора, владелец неприкосновенен.',
        'Фильтр prompt-injection на 20 паттернов сразу на английском и русском, со свёркой кириллических гомоглифов — и 75 строк-контрпримеров в тестах.',
      ],
      en: [
        'End-to-end encryption: ECDH P-256 → HKDF → AES-256-GCM. The server stores only <code>{iv, ct}</code> and never sees plaintext.',
        '1:1 and group calls (mesh, up to 6). SDP and ICE are encrypted under the conversation key too — the signalling server only forwards envelopes.',
        'Voice notes: recording, a waveform decoded from the audio itself, inline transcript, playback speed.',
        'Key vault: the private half is sealed with 600 000 PBKDF2 iterations, 512 bits split into an AES key and an HMAC key, encrypt-then-MAC.',
        'RBAC with hierarchy arithmetic: 9 permissions, a role may never sit below its own author, the owner anchor is untouchable.',
        'A prompt-injection guard across 20 patterns in English and Russian at once, including Cyrillic homoglyph folding — with 75 counter-example strings in the tests.',
      ],
    },

    cuts: {
      ru: [
        {
          t: '«Отправлено» = «сохранено»',
          d: 'Асинхронная запись в зеркало возвращала пустоту: отправителю уже сказали «отправлено», а на диске сообщения ещё не было, и процесс успевал умереть внутри окна. Теперь <code>msg:send</code> ждёт конкретно свою запись — и отдельно ждёт, чтобы строка самого чата появилась первой. Тест растягивает окно до 3 с, делает <code>SIGKILL</code> и требует вернуть переписку целиком.',
        },
        {
          t: 'TURN-клиент, написанный вручную',
          d: '797 строк: кодирование STUN/TURN по RFC 5389 / 5766 / 6062 / 4571 поверх UDP, TCP и TLS, плюс живой пробой Allocate. Первый 401 — это запрос учётных данных, второй — неверный секрет; раньше health-check отвечал на собственный 401 вечно и слал 79 788 сообщений одному серверу.',
        },
        {
          t: 'Три уровня хранения',
          d: 'Диск — кэш, Upstash Redis — зеркало документов, Upstash Blob — байты. Упавший бэкенд никогда не бросает исключение: <code>put</code> возвращает false, а «нет файла» и «бэкенд сломан» — разные состояния. Иначе корректно настроенное хранилище минуту показывало баннер «настроено, но не отвечает».',
        },
      ],
      en: [
        {
          t: '"Sent" actually means "kept"',
          d: 'The async mirror write returned nothing: the sender had already been told "sent" while the message was not on disk yet, and the process could die inside that window. Now <code>msg:send</code> awaits its own record — and separately awaits the conversation row landing first. The test stretches the window to 3 s, sends <code>SIGKILL</code>, and requires the whole thread back.',
        },
        {
          t: 'A hand-written TURN client',
          d: '797 lines: STUN/TURN wire encoding to RFC 5389 / 5766 / 6062 / 4571 over UDP, TCP and TLS, plus a live Allocate probe. A first 401 is the protocol asking for credentials; a second means the secret is wrong. Before the fix the health check answered its own 401 forever and fired 79,788 messages at a single server.',
        },
        {
          t: 'Three storage tiers',
          d: 'Disk is a cache, Upstash Redis mirrors documents, Upstash Blob holds bytes. A failing backend never throws: <code>put</code> returns false, and "file absent" is a different state from "backend broken" — otherwise a correctly configured bucket spent a minute showing the banner "configured, but not answering".',
        },
      ],
    },
  },

  /* ------------------------------------------------------------------ */
  {
    id: 'sonora',
    accent: ['#22d3ee', '#4ade80'],
    links: () => LINKS.sonora,

    name:   { ru: 'Sonora', en: 'Sonora' },
    aka:    { ru: 'аудиоплеер', en: 'audio player' },
    tagline: {
      ru: 'Стеклянный плеер с генеративным звуком: 10 синтезаторов, ноль семплов, ноль зависимостей.',
      en: 'A glass audio player with generative sound: 10 synthesizers, zero samples, zero dependencies.',
    },

    metrics: [
      { v: '12 500', l: { ru: 'строк кода',   en: 'lines of code' } },
      { v: '28',     l: { ru: 'ES-модулей',   en: 'ES modules' } },
      { v: '0',      l: { ru: 'зависимостей', en: 'dependencies' } },
      { v: '10',     l: { ru: 'синтезаторов', en: 'instruments' } },
    ],

    stack: ['Web Audio API', 'Canvas 2D', 'ES Modules', 'Media Session', 'Cloudflare Workers', 'Durable Objects', 'FNV-1a / Mulberry32'],

    features: {
      ru: [
        'Генеративный движок: 6 ладов, 4 паттерна аккордов из пяти кандидатов, ритм по плотности. Никаких семплов — только осцилляторы, фильтры и шум.',
        'Сид решает всё: те же настройки с другим сидом дают другую пьесу. <code>render(bar)</code> — чистая функция номера такта, поэтому перемотка мгновенная и воспроизводимая.',
        'Четыре источника звука: синтез, локальный файл, ссылка и живое радио — с честным определением потока по заголовкам, а не по догадке.',
        'Аудио-граф: трёхполосный EQ, компрессор, свёрточная реверберация с импульсом, сгенерированным в рантайме, и пинг-понг задержка.',
        'Три визуализатора и реактивный фон: свечение реагирует на низкие частоты, но поймано на транзиент детектором, а не на уровне — иначе мигает как на дискотеке.',
        'Свой парсер ID3v2.2 / 3 / 4 с извлечением обложки из кадра <code>APIC</code> — четыре кодировки текста, BOM, safe-интегеры.',
      ],
      en: [
        'A generative engine: 6 scales, chord progressions chosen from 5 seeded candidates, rhythm driven by density. No samples at all — oscillators, filters and noise.',
        'The seed decides everything: identical settings with a different seed give a different piece. <code>render(bar)</code> is a pure function of the bar index, so seeking is instant and reproducible.',
        'Four sound sources: synthesis, local file, remote URL and live radio — with honest stream detection from response headers rather than guesswork.',
        'The audio graph: 3-band EQ, a compressor, convolution reverb with an impulse generated at runtime, and a ping-pong delay.',
        'Three visualizers plus a reactive backdrop: the glow follows the low band but is triggered by a transient detector rather than raw level — otherwise it strobes like a rave.',
        'A hand-written ID3v2.2 / 3 / 4 parser that pulls cover art out of the <code>APIC</code> frame — four text encodings, BOMs, syncsafe integers.',
      ],
    },

    cuts: {
      ru: [
        {
          t: 'Ноль зависимостей вообще',
          d: 'Ни npm, ни CDN, ни веб-шрифтов. Свой бандлер на 494 строки проверяет синтаксис каждого файла, ловит русский текст, прочитанный как CP1251, строит граф импортов, сверяет экспорты с импортами и ищет необъявленные идентификаторы — а на выходе даёт один файл, открывающийся двойным кликом.',
        },
        {
          t: '19 цветовых токенов через @property',
          d: 'Кастомное свойство для CSS — просто строка, поэтому смена темы щёлкает. С <code>@property</code> один <code>transition</code> на <code>:root</code> кросс-фейдит все девятнадцать, и ни одно правило больше не знает, что что-то произошло.',
        },
        {
          t: 'Счётчик посетителей, который не врёт',
          d: 'Durable Object держит сессии в памяти: KV не годится — бесплатный тариф даёт 1 000 записей в сутки, а один человек с пингом раз в 30 секунд даёт ~2 880. Сессия — это хэш IP с солью, и цифра не показывается, пока сервер не ответил честно.',
        },
      ],
      en: [
        {
          t: 'Literally zero dependencies',
          d: 'No npm, no CDN, no webfonts. A 494-line bundler checks the syntax of every file, catches Russian text read as CP1251, builds the import graph, cross-references exports against imports, and hunts undeclared identifiers — and emits one file that opens on double-click.',
        },
        {
          t: '19 colour tokens via @property',
          d: 'A custom property is just a string to CSS, so a theme change snaps. With <code>@property</code> a single <code>transition</code> on <code>:root</code> cross-fades all nineteen, and no rule anywhere else has to know it happened.',
        },
        {
          t: 'A visitor counter that does not lie',
          d: 'The Durable Object keeps sessions in memory: KV does not work here — the free tier allows 1 000 writes a day, while one person pinging every 30 s produces ~2 880. A session is a salted hash of the IP, and the number stays hidden until the server has answered honestly.',
        },
      ],
    },
  },

  /* ------------------------------------------------------------------ */
  {
    id: 'filedropper',
    accent: ['#ff9f45', '#ff5c8a'],
    links: () => LINKS.filedropper,

    name:   { ru: 'FileDropper', en: 'FileDropper' },
    aka:    { ru: 'файлообменник', en: 'file sharing' },
    tagline: {
      ru: 'Файлообменник, где байты не проходят через сервер: подпись, браузер льёт напрямую в хранилище.',
      en: 'A file exchanger where bytes never touch the server: the API signs, the browser pours straight into storage.',
    },

    metrics: [
      { v: '5 200', l: { ru: 'строк кода',   en: 'lines of code' } },
      { v: '64',    l: { ru: 'e2e-проверки', en: 'e2e checks' } },
      { v: '22',    l: { ru: 'API-маршрута', en: 'API routes' } },
      { v: '1',     l: { ru: 'зависимость',  en: 'dependency' } },
    ],

    stack: ['Cloudflare Workers', 'Upstash Blob', 'SigV4', 'GitHub Actions', 'GitHub Pages', 'PBKDF2-SHA256', 'CSP'],

    features: {
      ru: [
        'Трёхфазная загрузка: Worker подписывает два адреса, браузер кладёт байты и метаданные напрямую в хранилище, Worker проверяет, что файл действительно дошёл.',
        'Заявленные 500 МБ становятся достижимыми: Worker видит только сотни байт JSON, а потолок платформы в 100 МБ к нему больше не относится.',
        'Одноразовые ссылки: полезная нагрузка удаляется <em>до</em> того, как байты отданы, и второе скачивание получает <code>410</code>, а не <code>404</code>.',
        'PBKDF2-SHA256 на 100 000 итераций, соль на пользователя. Хеш считается даже для несуществующего логина, чтобы время ответа ничего не выдавало.',
        'CSP без <code>unsafe-inline</code> для скриптов плюс пять заголовков. CSRF невозможен структурно: cookies в системе нет вообще, только явный заголовок <code>Authorization</code>.',
        'Деградация без паники: нет токена — работает режим памяти, а на странице висит «Статус системы» с точной командой, которую надо выполнить.',
      ],
      en: [
        'A three-phase upload: the Worker signs two URLs, the browser pushes bytes and metadata straight into storage, then the Worker verifies the file actually arrived.',
        'The advertised 500 MB becomes reachable: the Worker only ever sees a few hundred bytes of JSON, so the 100 MB platform ceiling no longer applies.',
        'One-time links: the payload is deleted <em>before</em> any bytes are released, and a second download gets <code>410</code> rather than a confusing <code>404</code>.',
        'PBKDF2-SHA256 at 100 000 iterations, a per-user salt. The hash is computed even for a username that does not exist, so response time reveals nothing.',
        'A CSP with no <code>unsafe-inline</code> for scripts plus five more headers. CSRF is structurally impossible: there are no cookies anywhere, only an explicit <code>Authorization</code> header.',
        'Degradation without panic: with no token, memory mode kicks in and the page shows a "System status" pill with the exact command to run.',
      ],
    },

    cuts: {
      ru: [
        {
          t: 'Свой upload-протокол вместо SDK',
          d: 'Официальный <code>@upstash/blob</code> отдаёт 403 «Signature mismatch» внутри Workers: рантайм сериализует запрос не так, как подписал SDK. Обход — <code>signedUploadUrl()</code> плюс <code>PUT</code> ручным <code>fetch</code>. В коде это зафиксировано одной строкой: <code>sdk.put → 403, signedUrl + fetch → 200</code>.',
        },
        {
          t: 'metaBody — точная байтовая строка',
          d: 'Подпись R2 покрывает и хеш payload, поэтому клиент обязан положить метаданные байт-в-байт те, что вернул Worker. Единственное значение, обязательное совпадение которого никто не проверяет глазом, — и находился оно только потому, что один из файлов не сохранился.',
        },
        {
          t: 'Кэш-бастинг как средство защиты',
          d: 'Хранилище отдаёт объекты с <code>max-age=3600</code>, и CDN ещё час показывал бы удалённые файлы — то есть «одноразовая» ссылка была бы не одноразовой. Поэтому чтение идёт с <code>?nc=</code> и <code>cache-control: no-cache</code>: это не оптимизация, а условие, при котором вообще работает удаление.',
        },
      ],
      en: [
        {
          t: 'A custom upload protocol instead of the SDK',
          d: 'The official <code>@upstash/blob</code> returns 403 "Signature mismatch" inside Workers: the runtime serializes the request differently from how the SDK signed it. The way out is <code>signedUploadUrl()</code> plus a hand-rolled <code>fetch</code> <code>PUT</code>. The code records it in one line: <code>sdk.put → 403, signedUrl + fetch → 200</code>.',
        },
        {
          t: 'metaBody is a byte-exact string',
          d: 'The R2 signature covers the payload hash too, so the client must PUT metadata byte-identical to what the Worker returned. It is the one value whose exact match nobody checks by eye — and it was found only because a file failed to save.',
        },
        {
          t: 'Cache-busting as a security control',
          d: 'Storage serves objects with <code>max-age=3600</code>, so the CDN would keep showing deleted files for an hour — making a "one-time" link not one-time. Reads therefore carry <code>?nc=</code> and <code>cache-control: no-cache</code>: not a performance trick, but the condition under which deletion works at all.',
        },
      ],
    },
  },
];
