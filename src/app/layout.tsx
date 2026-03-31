import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Accessibility Testing & Fixing Tool',
  description: 'Advanced tool to audit, analyze, and fix accessibility issues in web pages',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
