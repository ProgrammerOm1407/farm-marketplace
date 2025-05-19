import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import { ToastProvider } from "@/components/ui/toast-simple"
import { RealTimeProvider } from "@/components/providers/real-time-simple"
import { SiteHeader } from "@/components/layout/site-header-simple"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Farm Fresh Market",
  description: "Connect directly with farmers to purchase high-quality grains",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ToastProvider>
          <RealTimeProvider>
            <div className="relative flex min-h-screen flex-col">
              <SiteHeader />
              <div className="flex-1">{children}</div>
            </div>
          </RealTimeProvider>
        </ToastProvider>
      </body>
    </html>
  )
}
