"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getSupabaseBrowserClient } from "@/utils/supabase/client"
import { useToast } from "@/components/ui/toast-context"

type RealTimeProviderProps = {
  children: React.ReactNode
}

export function RealTimeProvider({ children }: RealTimeProviderProps) {
  const supabase = getSupabaseBrowserClient()
  const { addToast } = useToast()
  const router = useRouter()
  const [newListings, setNewListings] = useState<Record<string, any>[]>([])
  const [priceChanges, setPriceChanges] = useState<Record<string, any>[]>([])

  useEffect(() => {
    // Subscribe to grain_listings table changes
    const channel = supabase
      .channel("grain_listings_changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "grain_listings",
          filter: "status=eq.active",
        },
        (payload) => {
          console.log("New listing:", payload.new)

          // Add to new listings array
          setNewListings((prev) => [...prev, payload.new])

          // Show toast notification
          addToast({
            title: "New Listing Available!",
            description: `${payload.new.title} - $${Number.parseFloat(payload.new.price).toFixed(2)}/${
              payload.new.quantity_unit
            }`,
            variant: "success",
            action: (
              <button
                onClick={() => {
                  router.push(`/marketplace/${payload.new.id}`)
                }}
                className="rounded bg-green-600 px-3 py-1 text-xs font-medium text-white hover:bg-green-700"
              >
                View
              </button>
            ),
          })

          // Refresh the page data
          router.refresh()
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
          const oldPrice = Number.parseFloat(payload.old.price)
          const newPrice = Number.parseFloat(payload.new.price)

          // Only notify if price has changed
          if (oldPrice !== newPrice) {
            console.log("Price change:", payload.old.price, "->", payload.new.price)

            // Add to price changes array
            setPriceChanges((prev) => [...prev, { ...payload.new, oldPrice }])

            // Show toast notification
            const priceChange = newPrice < oldPrice ? "decreased" : "increased"
            const variant = newPrice < oldPrice ? "info" : "warning"

            addToast({
              title: "Price Update",
              description: `${payload.new.title} price has ${priceChange} from $${oldPrice.toFixed(2)} to $${newPrice.toFixed(
                2,
              )}/${payload.new.quantity_unit}`,
              variant,
              action: (
                <button
                  onClick={() => {
                    router.push(`/marketplace/${payload.new.id}`)
                  }}
                  className="rounded bg-blue-600 px-3 py-1 text-xs font-medium text-white hover:bg-blue-700"
                >
                  View
                </button>
              ),
            })

            // Refresh the page data
            router.refresh()
          }
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [addToast, router, supabase])

  return children
}
