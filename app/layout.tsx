import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CFI Ticketing Tracker',
  description: 'Modern ticketing dashboard for support operations.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
