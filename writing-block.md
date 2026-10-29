# Project Specification: Wallpaper Studio PWA

## 1. Project Overview

Створити сучасний вебзастосунок для пошуку, перегляду, збереження та завантаження wallpaper-зображень.

Основний візуальний референс:
https://4kwallpapers.com/

Застосунок повинен мати власний дизайн, але використовувати логіку wallpaper-каталогу:

- Галерея зображень.
- Пошук за ключовими словами.
- Категорії та популярні теми.
- Перегляд зображень у високій якості.
- Вибір доступної роздільної здатності.
- Завантаження wallpaper.
- Обране.
- Адаптивний інтерфейс для desktop, tablet і mobile.
- PWA з можливістю встановлення.
- Серверний доступ до зовнішніх API.
- Серверне зберігання API-ключів.

Не копіювати HTML, CSS, логотип, тексти або інші захищені елементи оригінального сайту. Створити незалежний продукт із власним UI.

## 2. Technology Stack

### Frontend

- Nuxt 3.
- Vue 3.
- TypeScript.
- Composition API.
- `<script setup>`.
- Nuxt pages routing.
- CSS.
- CSS Variables.
- CSS `@layer`.
- PWA.

### Backend

Використовувати серверні можливості Nuxt:

- Nitro.
- Nuxt Server API.
- Server routes.
- Server-only runtime configuration.
- Серверні адаптери для зовнішніх API.

Не створювати окремий Express або NestJS backend.

### Deployment

- Vercel.
- Nuxt deployment через Vercel.
- Serverless API endpoints.
- Environment Variables у Vercel.

### Storage

На першому етапі не використовувати обов'язкову базу даних.

Обране зберігати локально у браузері.

Архітектура повинна дозволяти додати базу даних для синхронізації користувацьких колекцій у майбутньому.

## 3. Project Structure

Організувати проєкт за принципом розділення UI, логіки, серверних API та зовнішніх провайдерів.

```text
app/
  assets/
    css/
      main.css
      variables.css
      layers.css

  components/
    layout/
      AppHeader.vue
      AppNavigation.vue
      AppFooter.vue

    wallpaper/
      WallpaperCard.vue
      WallpaperGrid.vue
      WallpaperFilters.vue
      WallpaperPreview.vue
      WallpaperDownload.vue
      WallpaperSkeleton.vue

    search/
      SearchInput.vue
      SearchSuggestions.vue

    favorites/
      FavoriteButton.vue
      FavoriteGrid.vue

  composables/
    useWallpapers.ts
    useWallpaperSearch.ts
    useFavorites.ts
    useWallpaperFilters.ts

  layouts/
    default.vue

  pages/
    index.vue
    search.vue
    categories/
      index.vue
      [slug].vue
    wallpaper/
      [id].vue
    favorites.vue

  types/
    wallpaper.ts
    provider.ts
    search.ts

server/
  api/
    wallpapers/
      index.get.ts
      search.get.ts
      categories.get.ts
      [id].get.ts
      download.get.ts

  services/
    wallpaper/
      wallpaper.service.ts
      wallpaper.mapper.ts

    providers/
      provider.interface.ts
      unsplash.provider.ts
      pexels.provider.ts
      pixabay.provider.ts
      fourkwallpapers.provider.ts

  utils/
    validation.ts
    errors.ts

shared/
  constants/
    categories.ts

  types/
    wallpaper.ts

public/
  icons/
```

Структуру можна адаптувати до актуальних можливостей Nuxt, але серверні модулі повинні залишатися недоступними для імпорту у frontend bundle.

## 4. Design Requirements

Створити дизайн у стилі сучасного wallpaper-порталу.

### Visual direction

- Темна тема за замовчуванням.
- Мінімалістичний інтерфейс.
- Великі зображення.
- Акцент на фотографіях, а не декоративних елементах.
- Контрастна типографіка.
- Акуратні картки.
- Плавні hover transitions.
- Невелика кількість декоративних ефектів.
- Адаптивний layout.
- Власні CSS variables.

Не використовувати Tailwind CSS.

Не використовувати Bootstrap.

Не використовувати UI-бібліотеки, які повністю визначають зовнішній вигляд застосунку.

