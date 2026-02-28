import type { Metadata } from 'next';
import '@/styles/globals.css';
import { Navbar } from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'Partograma LCG - WHO Labour Care Guide 2020',
  description:
    'Aplicação web para acompanhamento do trabalho de parto baseado no WHO Labour Care Guide (LCG 2020)',
  keywords: ['partograma', 'LCG', 'WHO', 'OMS', 'trabalho de parto', 'obstetrícia'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen antialiased">
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
