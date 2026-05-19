'use client';

import { ChatContainer } from '@/components/chat/chat-container';
import { ThreadList } from '@/components/chat/thread-list';
import { useChatStore } from '@/lib/store';

export default function Home() {
  const activeThreadId = useChatStore((s) => s.activeThreadId);

  return (
    <div className="flex h-screen w-full bg-background">
      <aside className="hidden w-72 flex-col border-r border-border bg-card md:flex">
        <div className="flex items-center gap-2 border-b border-border p-4">
          <div className="h-6 w-6 rounded-full bg-primary" />
          <h1 className="font-semibold text-card-foreground">AI Assistant</h1>
        </div>
        <ThreadList />
      </aside>

      <main className="flex flex-1 flex-col">
        {activeThreadId ? (
          <ChatContainer key={activeThreadId} threadId={activeThreadId} />
        ) : (
          <div className="flex flex-1 items-center justify-center text-muted-foreground">
            Выберите или создайте чат
          </div>
        )}
      </main>
    </div>
  );
}