### CSS Architecture

Використовувати CSS Variables:

```css
:root {
  color-scheme: dark;

  --color-background: #0b0b0d;
  --color-surface: #151518;
  --color-surface-hover: #202024;
  --color-border: #29292e;
  --color-text: #f5f5f7;
  --color-text-muted: #92929b;
  --color-accent: #8b7cff;

  --radius-sm: 8px;
  --radius-md: 14px;
  --radius-lg: 20px;

  --container-width: 1600px;

  --spacing-1: 4px;
  --spacing-2: 8px;
  --spacing-3: 12px;
  --spacing-4: 16px;
  --spacing-6: 24px;
  --spacing-8: 32px;
}
```

Організувати CSS через `@layer`:

```css
@layer reset, tokens, base, layout, components, utilities;
```

Не використовувати CSS preprocessors.

Не створювати глобальні стилі без необхідності.

## 5. Main Page

Головна сторінка повинна містити:

### Header

- Логотип застосунку.
- Home.
- Categories.
- Search.
- Favorites.
- Theme control.
- Mobile navigation.

Header повинен бути адаптивним.

### Hero Section

Великий заголовок:

Discover wallpapers for every screen.

Підзаголовок:

Explore high-resolution wallpapers for desktop, mobile and tablet.

Основний елемент:

Search input.

Під пошуком:

- Trending searches.
- Популярні категорії.
- Швидкі пошукові запити.

Hero не повинен займати надмірну висоту.

### Featured Wallpapers

Відображати добірку wallpaper.

Картки повинні містити:

- Preview image.
- Назву.
- Resolution.
- Provider.
- Favorite button.

Використовувати masonry або CSS Grid.

Не створювати masonry через складні JavaScript-обчислення, якщо можна використати CSS Grid.

### Categories

Категорії:

- Nature.
- Landscape.
- Space.
- Anime.
- Gaming.
- Cars.
- Architecture.
- Abstract.
- Animals.
- Technology.
- Minimal.
- Movies.

Категорії повинні бути конфігураційними.

## 6. Wallpaper Catalog

Реалізувати каталог wallpaper.

Основні можливості:

- Завантаження списку.
- Пошук.
- Пагінація.
- Фільтрація.
- Сортування.
- Preview.
- Favorite.
- Download.

### Grid

Desktop:

- 4–6 колонок залежно від ширини viewport.

Tablet:

- 3 колонки.

Mobile:

- 2 колонки.

На дуже вузьких екранах допускається 1 колонка.

Використовувати CSS Grid з `minmax()`.

Зображення повинні мати стабільні пропорції через `aspect-ratio`.

Не допускати layout shift під час завантаження.

### Wallpaper Card

Картка повинна містити:

- Preview.
- Назву.
- Resolution.
- Favorite.
- Open preview.

Hover:

- Показати додаткові дії.
- Не приховувати основну інформацію на mobile.
- Не використовувати hover як єдиний спосіб доступу до дій.

Використовувати lazy loading.

Для зображень використовувати `loading="lazy"` там, де це доречно.

Не завантажувати оригінальні 4K/8K зображення у списку.

## 7. Wallpaper Data Model

Створити єдиний нормалізований тип:

```ts
export interface Wallpaper {
  id: string
  provider: WallpaperProvider
  title: string
  description?: string
  category?: string
  tags: string[]
  width: number
  height: number
  aspectRatio: number
  thumbnailUrl: string
  previewUrl: string
  downloadUrl?: string
  sourceUrl: string
  author?: {
    name: string
    url?: string
  }
}
```

```ts
export type WallpaperProvider =
  | 'unsplash'
  | 'pexels'
  | 'pixabay'
  | '4kwallpapers'
```

Для всіх провайдерів використовувати один нормалізований формат.

Не передавати у frontend необроблені відповіді зовнішніх API.

Створити mapper для кожного provider.

Не вигадувати URL, resolution або metadata.

Якщо поле відсутнє, використовувати `undefined` або визначене значення за замовчуванням.

Не створювати фіктивні зображення, які видаються реальними результатами пошуку.

## 8. Image Providers

Підтримати такі джерела:

### Unsplash

API:

https://unsplash.com/documentation

Використовувати:

