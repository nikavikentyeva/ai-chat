'use client';

import { useState, useCallback, useRef } from 'react';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'tool';
  content: string;
  toolInvocations?: ToolInvocation[];
  createdAt: number;
}

export interface ToolInvocation {
  toolCallId: string;
  toolName: string;
  result: any;
  state?: 'pending' | 'result';
}

interface UseChatOptions {
  api: string;
  threadId: string;
  initialMessages?: ChatMessage[];
}

interface UseChatHelpers {
  messages: ChatMessage[];
  input: string;
  setInput: (value: string) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  error: string | null;
  stop: () => void;
  setMessages: (messages: ChatMessage[]) => void;
}

export function useChat(options: UseChatOptions): UseChatHelpers {
  const { api, threadId, initialMessages = [] } = options;

  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);
  const assistantMessageRef = useRef<ChatMessage | null>(null);

  const stop = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsLoading(false);
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!input.trim() || isLoading) return;

      const userMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'user',
        content: input.trim(),
        createdAt: Date.now(),
      };

      // Optimistic update
      const updatedMessages = [...messages, userMessage];
      setMessages(updatedMessages);
      setInput('');
      setIsLoading(true);
      setError(null);

      // Save to localStorage
      localStorage.setItem(`messages-${threadId}`, JSON.stringify(updatedMessages));

      try {
        abortControllerRef.current = new AbortController();

        // Filter out empty assistant messages before sending to AI
        const messagesForAI = updatedMessages
          .filter((m) => !(m.role === 'assistant' && !m.content?.trim() && (!m.toolInvocations || m.toolInvocations.length === 0)))
          .map((m) => ({ role: m.role, content: m.content }));

        const response = await fetch(api, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: messagesForAI }),
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        let assistantMessage: ChatMessage = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: '',
          toolInvocations: [],
          createdAt: Date.now(),
        };
        assistantMessageRef.current = assistantMessage;

        // Add placeholder assistant message
        setMessages((prev) => [...prev, assistantMessage]);

        while (true) {
          const { done, value } = await reader!.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (!line.startsWith('data: ')) continue;
            const data = line.slice(6);
            if (data === '[DONE]') continue;

            try {
              const event = JSON.parse(data);

              if (event.type === 'text') {
                assistantMessage = {
                  ...assistantMessage,
                  content: assistantMessage.content + event.content,
                };
                setMessages((prev) =>
                  prev.map((m) => (m.id === assistantMessage.id ? assistantMessage : m))
                );
              } else if (event.type === 'tool-start') {
                const toolInvocation: ToolInvocation = {
                  toolCallId: event.toolCallId || crypto.randomUUID(),
                  toolName: event.toolName,
                  result: null,
                  state: 'pending',
                };
                assistantMessage = {
                  ...assistantMessage,
                  toolInvocations: [...(assistantMessage.toolInvocations || []), toolInvocation],
                };
                setMessages((prev) =>
                  prev.map((m) => (m.id === assistantMessage.id ? assistantMessage : m))
                );
              } else if (event.type === 'tool') {
                const existingIndex = assistantMessage.toolInvocations?.findIndex(
                  (t) => t.toolCallId === event.toolCallId
                ) ?? -1;
                let newInvocations = [...(assistantMessage.toolInvocations || [])];
                if (existingIndex >= 0) {
                  newInvocations[existingIndex] = {
                    ...newInvocations[existingIndex],
                    result: event.result,
                    state: 'result',
                  };
                } else {
                  newInvocations.push({
                    toolCallId: event.toolCallId || crypto.randomUUID(),
                    toolName: event.toolName,
                    result: event.result,
                    state: 'result',
                  });
                }
                assistantMessage = {
                  ...assistantMessage,
                  toolInvocations: newInvocations,
                };
                setMessages((prev) =>
                  prev.map((m) => (m.id === assistantMessage.id ? assistantMessage : m))
                );
              } else if (event.type === 'error') {
                setError(event.message || 'Ошибка генерации');
              } else if (event.type === 'done') {
                // finished
              }
            } catch {
              // ignore parse errors for partial data
            }
          }
        }

        // Final save
        localStorage.setItem(
          `messages-${threadId}`,
          JSON.stringify([...updatedMessages, assistantMessage])
        );
      } catch (err) {
        if ((err as Error).name === 'AbortError') {
          // User cancelled
        } else {
          setError((err as Error).message || 'Неизвестная ошибка');
        }
      } finally {
        setIsLoading(false);
        abortControllerRef.current = null;
      }
    },
    [input, isLoading, messages, api, threadId]
  );

  return {
    messages,
    input,
    setInput,
    handleInputChange,
    handleSubmit,
    isLoading,
    error,
    stop,
    setMessages,
  };
}
