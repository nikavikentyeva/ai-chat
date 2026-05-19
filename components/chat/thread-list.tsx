'use client';

import { Plus } from 'lucide-react';
import { useChatStore } from '@/lib/store';
import { ThreadItem } from './thread-item';

export function ThreadList() {
  const { threads, activeThreadId, createThread, setActiveThread, deleteThread } =
    useChatStore();

  return (
    <div className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
      <button
        onClick={createThread}
        className="mb-3 flex items-center justify-center gap-2 rounded-lg border border-dashed border-border py-2.5 text-sm font-medium text-muted-foreground transition hover:border-primary hover:text-primary"
      >
        <Plus className="h-4 w-4" />
        Новый чат
      </button>

      {threads.map((thread) => (
        <ThreadItem
          key={thread.id}
          thread={thread}
          isActive={thread.id === activeThreadId}
          onClick={() => setActiveThread(thread.id)}
          onDelete={() => deleteThread(thread.id)}
        />
      ))}
    </div>
  );
}
