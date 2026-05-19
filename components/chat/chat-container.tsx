'use client';

import { useEffect } from 'react';
import { useChatStore } from '@/lib/store';
import { useChat } from '@/hooks/use-chat';
import { MessageList } from './message-list';
import { ChatInput } from './chat-input';

interface ChatContainerProps {
  threadId: string;
}

export function ChatContainer({ threadId }: ChatContainerProps) {
  const updateThreadTitle = useChatStore((s) => s.updateThreadTitle);

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    setMessages,
    stop,
    error,
  } = useChat({
    api: '/api/chat',
    threadId,
  });

  // Load messages from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(`messages-${threadId}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setMessages(parsed);
      } catch {
        // ignore parse error
      }
    } else {
      setMessages([]);
    }
  }, [threadId, setMessages]);

  // Auto-title thread on first message
  useEffect(() => {
    if (messages.length === 1 && messages[0].role === 'user') {
      const title = messages[0].content.slice(0, 30) + '...';
      updateThreadTitle(threadId, title);
    }
  }, [messages, threadId, updateThreadTitle]);

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <h2 className="text-sm font-medium text-muted-foreground">
          Thread ID: {threadId.slice(0, 8)}
        </h2>
        {isLoading && (
          <span className="flex items-center gap-1.5 text-xs text-primary">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            Генерация...
          </span>
        )}
      </div>

      {error && (
        <div className="mx-4 mt-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600 dark:border-red-900 dark:bg-red-950 dark:text-red-400">
          Ошибка: {error}
        </div>
      )}

      <MessageList messages={messages} isLoading={isLoading} />

      <ChatInput
        input={input}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        isLoading={isLoading}
        onStop={stop}
      />
    </div>
  );
}