- Search photos.
- Photo metadata.
- Image URLs.
- Author metadata.

### Pexels

API:

https://www.pexels.com/api/documentation/

Використовувати:

- Search photos.
- Photo metadata.
- Image URLs.
- Author metadata.

### Pixabay

API:

https://pixabay.com/api/docs/

Використовувати:

- Search images.
- Image metadata.
- Image URLs.

### 4K Wallpapers

Website:

https://4kwallpapers.com/

Реалізувати окремий provider adapter.

Не вважати, що сайт має офіційний API.

Перед реалізацією перевірити:

- Наявність офіційного API.
- Умови використання.
- Дозволені способи отримання контенту.
- Обмеження автоматизованого доступу.
- Правила використання та завантаження зображень.

Не обходити Cloudflare, CAPTCHA, authentication або інші механізми захисту.

Не використовувати неофіційні scraper-методи, які порушують правила сайту.

Якщо доступ до сайту обмежений, provider повинен бути disabled, а застосунок продовжувати працювати з іншими джерелами.

Не заявляти, що wallpaper із 4kwallpapers.com доступний для скачування, якщо його URL або право доступу не підтверджено.

## 9. Stock Images MCP

У користувача є MCP server:

```json
{
  "stock-images-mcp": {
    "command": "uvx",
    "args": [
      "git+https://github.com/Zulelee/stock-images-mcp"
    ],
    "env": {
      "UNSPLASH_API_KEY": "${UNSPLASH_API_KEY}",
      "PEXELS_API_KEY": "${PEXELS_API_KEY}",
      "PIXABAY_API_KEY": "${PIXABAY_API_KEY}"
    }
  }
}
```

Цей MCP server використовується як reference для роботи з stock-image providers.

Перед використанням:

1. Перевірити README репозиторію.
2. Перевірити актуальні MCP tools.
3. Перевірити доступні параметри пошуку.
4. Перевірити, які поля повертаються.
5. Перевірити обмеження API.
6. Перевірити license та attribution metadata.

Repository:

https://github.com/Zulelee/stock-images-mcp

### Important

MCP server для розробки не повинен автоматично ставати runtime dependency production-застосунку.

Nuxt server повинен використовувати окремі provider adapters для роботи з API.

Якщо MCP server можна використовувати тільки через локальний MCP client, не намагатися запускати його у Vercel через `uvx`.

Не запускати локальні MCP процеси у frontend.

Не передавати MCP credentials через браузер.

Production server повинен звертатися до зовнішніх API через серверні модулі.

## 10. API Keys and Server Security

API-ключі повинні бути доступні виключно у server runtime.

Використовувати Nuxt private runtime config.

```ts
export default defineNuxtConfig({
  runtimeConfig: {
    unsplashApiKey: '',
    pexelsApiKey: '',
    pixabayApiKey: '',
  },
})
```

Значення повинні надходити із server environment variables.

Production:

```env
UNSPLASH_API_KEY=
PEXELS_API_KEY=
PIXABAY_API_KEY=
```

Заборонено:

- `publicRuntimeConfig` для API keys.
- `NUXT_PUBLIC_*` для API keys.
- Зберігати ключі у frontend constants.
- Зберігати ключі у `.env.example`.
- Передавати ключі у query parameters frontend requests.
- Передавати ключі у props Vue components.
- Виводити ключі у console.
- Виводити ключі у server logs.
- Повертати ключі через API responses.
- Комітити реальні ключі у Git.
- Включати ключі у frontend bundle.

У `.env.example` використовувати порожні значення:

```env
UNSPLASH_API_KEY=
PEXELS_API_KEY=
PIXABAY_API_KEY=
```

У Vercel додати ключі у Environment Variables.

Використовувати лише server-side доступ.

### Server API

Frontend повинен звертатися до Nuxt API:

```text
/api/wallpapers
/api/wallpapers/search
/api/wallpapers/categories
/api/wallpapers/:id
/api/wallpapers/download
```

Nuxt server повинен сам звертатися до provider APIs.

Не дозволяти frontend передавати довільний provider API URL.

Не створювати open proxy.

Не дозволяти користувачу передавати довільні URL для server-side fetch.

Не використовувати server-side fetch для довільних hostnames.

