"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { UserNav } from "./user-nav"
import { RealTimeUpdates } from "@/components/marketplace/real-time-updates"

type SiteHeaderProps = {
  user: any | null
}

export function SiteHeader({ user }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold">Farm Fresh Market</span>
        </Link>
        <nav className="ml-auto flex items-center gap-4">
          <Link href="/marketplace" className="text-sm font-medium transition-colors hover:text-primary">
            Marketplace
          </Link>
          <Link
            href="/about"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            About
          </Link>
          <RealTimeUpdates />
          {user ? (
            <UserNav user={user} />
          ) : (
            <Button asChild>
              <Link href="/login">Sign In</Link>
            </Button>
          )}
        </nav>
      </div>
    </header>
  )
}
