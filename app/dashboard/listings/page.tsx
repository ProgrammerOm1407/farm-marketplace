import { redirect } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/utils/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SiteHeader } from "@/components/layout/site-header"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { GrapeIcon as Grain, Eye, MessageSquare, Edit, Trash2, Plus } from "lucide-react"

export default async function ListingsPage() {
  const supabase = createClient()

  // Get the current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    redirect("/login")
  }

  // Get the user's profile
  const { data: profile, error: profileError } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (profileError) {
    console.error("Error fetching profile:", profileError)
    redirect("/dashboard")
  }

  // Get the user's listings
  const { data: listings, error: listingsError } = await supabase
    .from("grain_listings")
    .select("*")
    .eq("farmer_id", user.id)
    .order("created_at", { ascending: false })

  if (listingsError) {
    console.error("Error fetching listings:", listingsError)
  }

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />
      <div className="flex flex-col flex-1">
        <SiteHeader />
        <main className="flex-1 container py-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold">My Grain Listings</h1>
              <p className="text-gray-500">Manage your grain listings on the marketplace</p>
            </div>
            <Link href="/dashboard/add-listing">
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="mr-2 h-4 w-4" />
                Add New Listing
              </Button>
            </Link>
          </div>

          {profile.user_type !== "farmer" ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
              <h2 className="text-lg font-semibold text-yellow-800">Farmer Account Required</h2>
              <p className="text-yellow-700">
                Only farmers can create and manage grain listings. Please update your account type to "Farmer" in your
                profile settings to access this feature.
              </p>
              <Button variant="outline" className="mt-2" asChild>
                <Link href="/profile">Update Profile</Link>
              </Button>
            </div>
          ) : listings && listings.length > 0 ? (
            <div className="grid gap-6">
              {listings.map((listing) => (
                <Card key={listing.id}>
                  <CardContent className="p-6">
                    <div className="grid md:grid-cols-6 gap-4 items-center">
                      <div className="md:col-span-2">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-md bg-green-100 flex items-center justify-center">
                            <Grain className="h-6 w-6 text-green-600" />
                          </div>
                          <div>
                            <div className="font-medium text-lg">{listing.title}</div>
                            <div className="text-sm text-gray-500 capitalize">
                              {listing.grain_type.replace("_", " ")} • ${listing.price.toFixed(2)}/
                              {listing.quantity_unit}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-sm">
                        <div className="font-medium">Quantity</div>
                        <div className="text-gray-500">
                          {listing.quantity} {listing.quantity_unit}
                          {listing.quantity !== 1 && "s"}
                        </div>
                      </div>
                      <div className="text-sm">
                        <div className="font-medium">Location</div>
                        <div className="text-gray-500">
                          {listing.city}, {listing.state}
                        </div>
                      </div>
                      <div className="text-sm">
                        <div className="font-medium">Stats</div>
                        <div className="flex items-center gap-2 text-gray-500">
                          <Eye className="h-3 w-3" /> {listing.views || 0}
                          <MessageSquare className="h-3 w-3 ml-2" /> 0
                        </div>
                      </div>
                      <div className="flex items-center justify-end gap-2">
                        <Badge
                          className={
                            listing.status === "active"
                              ? "bg-green-600"
                              : listing.status === "pending"
                                ? "bg-yellow-600"
                                : listing.status === "sold"
                                  ? "bg-blue-600"
                                  : "bg-gray-600"
                          }
                        >
                          {listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}
                        </Badge>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="icon" asChild>
                            <Link href={`/dashboard/listings/${listing.id}/edit`}>
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Link>
                          </Button>
                          <form action={`/api/listings/delete?id=${listing.id}`} method="post">
                            <Button variant="outline" size="icon" type="submit" className="text-red-500">
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </form>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border rounded-lg bg-gray-50">
              <Grain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">No Listings Yet</h2>
              <p className="text-gray-500 mb-6">You haven't created any grain listings yet.</p>
              <Button className="bg-green-600 hover:bg-green-700" asChild>
                <Link href="/dashboard/add-listing">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Listing
                </Link>
              </Button>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
