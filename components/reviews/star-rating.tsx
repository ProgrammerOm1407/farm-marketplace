import { Star } from "lucide-react"

type StarRatingProps = {
  rating: number
  size?: number
}

export function StarRating({ rating, size = 16 }: StarRatingProps) {
  // Round to nearest half
  const roundedRating = Math.round(rating * 2) / 2

  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => {
        // Full star
        if (star <= roundedRating) {
          return <Star key={star} className="text-yellow-500 fill-yellow-500" size={size} />
        }
        // Half star
        else if (star - 0.5 === roundedRating) {
          return (
            <div key={star} className="relative">
              <Star className="text-gray-300 fill-gray-300" size={size} />
              <div className="absolute top-0 left-0 overflow-hidden" style={{ width: "50%" }}>
                <Star className="text-yellow-500 fill-yellow-500" size={size} />
              </div>
            </div>
          )
        }
        // Empty star
        else {
          return <Star key={star} className="text-gray-300 fill-gray-300" size={size} />
        }
      })}
    </div>
  )
}
