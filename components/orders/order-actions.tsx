"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

interface OrderActionsProps {
  orderId: string
  status: string
  hasReviewed: boolean
  isBuyer: boolean
}

export function OrderActions({ orderId, status, hasReviewed, isBuyer }: OrderActionsProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleCancelOrder = async () => {
    if (!confirm("Are you sure you want to cancel this order?")) return

    setLoading(true)
    try {
      const response = await fetch(`/api/orders/cancel?id=${orderId}`, {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Failed to cancel order")
      }

      router.refresh()
    } catch (error) {
      console.error("Error cancelling order:", error)
    } finally {
      setLoading(false)
    }
  }

  // Only buyers can leave reviews for completed orders
  if (isBuyer && status === "completed" && !hasReviewed) {
    return (
      <Button className="bg-green-600 hover:bg-green-700" asChild>
        <Link href={`/dashboard/orders/${orderId}/review`}>Leave a Review</Link>
      </Button>
    )
  }

  // Buyers can cancel pending orders
  if (isBuyer && status === "pending") {
    return (
      <Button variant="destructive" onClick={handleCancelOrder} disabled={loading}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
        Cancel Order
      </Button>
    )
  }

  return null
}
