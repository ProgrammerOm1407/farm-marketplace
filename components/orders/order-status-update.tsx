"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"

interface OrderStatusUpdateProps {
  orderId: string
  currentStatus: string
}

export function OrderStatusUpdate({ orderId, currentStatus }: OrderStatusUpdateProps) {
  const router = useRouter()
  const [status, setStatus] = useState(currentStatus)
  const [notes, setNotes] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch(`/api/orders/update-status?id=${orderId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status, notes }),
      })

      if (!response.ok) {
        throw new Error("Failed to update order status")
      }

      router.refresh()
    } catch (error) {
      console.error("Error updating order status:", error)
    } finally {
      setLoading(false)
    }
  }

  // Define available status options based on current status
  const getStatusOptions = () => {
    switch (currentStatus) {
      case "pending":
        return ["confirmed", "cancelled"]
      case "confirmed":
        return ["processing", "cancelled"]
      case "processing":
        return ["ready", "cancelled"]
      case "ready":
        return ["shipped", "cancelled"]
      case "shipped":
        return ["delivered", "cancelled"]
      case "delivered":
        return ["completed", "cancelled"]
      default:
        return []
    }
  }

  const statusOptions = getStatusOptions()

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-gray-50 p-4 rounded-md">
      <h3 className="font-medium">Update Order Status</h3>
      <div className="space-y-2">
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((option) => (
              <SelectItem key={option} value={option} className="capitalize">
                {option.replace("_", " ")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Textarea
          placeholder="Add notes about this status change (optional)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
        />
      </div>
      <Button type="submit" className="bg-green-600 hover:bg-green-700" disabled={loading || status === currentStatus}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
        Update Status
      </Button>
    </form>
  )
}