Валідувати всі параметри.

Обмежити:

- Search query length.
- Page number.
- Page size.
- Provider selection.
- Category.
- Wallpaper ID.
- Download target.

### Rate Limiting

Реалізувати захист API:

- Обмеження частоти пошуку.
- Обмеження кількості результатів.
- Cache.
- Validation.
- Request timeout.

Якщо deployment використовує serverless, не покладатися на in-memory rate limiter як єдиний захист.

Для production використовувати платформний rate limiting або зовнішнє shared storage, якщо буде необхідно.

## 11. Server API

### GET /api/wallpapers

Параметри:

```text
page
limit
category
provider
sort
```

Повертає:

```ts
interface WallpaperListResponse {
  items: Wallpaper[]
  page: number
  limit: number
  total?: number
  hasMore: boolean
}
```

### GET /api/wallpapers/search

Параметри:

```text
q
page
limit
provider
category
orientation
```

Валідувати всі параметри.

Порожній query не повинен викликати необмежений пошук у всіх providers.

### GET /api/wallpapers/categories

Повертає доступні категорії.

Категорії повинні бути нормалізовані.

Не створювати категорії на основі довільних URL.

### GET /api/wallpapers/:id

Повертає metadata конкретного wallpaper.

ID повинен містити provider і source identifier або використовувати інший стабільний формат.

Не використовувати випадкові ID, які змінюються при кожному запиті.

### GET /api/wallpapers/download

Використовувати тільки для wallpaper, отриманих через підтримувані providers.

Перед download:

1. Перевірити wallpaper ID.
2. Перевірити provider.
3. Перевірити доступність download URL.
4. Перевірити, чи provider дозволяє download.
5. Перевірити максимальний розмір файлу.
6. Перевірити content type.
7. Перевірити, що URL належить дозволеному provider hostname.

Не створювати arbitrary URL downloader.

Не завантажувати файл на сервер без необхідності.

Якщо provider має офіційний download endpoint, використовувати його відповідно до документації.

Якщо provider дозволяє тільки прямий image URL, відкривати його через браузер або використовувати відповідний офіційний спосіб download.

Не маскувати обмеження provider.

## 12. Search

Реалізувати пошук:

- За ключовими словами.
- За категорією.
- За provider.
- За orientation.
- За resolution, якщо metadata доступні.

Search input повинен:

- Підтримувати Enter.
- Підтримувати кнопку пошуку.
- Використовувати debounce.
- Очищати query.
- Відображати loading state.
- Відображати empty state.
- Відображати error state.

Не запускати запит на кожен символ без debounce.

Не запускати кілька однакових запитів паралельно.

Пошукові параметри повинні зберігатися у URL.

Приклад:

```text
/search?q=mountains&provider=unsplash
```

Повторне відкриття URL повинно відновлювати пошуковий стан.

## 13. Favorites

Реалізувати обране без авторизації.

Використовувати localStorage.

Створити composable:

```text
useFavorites
```

Функціональність:

- Add favorite.
- Remove favorite.
- Check favorite.
- Favorites page.
- Empty state.
- Persistent storage.

Зберігати тільки необхідні metadata:

```ts
interface FavoriteWallpaper {
  id: string
  provider: WallpaperProvider
  title: string
  thumbnailUrl: string
  previewUrl: string
  width: number
  height: number
  sourceUrl: string
}
```

Не зберігати оригінальні image files у localStorage.

Не використовувати base64 для зображень.

Не створювати обов'язкову авторизацію.

## 14. Wallpaper Preview

Реалізувати сторінку:

```text
/wallpaper/:id
```

Відображати:

- Wallpaper image.
- Title.
- Resolution.
- Aspect ratio.
- Provider.
- Author.
- Source link.
- Favorite.
- Download options.

Зображення повинно масштабуватися відповідно до viewport.

На desktop:

- Велика preview area.
- Metadata справа або нижче.

На mobile:

- Preview зверху.
- Metadata нижче.
- Download controls доступні без горизонтального scroll.

Не завантажувати original image автоматично при відкритті preview.

## 15. Download

Реалізувати download UX:

- Download button.
- Доступні resolution.
- Original resolution.
- Loading state.
- Error state.

