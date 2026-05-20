import { streamText, tool } from 'ai';
import { groq } from '@ai-sdk/groq';
import { z } from 'zod';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: groq('llama-3.3-70b-versatile'),
    system: `Ты — AI-ассистент для ритейл-платформы. Ты отвечаешь на вопросы пользователя и можешь показывать интерактивные виджеты: погоду и карточки товаров.

ПРАВИЛА ИСПОЛЬЗОВАНИЯ ИНСТРУМЕНТОВ:
1. Вызывай getWeather ТОЛЬКО если пользователь явно спрашивает о ПОГОДЕ, ТЕМПЕРАТУРЕ или ПРОГНОЗЕ.
2. Вызывай getCurrentTime ТОЛЬКО если пользователь явно спрашивает о ТЕКУЩЕМ ВРЕМЕНИ или ЧАСАХ.
3. Вызывай showProductCard ТОЛЬКО если пользователь явно спрашивает о товаре, продукте или хочет увидеть карточку товара.
4. Если пользователь задаёт общий вопрос (программирование, математика, философия и т.д.) — НЕ вызывай никакие инструменты, просто ответь текстом.
5. Если город не указан при запросе погоды или времени — используй Москву.

Примеры:
- "что такое замыкание в js?" → ответ текстом, БЕЗ инструментов.
- "какая погода в Питере?" → вызови getWeather с city="Санкт-Петербург".
- "сколько время в Москве?" → вызови getCurrentTime.
- "покажи товар iPhone" → вызови showProductCard.
- "расскажи о себе" → ответ текстом, БЕЗ инструментов.`,
    messages,
    toolChoice: 'auto',
    tools: {
      getWeather: tool({
        description: 'Получить текущую погоду для указанного города. Использовать ТОЛЬКО при явном запросе о погоде или температуре.',
        parameters: z.object({
          city: z.string().optional().describe('Название города (если не указан — используй Москву)'),
        }),
        execute: async ({ city }) => {
          const cityName = city || 'Москва';
          const conditions = ['Солнечно', 'Облачно', 'Дождь', 'Снег'];
          const condition = conditions[Math.floor(Math.random() * conditions.length)];
          const temperature = Math.floor(Math.random() * 30) + 5;
          return { city: cityName, temperature, condition };
        },
      }),

      getCurrentTime: tool({
        description: 'Получить текущее время и дату для указанного города. Использовать ТОЛЬКО при явном запросе о времени, часах или текущей дате.',
        parameters: z.object({
          city: z.string().optional().describe('Название города (если не указан — используй Москву)'),
        }),
        execute: async ({ city }) => {
          const cityName = city || 'Москва';
          const timezoneMap: Record<string, string> = {
            'Москва': 'Europe/Moscow',
            'Санкт-Петербург': 'Europe/Moscow',
            'Питер': 'Europe/Moscow',
            'Новосибирск': 'Asia/Novosibirsk',
            'Екатеринбург': 'Asia/Yekaterinburg',
            'Казань': 'Europe/Moscow',
            'Лондон': 'Europe/London',
            'Нью-Йорк': 'America/New_York',
            'Токио': 'Asia/Tokyo',
            'Париж': 'Europe/Paris',
          };
          const tz = timezoneMap[cityName] || 'Europe/Moscow';
          const now = new Date();
          const timeFormatter = new Intl.DateTimeFormat('ru-RU', {
            hour: '2-digit',
            minute: '2-digit',
            timeZone: tz,
          });
          const dateFormatter = new Intl.DateTimeFormat('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            timeZone: tz,
          });
          return {
            city: cityName,
            time: timeFormatter.format(now),
            date: dateFormatter.format(now),
            timezone: tz,
          };
        },
      }),

      showProductCard: tool({
        description:
          'Показать карточку товара в интерфейсе. Использовать ТОЛЬКО если пользователь явно спрашивает о товаре, продукте или хочет увидеть карточку товара.',
        parameters: z.object({
          name: z.string().describe('Название товара'),
          price: z.number().describe('Цена в рублях'),
          description: z.string().optional().describe('Описание товара'),
          category: z.string().optional().describe('Категория товара'),
        }),
        execute: async (params) => params,
      }),
    },
    maxTokens: 2000,
    temperature: 0.5,
  });

  return result.toDataStreamResponse();
}
