import { Star } from "lucide-react"

interface FarmerRatingProps {
  rating: number
  reviewCount: number
  size?: "sm" | "md" | "lg"
}

export function FarmerRating({ rating, reviewCount, size = "md" }: FarmerRatingProps) {
  const starSize = size === "sm" ? "w-3 h-3" : size === "lg" ? "w-5 h-5" : "w-4 h-4"
  const textSize = size === "sm" ? "text-xs" : size === "lg" ? "text-base" : "text-sm"

  return (
    <div className="flex items-center">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${starSize} ${
              star <= Math.round(rating) ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
            }`}
          />
        ))}
      </div>
      <span className={`ml-2 ${textSize} font-medium`}>
        {rating.toFixed(1)} ({reviewCount} {reviewCount === 1 ? "review" : "reviews"})
      </span>
    </div>
  )
}