Для providers, які підтримують різні resolution, відображати лише реально доступні варіанти.

Не вигадувати 4K або 8K resolution.

Якщо provider не повертає resolution metadata, визначити розміри через доступні metadata або image dimensions, якщо це дозволено і технічно доступно.

Не називати файл випадковим ім'ям.

Використовувати зрозумілий filename.

Не змінювати wallpaper image без необхідності.

## 16. PWA

Застосунок повинен бути installable PWA.

Реалізувати:

- Web App Manifest.
- Application icons.
- Theme color.
- Standalone display.
- Service Worker.
- Offline fallback.
- Install prompt.
- Responsive application shell.

Використовувати актуальний Nuxt-compatible PWA module.

Перед додаванням dependency перевірити його сумісність із Nuxt 3 та Vercel.

### Manifest

Назва:

Wallpaper Studio

Short name:

Wallpapers

Display:

standalone

Theme:

dark

Start URL:

/

### Offline

Offline mode повинен підтримувати:

- Application shell.
- Navigation.
- Favorites.
- Раніше відкриті сторінки, якщо вони закешовані.
- Offline fallback.

Не кешувати безконтрольно всі image files.

Не кешувати API responses без TTL.

Не кешувати приватні або секретні дані.

Не кешувати provider API credentials.

Не кешувати зовнішні images, якщо це суперечить умовам provider.

### Install

Показувати install UI лише тоді, коли браузер підтримує встановлення.

Не показувати кнопку, яка нічого не робить.

Якщо install prompt недоступний, не блокувати застосунок.

## 17. Performance

Основний пріоритет — швидке завантаження каталогу.

Реалізувати:

- Lazy loading.
- Responsive image sizing.
- Server-side provider requests.
- API caching.
- Pagination.
- Skeleton states.
- Image placeholders.
- Error handling.

Не завантажувати весь каталог одразу.

Не використовувати великі original images у картках.

Не створювати десятки однакових API requests.

Не блокувати rendering через повільний provider.

Якщо один provider недоступний, інші повинні продовжувати працювати.

Для caching використовувати Nitro caching або відповідні HTTP cache headers.

Cache key повинен враховувати query parameters.

Не кешувати секрети.

## 18. Error Handling

Створити централізовану систему обробки errors.

Типи:

- Provider unavailable.
- Invalid API key.
- Rate limit.
- Search error.
- Network error.
- Invalid wallpaper.
- Download unavailable.
- Unsupported provider.
- Empty results.

Frontend повинен відображати зрозумілі повідомлення.

Не показувати stack traces.

Не показувати API credentials.

Не маскувати помилки як порожній список.

Якщо provider не відповідає, відображати відповідний error state.

## 19. SEO

Реалізувати:

- SSR.
- Metadata.
- Title.
- Description.
- Canonical URLs.
- Open Graph.
- Twitter metadata.
- Sitemap.
- Robots.txt.

Для wallpaper page використовувати доступні metadata:

- Title.
- Description.
- Resolution.
- Provider.
- Author.

Не генерувати metadata із секретних або внутрішніх server fields.

Не створювати indexable pages для довільних query combinations.

## 20. Accessibility

Використовувати semantic HTML.

Вимоги:

- Keyboard navigation.
- Visible focus.
- Accessible buttons.
- Alt text.
- Контраст.
- Reduced motion support.
- Доступні modal controls.
- Коректні labels.

Не використовувати clickable `div` замість кнопок.

Не приховувати функціональність для keyboard users.

## 21. Security

Реалізувати:

- Server-only credentials.
- Input validation.
- Provider allowlist.
- SSRF protection.
- Request timeout.
- Rate limiting.
- Safe error responses.
- Secure environment configuration.

Не використовувати arbitrary fetch URLs.

Не створювати open proxy.

Не дозволяти передавати API keys через frontend.

Не виконувати HTML або scripts із provider responses.

Не використовувати `v-html` для зовнішнього контенту без необхідності.

Не довіряти metadata, отриманим від сторонніх API.

## 22. Environment

Створити:

```text
.env.example
```

З таким набором:

```env
UNSPLASH_API_KEY=
PEXELS_API_KEY=
PIXABAY_API_KEY=
```

