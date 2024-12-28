// src/app/layout.tsx
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '../components/theme-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Plant AI Assistant',
  description: 'Identify and learn about plants using AI',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main className="min-h-screen bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-800">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  )
}