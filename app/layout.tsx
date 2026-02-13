import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: 'eGuy - Simple & Secure Financial Services',
  description: 'Send money, pay bills, and manage your finances with ease. Built for Nigerians, by Nigerians.',
  generator: 'eGuy',
}

import { usePathname } from "next/navigation";
import MobileNavWrapper from "@/components/ui/mobile-nav-wrapper";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.bunny.net" />
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />
      </head>
      <body className="font-sans antialiased bg-white text-gray-900">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
          <MobileNavWrapper />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
