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
