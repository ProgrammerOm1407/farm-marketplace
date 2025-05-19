import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { GrapeIcon as Grain } from "lucide-react"
import { StarRating } from "@/components/reviews/star-rating"

type ListingGridProps = {
  listings: any[]
}

export function ListingGrid({ listings }: ListingGridProps) {
  if (!listings || listings.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg bg-gray-50">
        <Grain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">No Listings Available</h2>
        <p className="text-gray-500 mb-6">
          There are currently no grain listings matching your filters. Try adjusting your search criteria.
        </p>
      </div>
    )
  }

  // Function to check if a listing is new (less than 24 hours old)
  const isNewListing = (createdAt: string) => {
    const listingDate = new Date(createdAt)
    const now = new Date()
    const diffInHours = (now.getTime() - listingDate.getTime()) / (1000 * 60 * 60)
    return diffInHours < 24
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {listings.map((listing) => {
        // Calculate average rating if reviews exist
        const reviews = listing.reviews || []
        const totalRatings = reviews.length
        const avgRating =
          totalRatings > 0
            ? reviews.reduce((sum: number, review: any) => sum + Number.parseInt(review.rating), 0) / totalRatings
            : 0

        // Check if listing is new
        const isNew = isNewListing(listing.created_at)

        return (
          <Card key={listing.id} className={`overflow-hidden ${isNew ? "ring-2 ring-green-500 ring-offset-2" : ""}`}>
            <div className="aspect-square relative">
              <Image
                src={listing.images?.[0] || `/placeholder.svg?height=300&width=300&text=${listing.title}`}
                alt={listing.title}
                fill
                className="object-cover"
              />
              {listing.farming_method === "organic" && (
                <Badge className="absolute top-2 right-2 bg-green-600">Organic</Badge>
              )}
              {listing.featured && <Badge className="absolute top-2 left-2 bg-yellow-600">Featured</Badge>}
              {isNew && <Badge className="absolute bottom-2 right-2 bg-green-600 animate-pulse">New</Badge>}
            </div>
            <CardContent className="p-4 space-y-2">
              <h3 className="font-semibold text-lg">{listing.title}</h3>
              <p className="text-sm text-gray-500">
                Grown by {listing.profiles.company_name || listing.profiles.full_name || "Anonymous Farmer"}
              </p>
              <p className="text-sm text-gray-500">
                Location: {listing.city}, {listing.state}
              </p>
              <p className="text-sm text-gray-500">
                Available: {listing.quantity} {listing.quantity_unit}
                {listing.quantity !== 1 && "s"}
              </p>
              <p className="text-lg font-semibold">
                ${Number.parseFloat(listing.price).toFixed(2)}/{listing.quantity_unit}
              </p>
              {totalRatings > 0 && (
                <div className="flex items-center space-x-1">
                  <StarRating rating={avgRating} />
                  <span className="text-sm text-gray-500">({totalRatings})</span>
                </div>
              )}
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Button className="w-full bg-green-600 hover:bg-green-700" asChild>
                <Link href={`/marketplace/${listing.id}`}>View Details</Link>
              </Button>
            </CardFooter>
          </Card>
        )
      })}
    </div>
  )
}
