import { createClient } from "@/utils/supabase/server"
import Link from "next/link"
import { GrapeIcon as Grain, BarChart3, MessageSquare, ShoppingCart, Settings, LogOut, Plus } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export async function DashboardSidebar() {
  const supabase = createClient()

  // Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Get unread message count if user is logged in
  let unreadCount = 0
  if (user) {
    const { data } = await supabase.rpc("count_unread_messages", { user_id: user.id })
    unreadCount = data || 0
  }

  return (
    <aside className="hidden md:flex w-64 flex-col border-r bg-gray-50">
      <div className="flex h-14 items-center border-b px-4">
        <Link href="/" className="flex items-center gap-2">
          <Grain className="w-6 h-6 text-green-600" />
          <span className="text-xl font-bold">Farm Fresh</span>
        </Link>
      </div>
      <nav className="flex-1 overflow-auto py-4">
        <div className="px-4 mb-4">
          <h2 className="mb-2 text-xs font-semibold text-gray-500">Dashboard</h2>
          <div className="grid gap-1">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              <BarChart3 className="h-4 w-4" />
              Overview
            </Link>
            <Link
              href="/dashboard/listings"
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              <Grain className="h-4 w-4" />
              My Listings
            </Link>
            <Link
              href="/dashboard/add-listing"
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              <Plus className="h-4 w-4" />
              Add New Listing
            </Link>
            <Link
              href="/dashboard/messages"
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              <MessageSquare className="h-4 w-4" />
              Messages
              {unreadCount > 0 && <Badge className="ml-auto bg-green-600">{unreadCount}</Badge>}
            </Link>
            <Link
              href="/dashboard/orders"
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              <ShoppingCart className="h-4 w-4" />
              Orders
            </Link>
          </div>
        </div>
        <div className="px-4">
          <h2 className="mb-2 text-xs font-semibold text-gray-500">Settings</h2>
          <div className="grid gap-1">
            <Link
              href="/profile"
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              <Settings className="h-4 w-4" />
              Account Settings
            </Link>
            <form action="/api/auth/signout" method="post">
              <button
                type="submit"
                className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </form>
          </div>
        </div>
      </nav>
    </aside>
  )
}
