import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  GrapeIcon as Grain,
  MapPin,
  Phone,
  Mail,
  Star,
  Truck,
  Calendar,
  Shield,
  MessageSquare,
  ShoppingCart,
} from "lucide-react"
import { createClient } from "@/utils/supabase/server"
import { SiteHeader } from "@/components/layout/site-header"
import { formatCurrency } from "@/lib/format"
import { ReviewList } from "@/components/reviews/review-list"
import { FarmerRating } from "@/components/reviews/farmer-rating"

export default async function ProductDetail({ params }: { params: { id: string } }) {
  const supabase = createClient()

  // Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Increment view count
  await supabase.rpc("increment_view_count", { listing_id: params.id })

  // Fetch the listing with farmer profile
  const { data: listing, error } = await supabase
    .from("grain_listings")
    .select(`
      *,
      profiles:farmer_id (
        id,
        full_name,
        company_name,
        phone,
        email:id,
        avatar_url,
        bio,
        user_type
      ),
      reviews:reviews!listing_id(
        id,
        rating,
        title,
        content,
        created_at,
        buyer:buyer_id(
          full_name,
          company_name
        )
      )
    `)
    .eq("id", params.id)
    .single()

  if (error || !listing) {
    console.error("Error fetching listing:", error)
    notFound()
  }

  // Format the harvest date
  const harvestDate = listing.harvest_date
    ? new Date(listing.harvest_date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
      })
    : "Not specified"

  // Get farmer display name
  const farmerName = listing.profiles.company_name || listing.profiles.full_name || "Anonymous Farmer"
  const farmerInitials = farmerName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2)

  // Check if the current user is the farmer of this listing
  const isOwnListing = user?.id === listing.farmer_id

  // Get user profile if logged in
  let userProfile = null
  if (user) {
    const { data: profile } = await supabase.from("profiles").select("user_type").eq("id", user.id).single()
    userProfile = profile
  }

  // Check if the user is a buyer
  const isBuyer = userProfile?.user_type === "buyer"

  // Calculate the average rating
  const reviews = listing.reviews || []
  const averageRating =
    reviews.length > 0 ? reviews.reduce((acc, review) => acc + Number.parseInt(review.rating), 0) / reviews.length : 0

  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <main className="flex-1">
        <div className="container px-4 py-8 md:px-6 md:py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="relative aspect-square overflow-hidden rounded-lg">
                <Image
                  src={`/placeholder.svg?height=600&width=600&text=${listing.title}`}
                  alt={listing.title}
                  fill
                  className="object-cover"
                />
                {listing.farming_method === "organic" && (
                  <Badge className="absolute top-4 right-4 bg-green-600">Organic</Badge>
                )}
                {listing.featured && <Badge className="absolute top-4 left-4 bg-yellow-600">Featured</Badge>}
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="relative aspect-square overflow-hidden rounded-md">
                    <Image
                      src={`/placeholder.svg?height=150&width=150&text=Image ${i}`}
                      alt={`Product image ${i}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold">{listing.title}</h1>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline" className="capitalize">
                    {listing.grain_type.replace("_", " ")}
                  </Badge>
                  <Badge variant="outline" className="capitalize">
                    {listing.farming_method.replace("_", " ")}
                  </Badge>
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="w-4 h-4 mr-1" />
                    {listing.city}, {listing.state}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-3xl font-bold">{formatCurrency(listing.price)}</div>
                <div className="text-gray-500">per {listing.quantity_unit}</div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Truck className="w-5 h-5 text-green-600" />
                  <span>
                    Available: {listing.quantity} {listing.quantity_unit}
                    {listing.quantity !== 1 && "s"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-green-600" />
                  <span>Harvest Date: {harvestDate}</span>
                </div>
                {listing.minimum_order && (
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-green-600" />
                    <span>
                      Minimum Order: {listing.minimum_order} {listing.quantity_unit}
                      {listing.minimum_order !== 1 && "s"}
                    </span>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {!isOwnListing ? (
                    <>
                      <Button className="w-full bg-green-600 hover:bg-green-700" asChild>
                        <Link href={`/marketplace/${params.id}/contact`}>
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Contact Farmer
                        </Link>
                      </Button>
                      {user && isBuyer ? (
                        <Button variant="outline" className="w-full" asChild>
                          <Link href={`/marketplace/${params.id}/purchase`}>
                            <ShoppingCart className="mr-2 h-4 w-4" />
                            Purchase
                          </Link>
                        </Button>
                      ) : (
                        <Button variant="outline" className="w-full" asChild>
                          <Link href={user ? "/profile" : "/signup"}>
                            {user ? "Update Profile to Buy" : "Sign Up to Purchase"}
                          </Link>
                        </Button>
                      )}
                    </>
                  ) : (
                    <>
                      <Button className="w-full bg-green-600 hover:bg-green-700" asChild>
                        <Link href={`/dashboard/listings/${params.id}/edit`}>Edit Listing</Link>
                      </Button>
                      <Button variant="outline" className="w-full" asChild>
                        <Link href="/dashboard/listings">View All Listings</Link>
                      </Button>
                    </>
                  )}
                </div>
              </div>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                      <span className="text-green-600 font-bold">{farmerInitials}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold">{farmerName}</h3>
                      <div className="flex items-center text-sm">
                        <Star className="w-4 h-4 text-yellow-500 mr-1" />
                        <span>Verified Farmer</span>
                      </div>
                      {reviews.length > 0 && (
                        <div className="mt-1">
                          <FarmerRating rating={averageRating} reviewCount={reviews.length} size="sm" />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="mt-4 grid gap-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span>{listing.profiles.phone || "Phone not provided"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <span>Contact via platform</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Grain className="w-4 h-4 text-gray-500" />
                      <span>Verified Farmer</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="mt-12">
            <Tabs defaultValue="description">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="specifications">Specifications</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>
              <TabsContent value="description" className="p-4 border rounded-md mt-4">
                <h3 className="text-lg font-semibold mb-2">Product Description</h3>
                <p>{listing.description}</p>
              </TabsContent>
              <TabsContent value="specifications" className="p-4 border rounded-md mt-4">
                <h3 className="text-lg font-semibold mb-2">Product Specifications</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between py-2 border-b">
                      <span className="font-medium">Type</span>
                      <span className="capitalize">{listing.grain_type.replace("_", " ")}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="font-medium">Farming Method</span>
                      <span className="capitalize">{listing.farming_method.replace("_", " ")}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="font-medium">Harvest Date</span>
                      <span>{harvestDate}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between py-2 border-b">
                      <span className="font-medium">Location</span>
                      <span>
                        {listing.city}, {listing.state}
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="font-medium">Available Quantity</span>
                      <span>
                        {listing.quantity} {listing.quantity_unit}
                        {listing.quantity !== 1 && "s"}
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="font-medium">Minimum Order</span>
                      <span>
                        {listing.minimum_order
                          ? `${listing.minimum_order} ${listing.quantity_unit}${listing.minimum_order !== 1 ? "s" : ""}`
                          : "Not specified"}
                      </span>
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="reviews" className="p-4 border rounded-md mt-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Customer Reviews</h3>
                  {user && isBuyer && (
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/marketplace">Browse More Products</Link>
                    </Button>
                  )}
                </div>
                <ReviewList reviews={listing.reviews || []} />
              </TabsContent>
            </Tabs>
          </div>

          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Similar Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <div className="aspect-square relative">
                    <Image
                      src={`/placeholder.svg?height=300&width=300&text=Similar ${i}`}
                      alt={`Similar product ${i}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold">Similar Grain Product {i}</h3>
                    <p className="text-sm text-gray-500">Another Farm</p>
                    <div className="flex items-center justify-between mt-2">
                      <p className="font-semibold">${(7 + i).toFixed(2)}/bushel</p>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
      <footer className="border-t bg-gray-50">
        <div className="container flex flex-col gap-6 py-8 md:py-12 px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8">
            <Link href="/" className="flex items-center gap-2">
              <Grain className="w-6 h-6 text-green-600" />
              <span className="text-xl font-bold">Farm Fresh Market</span>
            </Link>
            <nav className="grid grid-cols-2 md:flex gap-4 md:gap-6 text-sm">
              <Link href="/marketplace" className="hover:underline underline-offset-4">
                Marketplace
              </Link>
              <Link href="/how-it-works" className="hover:underline underline-offset-4">
                How It Works
              </Link>
              <Link href="/about" className="hover:underline underline-offset-4">
                About Us
              </Link>
              <Link href="/contact" className="hover:underline underline-offset-4">
                Contact
              </Link>
              <Link href="/privacy" className="hover:underline underline-offset-4">
                Privacy
              </Link>
              <Link href="/terms" className="hover:underline underline-offset-4">
                Terms
              </Link>
            </nav>
          </div>
          <div className="text-sm text-gray-500">
            © {new Date().getFullYear()} Farm Fresh Market. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
