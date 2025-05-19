import { redirect } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/utils/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { SiteHeader } from "@/components/layout/site-header"

export default async function ContactFarmerPage({ params }: { params: { id: string } }) {
  const supabase = createClient()

  // Get the current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    // Redirect to login if not authenticated
    return redirect(`/login?redirect=/marketplace/${params.id}/contact`)
  }

  // Get the user's profile
  const { data: profile, error: profileError } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (profileError) {
    console.error("Error fetching profile:", profileError)
    return redirect("/marketplace")
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

  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <main className="flex-1 container py-10">
        <div className="max-w-2xl mx-auto">
          <Link href={`/marketplace/${params.id}`} className="text-green-600 hover:underline mb-6 inline-block">
            &larr; Back to listing
          </Link>

          <Card>
            <CardHeader>
              <CardTitle>Contact {farmerName}</CardTitle>
              <CardDescription>Send a message to the farmer about their listing: {listing.title}</CardDescription>
            </CardHeader>
            <form action="/api/messages/create" method="post">
              <CardContent className="space-y-4">
                <input type="hidden" name="listing_id" value={params.id} />
                <input type="hidden" name="farmer_id" value={listing.farmer_id} />

                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-medium">
                    Subject
                  </label>
                  <Input id="subject" name="subject" defaultValue={`Inquiry about: ${listing.title}`} required />
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">
                    Message
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    rows={6}
                    placeholder={`Hello ${farmerName},\n\nI'm interested in your ${listing.title} listing. Could you please provide more information about...`}
                    required
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end space-x-4">
                <Button variant="outline" type="button" asChild>
                  <Link href={`/marketplace/${params.id}`}>Cancel</Link>
                </Button>
                <Button type="submit" className="bg-green-600 hover:bg-green-700">
                  Send Message
                </Button>
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
