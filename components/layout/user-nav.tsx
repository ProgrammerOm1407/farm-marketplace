"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getSupabaseBrowserClient } from "@/utils/supabase/client"
import type { User } from "@supabase/supabase-js"
import { Loader2 } from "lucide-react"

type UserNavProps = {
  user: User
}

export function UserNav({ user }: UserNavProps) {
  const router = useRouter()
  const supabase = getSupabaseBrowserClient()
  const [isSigningOut, setIsSigningOut] = useState(false)

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true)
      await supabase.auth.signOut()
      router.refresh()
      router.push("/")
    } catch (error) {
      console.error("Error signing out:", error)
    } finally {
      setIsSigningOut(false)
    }
  }

  // Get initials from email
  const getInitials = (email: string) => {
    return email.substring(0, 2).toUpperCase()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder.svg" alt={user.email || "User"} />
            <AvatarFallback>{user.email ? getInitials(user.email) : "U"}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.email}</p>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/dashboard">Dashboard</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/dashboard/profile">Profile</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/dashboard/orders">Orders</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/dashboard/messages">Messages</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/dashboard/settings">Settings</Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} disabled={isSigningOut} className="cursor-pointer">
          {isSigningOut ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing out...
            </>
          ) : (
            "Sign out"
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
