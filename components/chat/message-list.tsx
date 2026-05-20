'use client';

import React, { useRef, useEffect } from 'react';
import { MessageItem } from './message-item';
import type { Message } from '@ai-sdk/react';

interface MessageListProps {
  messages: Message[];
  isLoading?: boolean;
}

function MessageListComponent({ messages, isLoading }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto">
      {messages.length === 0 && (
        <div className="flex h-full flex-col items-center justify-center px-4 text-center text-muted-foreground">
          <h2 className="mb-2 text-2xl font-bold text-foreground">Чем могу помочь?</h2>
          <p className="max-w-md">
            Задайте любой вопрос — я отвечу текстом. А если спросите о погоде или товаре, покажу интерактивный виджет прямо в чате.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <span className="rounded-full border border-border bg-card px-3 py-1 text-xs">💬 Общие вопросы</span>
            <span className="rounded-full border border-border bg-card px-3 py-1 text-xs">🌤 Погода</span>
            <span className="rounded-full border border-border bg-card px-3 py-1 text-xs">🛍 Товары</span>
          </div>
        </div>
      )}

      {messages.map((message, index) => (
        <MessageItem
          key={message.id}
          message={message}
          isLoading={isLoading}
          isLast={index === messages.length - 1}
        />
      ))}

      {isLoading && messages[messages.length - 1]?.role !== 'assistant' && (
        <div className="flex items-center gap-2 px-4 py-5 text-sm text-muted-foreground">
          <div className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]" />
          <div className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]" />
          <div className="h-2 w-2 animate-bounce rounded-full bg-primary" />
          <span className="ml-2">Думаю...</span>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}

export const MessageList = React.memo(MessageListComponent);
