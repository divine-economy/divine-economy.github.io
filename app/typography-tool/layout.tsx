import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pixel Blob Typography Tool',
  description: 'Create custom fonts with organic grid-based typography',
};

export default function TypographyToolLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
