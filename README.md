# AI Chat Platform — Pet Project

Платформа AI-ассистентов в формате чат-ботов. Проект создан в качестве pet-project для демонстрации навыков построения LLM-интерфейсов: streaming UI, tool calling, generative UI и архитектуры фронтенда для AI-продуктов.

## Технологический стек

| Технология | Назначение |
|------------|-----------|
| **Next.js 14** (App Router) | Fullstack React-фреймворк |
| **TypeScript** | Типизация |
| **Tailwind CSS** | Стилизация |
| **Vercel AI SDK** (`ai`, `@ai-sdk/openai`) | Streaming, tool calling, React hooks |
| **Zustand** (+ persist) | State management (треды) |
| **Zod** | Валидация схем для инструментов |
| **React Markdown** + **Syntax Highlighter** | Markdown + подсветка кода |
| **Lucide React** | Иконки |

## Реализованные фичи

### 1. Streaming UI
- Потоковая передача ответа от OpenAI через SSE
- Текст появляется token-by-token
- Индикатор печати (typing dots)
- Кнопка "Остановить генерацию" (`stop()`)

### 2. Tool Calling (Инструменты)
Реализованы 3 инструмента на backend (`app/api/chat/route.ts`):

- **`getWeather`** — погода в городе (мок, демонстрирует backend tool)
- **`getCurrentTime`** — текущее время
- **`showProductCard`** — **Generative UI**: LLM возвращает данные для рендеринга карточки товара прямо в чате

### 3. Generative UI
- Когда LLM вызывает `showProductCard`, фронтенд рендерит богатый UI-компонент (`ProductCard`) вместо сырого текста
- Валидация параметров через Zod
- Типобезопасность от API до UI

### 4. Архитектура чата
- **Нормализованный state**: Zustand хранит треды, `useChat` от Vercel AI SDK управляет сообщениями
- **Несколько тредов**: создание, переключение, удаление диалогов
- **Persist**: треды сохраняются в `localStorage`
- **Сообщения**: каждый тред хранит свою историю в `localStorage`
- **Автозаголовок**: первое сообщение пользователя становится названием треда

### 5. UI/UX
- **Markdown рендеринг**: заголовки, списки, таблицы, цитаты, ссылки
- **Подсветка кода** (Prism / VS Code Dark+) с кнопкой "Копировать"
- **Auto-resize textarea**: поле ввода растягивается по содержимому
- **Отправка по Enter** (Shift+Enter для новой строки)
- **Scroll-to-bottom**: автопрокрутка к новым сообщениям
- **Адаптив**: боковая панель скрывается на мобильных

### 6. Совместимость с AG-UI Protocol
Архитектура проекта построена с учётом принципов AG-UI (Agent-User Interaction Protocol):
- Event-based поток данных
- Типизированные события от агента
- Разделение: backend tools + frontend rendering
- Легко мигрировать с Vercel AI SDK на чистый AG-UI endpoint

## Структура проекта

```
ai-chat-platform/
├── app/
│   ├── api/chat/route.ts      # API endpoint с streamText + tools
│   ├── layout.tsx             # Корневой layout
│   ├── page.tsx               # Главная страница (split-view)
│   └── globals.css            # Глобальные стили + CSS-переменные
├── components/
│   ├── chat/
│   │   ├── chat-container.tsx # Контейнер чата (useChat + side-effects)
│   │   ├── chat-input.tsx     # Поле ввода с авто-ресайзом
│   │   ├── message-list.tsx   # Список сообщений + скролл
│   │   ├── message-item.tsx   # Бабл сообщения + tool renders
│   │   ├── thread-list.tsx    # Список тредов (sidebar)
│   │   └── thread-item.tsx    # Элемент треда
│   └── ui/
│       ├── markdown-renderer.tsx
│       ├── code-block.tsx     # Подсветка + копирование
│       ├── weather-card.tsx   # UI результата tool
│       └── product-card.tsx   # Generative UI компонент
├── hooks/
│   └── use-auto-resize.ts     # Хук для textarea
├── lib/
│   ├── store.ts               # Zustand store (треды)
│   └── utils.ts               # Хелперы (cn, formatDate)
├── types/
│   └── index.ts               # Глобальные TypeScript типы
└── .env.example               # Пример переменных окружения
```

## Запуск

### 1. Клонирование и установка
```bash
cd ai-chat-platform
npm install
```

### 2. Переменные окружения
```bash
cp .env.example .env.local
# Добавьте свой OPENAI_API_KEY в .env.local
```

### 3. Запуск dev-сервера
```bash
npm run dev
# Открыть http://localhost:3000
```

## Примеры запросов для демонстрации

| Запрос | Что произойдёт |
|--------|---------------|
| "Какая погода в Москве?" | LLM вызовет `getWeather` → отобразится `WeatherCard` |
| "Покажи товар Кроссовки Nike за 12 000 рублей" | LLM вызовет `showProductCard` → отобразится `ProductCard` |
| "Который сейчас час?" | LLM вызовет `getCurrentTime` → компактный виджет времени |
| "Напиши функцию на TypeScript для дебаунса" | Markdown + CodeBlock с подсветкой и кнопкой Copy |
| "Расскажи про React Hooks" | Streaming текст с форматированием |

## Что можно улучшить (roadmap)

- [ ] **Виртуализация** списка сообщений (`react-virtuoso`) для 1000+ сообщений
- [ ] **AG-UI Protocol** — миграция endpoint на чистый AG-UI event stream
- [ ] **Auth** — авторизация и персональные треды на бэкенде
- [ ] **File Upload** — прикрепление изображений к сообщениям (multimodal)
- [ ] **Voice** — голосовой ввод / озвучка ответов
- [ ] **Rate Limiting** — лимиты запросов на клиенте
- [ ] **Testing** — unit + integration тесты (`vitest`, `@testing-library/react`)

## Архитектурные решения

### Почему Vercel AI SDK?
- Унифицированный API для разных LLM-провайдеров
- Встроенный streaming, tool calling, обработка ошибок
- React-хуки (`useChat`) сразу дают optimistic updates и abort

### Почему Zustand, а не Redux / Context?
- Минимум шаблонного кода для небольшого state (только треды)
- Persist middleware из коробки
- Типобезопасность без boilerplate

### Почему Next.js App Router?
- Server Components для статичных частей (layout, sidebar)
- API Routes в одном репозитории
- Edge Runtime для минимальной latency

## Лицензия
MIT — свободно использовать как шаблон для собственных проектов.
