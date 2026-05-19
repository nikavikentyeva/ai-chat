'use client';

import { MessageSquare, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Thread } from '@/types';

interface ThreadItemProps {
  thread: Thread;
  isActive: boolean;
  onClick: () => void;
  onDelete: () => void;
}

export function ThreadItem({ thread, isActive, onClick, onDelete }: ThreadItemProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'group flex cursor-pointer items-center justify-between rounded-lg px-3 py-2.5 transition',
        isActive
          ? 'bg-primary/10 text-primary'
          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
      )}
    >
      <div className="flex items-center gap-2.5 overflow-hidden">
        <MessageSquare className="h-4 w-4 shrink-0" />
        <span className="truncate text-sm">{thread.title}</span>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className="shrink-0 opacity-0 transition group-hover:opacity-100 hover:text-red-500"
        title="Удалить чат"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
