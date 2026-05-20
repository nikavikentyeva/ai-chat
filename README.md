# AI Chat Platform — Pet Project

Платформа AI-ассистентов в формате чат-ботов. Проект создан в качестве pet-project для демонстрации навыков построения LLM-интерфейсов: streaming UI, tool calling, generative UI и архитектуры фронтенда для AI-продуктов.

## Технологический стек

| Технология | Назначение |
|------------|-----------|
| **Next.js 14** (App Router) | Fullstack React-фреймворк |
| **TypeScript** | Типизация |
| **Tailwind CSS** | Стилизация |
| **Vercel AI SDK** (`ai`, `@ai-sdk/react`) | Streaming, tool calling, React hooks |
| **Zustand** (+ persist) | State management (треды) |
| **Zod** | Валидация схем для инструментов |
| **React Markdown** + **Syntax Highlighter** | Markdown + подсветка кода |
| **Lucide React** | Иконки |

## Реализованные фичи

### 1. Streaming UI
- Потоковая передача ответа от LLM через SSE
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

### 6. Performance
- **React.memo** для всех сообщений — при стриминге ререндерится только активное assistant-сообщение
- **Plain-text во время стриминга** — Markdown парсится один раз после завершения потока
- **Мемоизация UI-компонентов** — sidebar не перерисовывается во время генерации

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

## Лицензия
MIT — свободно использовать как шаблон для собственных проектов.
