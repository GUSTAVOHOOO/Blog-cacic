import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog CACIC — UTFPR Santa Helena',
  description: 'Blog do Centro Acadêmico de Ciências da Computação da UTFPR-SH',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
