'use client';

import React from 'react';
import { User, Bot, Loader2, Cloud, Package, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDate } from '@/lib/utils';
import { MarkdownRenderer } from '@/components/ui/markdown-renderer';
import { WeatherCard } from '@/components/ui/weather-card';
import { ProductCard } from '@/components/ui/product-card';
import type { Message } from '@ai-sdk/react';

interface MessageItemProps {
  message: Message;
  isLoading?: boolean;
  isLast?: boolean;
}

function MessageItemComponent({ message, isLoading, isLast }: MessageItemProps) {
  const isUser = message.role === 'user';
  const isStreaming = isLoading && !isUser && isLast && !message.toolInvocations?.length;

  return (
    <div
      className={cn(
        'flex gap-3 px-4 py-5 transition-colors',
        isUser ? 'bg-background' : 'bg-muted/30'
      )}
    >
      <div
        className={cn(
          'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
          isUser ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
        )}
      >
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>

      <div className="flex-1 space-y-1 overflow-hidden">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">
            {isUser ? 'Вы' : 'AI Ассистент'}
          </span>
          <span className="text-xs text-muted-foreground">
            {message.createdAt ? formatDate(message.createdAt) : ''}
          </span>
        </div>

        <div className="prose prose-sm max-w-none text-foreground">
          {message.content && isStreaming ? (
            <div className="whitespace-pre-wrap">{message.content}</div>
          ) : message.content ? (
            <MarkdownRenderer content={message.content} />
          ) : null}
        </div>

        {/* Tool invocations — Generative UI & Tool Calling */}
        {message.toolInvocations?.map((tool) => (
          <div key={tool.toolCallId} className="mt-2">
            {(tool.state === 'call' || tool.state === 'partial-call') && (
              <div className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                {tool.toolName === 'getWeather' && (
                  <span className="flex items-center gap-1.5">
                    <Cloud className="h-4 w-4" />
                    Ищу данные о погоде...
                  </span>
                )}
                {tool.toolName === 'showProductCard' && (
                  <span className="flex items-center gap-1.5">
                    <Package className="h-4 w-4" />
                    Формирую карточку товара...
                  </span>
                )}
                {tool.toolName !== 'getWeather' && tool.toolName !== 'showProductCard' && (
                  <span>Использую инструмент: {tool.toolName}...</span>
                )}
              </div>
            )}

            {tool.state === 'result' && tool.result && tool.toolName === 'getWeather' && (
              <WeatherCard
                city={(tool.result as any).city}
                temperature={(tool.result as any).temperature}
                condition={(tool.result as any).condition}
              />
            )}
            {tool.state === 'result' && tool.result && tool.toolName === 'showProductCard' && (
              <ProductCard
                name={(tool.result as any).name}
                price={(tool.result as any).price}
                description={(tool.result as any).description}
                category={(tool.result as any).category}
              />
            )}
            {tool.state === 'result' && tool.result && tool.toolName === 'getCurrentTime' && (
              <div className="my-2 inline-flex items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{(tool.result as any).city}</p>
                  <p className="text-2xl font-bold">{(tool.result as any).time}</p>
                  <p className="text-sm text-muted-foreground">{(tool.result as any).date}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export const MessageItem = React.memo(MessageItemComponent, (prev, next) => {
  return (
    prev.message.id === next.message.id &&
    prev.message.content === next.message.content &&
    prev.message.role === next.message.role &&
    prev.isLoading === next.isLoading &&
    prev.isLast === next.isLast &&
    JSON.stringify(prev.message.toolInvocations) === JSON.stringify(next.message.toolInvocations)
  );
});
