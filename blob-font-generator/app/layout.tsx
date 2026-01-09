import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blob Font Generator',
  description: 'Create custom blob fonts with smooth organic shapes',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
