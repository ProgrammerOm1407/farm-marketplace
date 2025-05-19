"use client"

import { useEffect, useState } from "react"
import { getSupabaseBrowserClient } from "@/utils/supabase/client"
import { Badge } from "@/components/ui/badge"
import { Bell } from "lucide-react"
import Link from "next/link"

export function RealTimeUpdates() {
  const supabase = getSupabaseBrowserClient()
  const [newListingsCount, setNewListingsCount] = useState(0)
  const [priceChangesCount, setPriceChangesCount] = useState(0)
  const [showBadge, setShowBadge] = useState(false)

  useEffect(() => {
    // Get counts of new listings in the last 24 hours
    const getNewListingsCount = async () => {
      const twentyFourHoursAgo = new Date()
      twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24)

      const { count } = await supabase
        .from("grain_listings")
        .select("*", { count: "exact", head: true })
        .eq("status", "active")
        .gte("created_at", twentyFourHoursAgo.toISOString())

      setNewListingsCount(count || 0)
      if (count && count > 0) {
        setShowBadge(true)
      }
    }

    getNewListingsCount()

    // Subscribe to new listings
    const channel = supabase
      .channel("real_time_updates")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "grain_listings",
          filter: "status=eq.active",
        },
        () => {
          setNewListingsCount((prev) => prev + 1)
          setShowBadge(true)
        },
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "grain_listings",
          filter: "status=eq.active",
        },
        (payload) => {
          // Check if price changed
          if (payload.old.price !== payload.new.price) {
            setPriceChangesCount((prev) => prev + 1)
            setShowBadge(true)
          }
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase])

  const totalUpdates = newListingsCount + priceChangesCount

  return (
    <div className="relative">
      <Link
        href="/marketplace"
        className="flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-100"
        onClick={() => {
          setShowBadge(false)
          setNewListingsCount(0)
          setPriceChangesCount(0)
        }}
      >
        <Bell className="h-5 w-5" />
        <span className="hidden md:inline">Updates</span>
      </Link>
      {showBadge && totalUpdates > 0 && (
        <Badge
          className="absolute -top-1 -right-1 bg-red-500 text-white text-xs min-w-[20px] h-5 flex items-center justify-center rounded-full"
          variant="destructive"
        >
          {totalUpdates > 99 ? "99+" : totalUpdates}
        </Badge>
      )}
    </div>
  )
}
