import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AI Chat Platform',
  description: 'Платформа AI-ассистентов с streaming UI, tool calling и generative UI',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className="h-screen overflow-hidden antialiased">{children}</body>
    </html>
  );
}
