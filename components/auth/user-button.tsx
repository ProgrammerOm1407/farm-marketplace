"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { getSupabaseBrowserClient } from "@/utils/supabase/client"
import type { User } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"
import { GrapeIcon as Grain, UserIcon, Settings, LogOut, MessageSquare, Bell } from "lucide-react"
import { Badge } from "@/components/ui/badge"

type Profile = Database["public"]["Tables"]["profiles"]["Row"]

export function UserButton() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = getSupabaseBrowserClient()

    // Get the current user
    const getUser = async () => {
      setLoading(true)
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        setUser(user)

        if (user) {
          // Get the user's profile
          const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single()
          setProfile(data)

          // Get unread message count
          const { data: unreadData } = await supabase.rpc("count_unread_messages", { user_id: user.id })
          setUnreadCount(unreadData || 0)
        }
      } catch (error) {
        console.error("Error loading user:", error)
      } finally {
        setLoading(false)
      }
    }

    getUser()

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (!session?.user) {
        setProfile(null)
        setUnreadCount(0)
      } else {
        getUser()
      }
    })

    // Set up a polling interval to check for new messages
    const interval = setInterval(async () => {
      if (user) {
        try {
          const { data: unreadData } = await supabase.rpc("count_unread_messages", { user_id: user.id })
          setUnreadCount(unreadData || 0)
        } catch (error) {
          console.error("Error checking messages:", error)
        }
      }
    }, 30000) // Check every 30 seconds

    return () => {
      subscription.unsubscribe()
      clearInterval(interval)
    }
  }, [])

  const handleSignOut = async () => {
    const supabase = getSupabaseBrowserClient()
    await supabase.auth.signOut()
    router.refresh()
    router.push("/")
  }

  if (loading) {
    return (
      <Button variant="outline" size="sm" disabled>
        Loading...
      </Button>
    )
  }

  if (!user) {
    return (
      <div className="flex items-center gap-4">
        <Link href="/login">
          <Button variant="outline" size="sm">
            Log In
          </Button>
        </Link>
        <Link href="/signup">
          <Button size="sm" className="bg-green-600 hover:bg-green-700">
            Sign Up
          </Button>
        </Link>
      </div>
    )
  }

  const displayName = profile?.full_name || user.email?.split("@")[0] || "User"
  const initials = displayName.substring(0, 2).toUpperCase()
  const userType = profile?.user_type || "user"

  return (
    <div className="flex items-center gap-2">
      {unreadCount > 0 && (
        <Link href="/dashboard/messages">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-green-600">
              {unreadCount}
            </Badge>
            <span className="sr-only">Notifications</span>
          </Button>
        </Link>
      )}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url || "/placeholder.svg"}
                alt={displayName}
                className="h-8 w-8 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                <span className="text-green-600 font-bold text-sm">{initials}</span>
              </div>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{displayName}</p>
              <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
              <p className="text-xs leading-none text-muted-foreground capitalize">{userType}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/dashboard" className="cursor-pointer">
              <Grain className="mr-2 h-4 w-4" />
              <span>Dashboard</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/dashboard/messages" className="cursor-pointer flex items-center justify-between">
              <div className="flex items-center">
                <MessageSquare className="mr-2 h-4 w-4" />
                <span>Messages</span>
              </div>
              {unreadCount > 0 && <Badge className="bg-green-600">{unreadCount}</Badge>}
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/profile" className="cursor-pointer">
              <UserIcon className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/settings" className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
