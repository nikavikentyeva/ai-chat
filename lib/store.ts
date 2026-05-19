'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Thread } from '@/types';

interface ChatStore {
  threads: Thread[];
  activeThreadId: string | null;
  createThread: () => string;
  deleteThread: (id: string) => void;
  setActiveThread: (id: string) => void;
  updateThreadTitle: (id: string, title: string) => void;
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      threads: [{ id: 'default', title: 'Новый чат', createdAt: Date.now() }],
      activeThreadId: 'default',

      createThread: () => {
        const id = crypto.randomUUID();
        const thread: Thread = {
          id,
          title: 'Новый чат',
          createdAt: Date.now(),
        };
        set({ threads: [...get().threads, thread], activeThreadId: id });
        return id;
      },

      deleteThread: (id: string) => {
        const remaining = get().threads.filter((t) => t.id !== id);
        if (remaining.length === 0) {
          const newId = crypto.randomUUID();
          const newThread: Thread = {
            id: newId,
            title: 'Новый чат',
            createdAt: Date.now(),
          };
          set({ threads: [newThread], activeThreadId: newId });
        } else {
          set({ threads: remaining, activeThreadId: remaining[0].id });
        }
      },

      setActiveThread: (id: string) => set({ activeThreadId: id }),

      updateThreadTitle: (id: string, title: string) =>
        set({
          threads: get().threads.map((t) =>
            t.id === id ? { ...t, title } : t
          ),
        }),
    }),
    {
      name: 'chat-threads',
    }
  )
);
