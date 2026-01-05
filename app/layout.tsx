import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Divine Economy',
  description: 'Personal site of David Phelps',
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
