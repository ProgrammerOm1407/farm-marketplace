import { Star } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface ReviewListProps {
  reviews: {
    id: string
    rating: string
    title: string
    content: string
    created_at: string
    buyer: {
      full_name: string | null
      company_name: string | null
    }
  }[]
  showTitle?: boolean
}

export function ReviewList({ reviews, showTitle = true }: ReviewListProps) {
  if (!reviews || reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <Star className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium">No Reviews Yet</h3>
        <p className="text-gray-500">Be the first to review this product</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {showTitle && (
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Customer Reviews ({reviews.length})</h3>
          <div className="flex items-center">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${
                    star <=
                    Math.round(
                      reviews.reduce((acc, review) => acc + Number.parseInt(review.rating), 0) / reviews.length,
                    )
                      ? "text-yellow-500 fill-yellow-500"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="ml-2 text-sm font-medium">
              {(reviews.reduce((acc, review) => acc + Number.parseInt(review.rating), 0) / reviews.length).toFixed(1)}{" "}
              out of 5
            </span>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="border-b pb-4 last:border-0 last:pb-0">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-xs font-medium text-green-600">
                  {(review.buyer.full_name || review.buyer.company_name || "User").charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <div className="font-medium">{review.buyer.full_name || review.buyer.company_name || "User"}</div>
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= Number.parseInt(review.rating) ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <div className="ml-auto text-sm text-gray-500">
                {formatDistanceToNow(new Date(review.created_at), { addSuffix: true })}
              </div>
            </div>
            <h4 className="font-medium">{review.title}</h4>
            <p className="text-sm text-gray-700 mt-1">{review.content}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
