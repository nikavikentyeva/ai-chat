'use client';

import { Send, Square } from 'lucide-react';
import { useAutoResize } from '@/hooks/use-auto-resize';
import { cn } from '@/lib/utils';

interface ChatInputProps {
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  onStop: () => void;
}

export function ChatInput({
  input,
  handleInputChange,
  handleSubmit,
  isLoading,
  onStop,
}: ChatInputProps) {
  const { ref, resize } = useAutoResize(200);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (input.trim() && !isLoading) {
        handleSubmit(e);
      }
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    handleInputChange(e);
    resize();
  };

  return (
    <div className="border-t border-border bg-card p-4">
      <form onSubmit={handleSubmit} className="mx-auto flex max-w-3xl items-end gap-2">
        <textarea
          ref={ref}
          value={input}
          onChange={onChange}
          onKeyDown={handleKeyDown}
          placeholder="Спросите что-нибудь..."
          rows={1}
          className={cn(
            'flex-1 resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm',
            'outline-none transition focus:border-primary focus:ring-1 focus:ring-primary',
            'placeholder:text-muted-foreground'
          )}
        />

        {isLoading ? (
          <button
            type="button"
            onClick={onStop}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border text-muted-foreground transition hover:bg-muted hover:text-foreground"
            title="Остановить генерацию"
          >
            <Square className="h-4 w-4 fill-current" />
          </button>
        ) : (
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className={cn(
              'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition',
              input.trim()
                ? 'bg-primary text-primary-foreground hover:opacity-90'
                : 'bg-muted text-muted-foreground'
            )}
          >
            <Send className="h-4 w-4" />
          </button>
        )}
      </form>
    </div>
  );
}