Реальні credentials не повинні потрапляти у Git.

Для локальної розробки використовувати `.env`.

Для production використовувати Vercel Environment Variables.

Перевірити, що `.env` присутній у `.gitignore`.

## 23. Testing

Реалізувати перевірки:

### Provider tests

- Нормалізація metadata.
- Empty results.
- API errors.
- Invalid responses.
- Missing fields.

### API tests

- Search validation.
- Pagination.
- Provider selection.
- Invalid wallpaper ID.
- Download validation.
- Rate limiting.

### UI tests

- Search.
- Favorites.
- Wallpaper preview.
- Download states.
- Mobile navigation.
- Empty states.

### PWA tests

- Manifest.
- Service Worker.
- Offline fallback.
- Installability.

Не використовувати реальні API keys у тестах.

Для provider tests використовувати mocked responses.

## 24. Development Requirements

Перед реалізацією:

1. Перевірити актуальну документацію Nuxt 3.
2. Перевірити актуальну документацію Nitro.
3. Перевірити документацію PWA module.
4. Перевірити API documentation кожного provider.
5. Перевірити MCP repository.
6. Визначити, які provider features реально підтримуються.
7. Визначити обмеження download.
8. Скласти план реалізації.

Не використовувати deprecated APIs.

Не встановлювати непотрібні dependencies.

Не створювати fake provider implementation.

Не створювати hardcoded image results для production.

## 25. Implementation Order

### Phase 1 — Foundation

- Nuxt project.
- TypeScript.
- CSS architecture.
- Layout.
- Responsive header.
- Main page.
- Wallpaper components.

### Phase 2 — Providers

- Provider interface.
- Unsplash adapter.
- Pexels adapter.
- Pixabay adapter.
- Normalized wallpaper model.
- Server API.
- Search.

### Phase 3 — Catalog

- Wallpaper grid.
- Pagination.
- Categories.
- Filters.
- Loading states.
- Error states.

### Phase 4 — Wallpaper Details

- Preview page.
- Metadata.
- Download.
- Favorite.

### Phase 5 — Favorites

- localStorage.
- Favorites page.
- Persistent state.

### Phase 6 — PWA

- Manifest.
- Icons.
- Service Worker.
- Offline shell.
- Install support.

### Phase 7 — Security and Performance

- Server-only secrets.
- Validation.
- Rate limiting.
- Caching.
- Performance optimization.

### Phase 8 — Deployment

- Vercel.
- Environment variables.
- Production build.
- Smoke tests.

## 26. Acceptance Criteria

Проєкт вважається завершеним, якщо:

1. Nuxt application запускається локально.
2. Production build проходить без помилок.
3. Frontend не містить API keys.
4. API keys доступні тільки серверу.
5. Unsplash search працює.
6. Pexels search працює.
7. Pixabay search працює.
8. Provider responses нормалізуються до одного типу.
9. Wallpaper catalog відображається.
10. Search працює через Nuxt API.
11. Categories працюють.
12. Favorites зберігаються після перезавантаження.
13. Wallpaper preview відкривається.
14. Download працює для підтримуваних providers.
15. PWA installability перевірена.
16. Offline fallback працює.
17. Layout адаптивний.
18. API errors обробляються.
19. Rate limiting та validation реалізовані.
20. Vercel deployment працює.
21. У production не використовуються fake wallpaper results.
22. У production не використовуються секрети, захардкоджені у source code.

## 27. Final Deliverables

Після завершення надати:

- Повний source code.
- Nuxt configuration.
- Server API.
- Provider adapters.
- PWA configuration.
- `.env.example`.
- README.
- Інструкцію локального запуску.
- Інструкцію налаштування Vercel.
- Інструкцію додавання API keys.
- Результати build.
- Результати тестів.
- Перелік реалізованих features.
- Перелік обмежень providers.

Не завершувати проєкт лише демонстраційною головною сторінкою.

Реалізувати робочий застосунок із реальним пошуком, каталогом, preview, favorites, download та PWA.

Не вигадувати функціональність, яку provider API не підтримує.

Не додавати credentials до frontend.

Не обходити обмеження сторонніх сайтів.

Усі API keys повинні залишатися на сервері.
