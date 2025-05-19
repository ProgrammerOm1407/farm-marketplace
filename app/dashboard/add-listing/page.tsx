"use client"

import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { SiteHeader } from "@/components/layout/site-header"
import { DashboardSidebar } from "@/components/dashboard/sidebar"

export default async function AddListingPage() {
  const supabase = createClient()

  // Get the current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    redirect("/login")
  }

  // Get the user's profile to check if they're a farmer
  const { data: profile, error: profileError } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (profileError) {
    console.error("Error fetching profile:", profileError)
    redirect("/dashboard")
  }

  // Redirect if not a farmer
  if (profile.user_type !== "farmer") {
    redirect("/dashboard?error=not-farmer")
  }

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />
      <div className="flex flex-col flex-1">
        <SiteHeader />
        <main className="flex-1 container py-10">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Add New Grain Listing</h1>

            <form action="/api/listings/create" method="post">
              <Card>
                <CardHeader>
                  <CardTitle>Listing Details</CardTitle>
                  <CardDescription>
                    Provide information about the grain you want to sell on the marketplace
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Listing Title</Label>
                      <Input id="title" name="title" placeholder="e.g., Premium Organic Wheat" required />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="grain_type">Grain Type</Label>
                        <Select name="grain_type" required>
                          <SelectTrigger id="grain_type">
                            <SelectValue placeholder="Select grain type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="wheat">Wheat</SelectItem>
                            <SelectItem value="corn">Corn</SelectItem>
                            <SelectItem value="barley">Barley</SelectItem>
                            <SelectItem value="oats">Oats</SelectItem>
                            <SelectItem value="rye">Rye</SelectItem>
                            <SelectItem value="rice">Rice</SelectItem>
                            <SelectItem value="quinoa">Quinoa</SelectItem>
                            <SelectItem value="millet">Millet</SelectItem>
                            <SelectItem value="sorghum">Sorghum</SelectItem>
                            <SelectItem value="buckwheat">Buckwheat</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="farming_method">Farming Method</Label>
                        <Select name="farming_method" required>
                          <SelectTrigger id="farming_method">
                            <SelectValue placeholder="Select farming method" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="organic">Organic</SelectItem>
                            <SelectItem value="conventional">Conventional</SelectItem>
                            <SelectItem value="non_gmo">Non-GMO</SelectItem>
                            <SelectItem value="sustainable">Sustainable</SelectItem>
                            <SelectItem value="regenerative">Regenerative</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="price">Price (per unit)</Label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
                          <Input
                            id="price"
                            name="price"
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="0.00"
                            className="pl-7"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="quantity">Quantity</Label>
                        <Input id="quantity" name="quantity" type="number" min="1" placeholder="500" required />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="quantity_unit">Unit</Label>
                        <Select name="quantity_unit" defaultValue="bushel">
                          <SelectTrigger id="quantity_unit">
                            <SelectValue placeholder="Select unit" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="bushel">Bushel</SelectItem>
                            <SelectItem value="ton">Ton</SelectItem>
                            <SelectItem value="pound">Pound</SelectItem>
                            <SelectItem value="kilogram">Kilogram</SelectItem>
                            <SelectItem value="metric_ton">Metric Ton</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="harvest_date">Harvest Date</Label>
                        <Input id="harvest_date" name="harvest_date" type="date" />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="minimum_order">Minimum Order</Label>
                        <Input id="minimum_order" name="minimum_order" type="number" min="1" placeholder="10" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        name="description"
                        rows={4}
                        placeholder="Describe your grain product, including quality, specifications, and any other relevant details."
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Location Information</h3>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location/Farm Name</Label>
                      <Input id="location" name="location" placeholder="e.g., Johnson Family Farm" required />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input id="city" name="city" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">State</Label>
                        <Input id="state" name="state" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="country">Country</Label>
                        <Input id="country" name="country" defaultValue="United States" />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox id="featured" name="featured" value="true" />
                    <Label htmlFor="featured" className="text-sm">
                      Request featured placement (subject to approval)
                    </Label>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end space-x-4">
                  <Button variant="outline" type="button" onClick={() => history.back()}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-green-600 hover:bg-green-700">
                    Create Listing
                  </Button>
                </CardFooter>
              </Card>
            </form>
          </div>
        </main>
      </div>
    </div>
  )
}
