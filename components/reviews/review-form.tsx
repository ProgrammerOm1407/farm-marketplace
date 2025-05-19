"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Star } from "lucide-react"
import { Loader2 } from "lucide-react"

interface ReviewFormProps {
  orderId: string
  farmerId: string
  listingId: string
  listingTitle: string
  farmerName: string
}

export function ReviewForm({ orderId, farmerId, listingId, listingTitle, farmerName }: ReviewFormProps) {
  const router = useRouter()
  const [rating, setRating] = useState<number>(0)
  const [hoverRating, setHoverRating] = useState<number>(0)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (rating === 0) {
      setError("Please select a rating")
      setLoading(false)
      return
    }

    try {
      const response = await fetch(`/api/reviews/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          order_id: orderId,
          farmer_id: farmerId,
          listing_id: listingId,
          rating: rating.toString(),
          title,
          content,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to submit review")
      }

      router.refresh()
      router.push(`/dashboard/orders/${orderId}?review=success`)
    } catch (err: any) {
      setError(err.message || "An error occurred while submitting your review")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Write a Review</CardTitle>
        <CardDescription>
          Share your experience with {farmerName} regarding your purchase of {listingTitle}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="space-y-2">
            <label className="text-sm font-medium">Rating</label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="focus:outline-none"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= (hoverRating || rating) ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
              <span className="ml-2 text-sm text-gray-500">
                {rating > 0 ? `${rating} out of 5 stars` : "Select a rating"}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Review Title
            </label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Summarize your experience"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="content" className="text-sm font-medium">
              Review Content
            </label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share details of your experience with this farmer and their product"
              rows={4}
              required
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={() => router.push(`/dashboard/orders/${orderId}`)}>
            Cancel
          </Button>
          <Button type="submit" className="bg-green-600 hover:bg-green-700" disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Submit Review
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
