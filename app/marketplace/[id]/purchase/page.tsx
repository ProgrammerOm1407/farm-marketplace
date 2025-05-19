import { redirect } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/utils/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SiteHeader } from "@/components/layout/site-header"
import { formatCurrency } from "@/lib/format"

export default async function PurchasePage({ params }: { params: { id: string } }) {
  const supabase = createClient()

  // Get the current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    // Redirect to login if not authenticated
    return redirect(`/login?redirect=/marketplace/${params.id}/purchase`)
  }

  // Get the user's profile
  const { data: profile, error: profileError } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (profileError) {
    console.error("Error fetching profile:", profileError)
    return redirect("/marketplace")
  }

  // Check if user is a buyer
  if (profile.user_type !== "buyer") {
    return redirect(`/marketplace/${params.id}?error=not-buyer`)
  }

  // Fetch the listing with farmer profile
  const { data: listing, error: listingError } = await supabase
    .from("grain_listings")
    .select(`
      *,
      profiles:farmer_id (
        id,
        full_name,
        company_name
      )
    `)
    .eq("id", params.id)
    .single()

  if (listingError || !listing) {
    console.error("Error fetching listing:", listingError)
    return redirect("/marketplace")
  }

  // If the user is the farmer of this listing, redirect to the listing page
  if (user.id === listing.farmer_id) {
    return redirect(`/marketplace/${params.id}?error=own-listing`)
  }

  // Get farmer display name
  const farmerName = listing.profiles.company_name || listing.profiles.full_name || "Farmer"

  // Calculate minimum order quantity
  const minQuantity = listing.minimum_order || 1

  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <main className="flex-1 container py-10">
        <div className="max-w-3xl mx-auto">
          <Link href={`/marketplace/${params.id}`} className="text-green-600 hover:underline mb-6 inline-block">
            &larr; Back to listing
          </Link>

          <Card>
            <CardHeader>
              <CardTitle>Purchase Order</CardTitle>
              <CardDescription>
                Complete your purchase order for: {listing.title} from {farmerName}
              </CardDescription>
            </CardHeader>
            <form action="/api/orders/create" method="post">
              <CardContent className="space-y-6">
                <input type="hidden" name="listing_id" value={params.id} />
                <input type="hidden" name="farmer_id" value={listing.farmer_id} />
                <input type="hidden" name="unit_price" value={listing.price} />

                <div className="grid gap-4 border-b pb-6">
                  <h3 className="text-lg font-medium">Order Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="quantity" className="text-sm font-medium">
                        Quantity ({listing.quantity_unit}s)
                      </label>
                      <Input
                        id="quantity"
                        name="quantity"
                        type="number"
                        min={minQuantity}
                        max={listing.quantity}
                        defaultValue={minQuantity}
                        required
                      />
                      <p className="text-xs text-gray-500">
                        Available: {listing.quantity} {listing.quantity_unit}
                        {listing.quantity !== 1 && "s"}
                        {listing.minimum_order && ` (Minimum order: ${listing.minimum_order})`}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="price" className="text-sm font-medium">
                        Price per {listing.quantity_unit}
                      </label>
                      <Input id="price" value={formatCurrency(listing.price)} disabled className="bg-gray-50" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="notes" className="text-sm font-medium">
                      Order Notes (Optional)
                    </label>
                    <Textarea
                      id="notes"
                      name="notes"
                      rows={3}
                      placeholder="Add any special instructions or notes for the farmer"
                    />
                  </div>
                </div>

                <div className="grid gap-4 border-b pb-6">
                  <h3 className="text-lg font-medium">Shipping Information</h3>
                  <div className="space-y-2">
                    <label htmlFor="shipping_address" className="text-sm font-medium">
                      Street Address
                    </label>
                    <Input
                      id="shipping_address"
                      name="shipping_address"
                      defaultValue={profile.address || ""}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="shipping_city" className="text-sm font-medium">
                        City
                      </label>
                      <Input id="shipping_city" name="shipping_city" defaultValue={profile.city || ""} required />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="shipping_state" className="text-sm font-medium">
                        State
                      </label>
                      <Input id="shipping_state" name="shipping_state" defaultValue={profile.state || ""} required />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="shipping_zip" className="text-sm font-medium">
                        ZIP Code
                      </label>
                      <Input id="shipping_zip" name="shipping_zip" defaultValue={profile.zip_code || ""} required />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="shipping_notes" className="text-sm font-medium">
                      Delivery Instructions (Optional)
                    </label>
                    <Textarea
                      id="shipping_notes"
                      name="shipping_notes"
                      rows={2}
                      placeholder="Add any special delivery instructions"
                    />
                  </div>
                </div>

                <div className="grid gap-4">
                  <h3 className="text-lg font-medium">Payment Method</h3>
                  <div className="space-y-2">
                    <label htmlFor="payment_method" className="text-sm font-medium">
                      Select Payment Method
                    </label>
                    <Select name="payment_method" defaultValue="bank_transfer">
                      <SelectTrigger id="payment_method">
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                        <SelectItem value="credit_card">Credit Card</SelectItem>
                        <SelectItem value="cash_on_delivery">Cash on Delivery</SelectItem>
                        <SelectItem value="check">Check</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-500">
                      Payment details will be arranged with the farmer after order confirmation.
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <div className="w-full border-t pt-4">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total (Estimated):</span>
                    <span>
                      ${listing.price.toFixed(2)} per {listing.quantity_unit} × quantity
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Final total will be calculated based on the quantity you enter. Shipping costs may be added by the
                    farmer.
                  </p>
                </div>
                <div className="flex justify-end space-x-4 w-full">
                  <Button variant="outline" type="button" asChild>
                    <Link href={`/marketplace/${params.id}`}>Cancel</Link>
                  </Button>
                  <Button type="submit" className="bg-green-600 hover:bg-green-700">
                    Place Order
                  </Button>
                </div>
              </CardFooter>
            </form>
          </Card>
        </div>
      </main>
      <footer className="border-t bg-gray-50">
        <div className="container py-6 px-4 md:px-6">
          <div className="text-sm text-gray-500 text-center">
            © {new Date().getFullYear()} Farm Fresh Market. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
