import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { SiteHeader } from "@/components/layout/site-header"

export default async function ProfilePage() {
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
  }

  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <main className="flex-1 container py-10">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Your Profile</h1>

          <form action="/api/profile" method="post">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  Update your personal information and how others see you on the platform
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="full_name">Full Name</Label>
                      <Input id="full_name" name="full_name" defaultValue={profile?.full_name || ""} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company_name">Company/Farm Name</Label>
                      <Input id="company_name" name="company_name" defaultValue={profile?.company_name || ""} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={user.email || ""} disabled />
                    <p className="text-sm text-gray-500">Your email cannot be changed</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" name="phone" defaultValue={profile?.phone || ""} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      name="bio"
                      rows={4}
                      defaultValue={profile?.bio || ""}
                      placeholder="Tell others about yourself or your farm"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      name="website"
                      defaultValue={profile?.website || ""}
                      placeholder="https://yourwebsite.com"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Address Information</h3>
                  <div className="space-y-2">
                    <Label htmlFor="address">Street Address</Label>
                    <Input id="address" name="address" defaultValue={profile?.address || ""} />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input id="city" name="city" defaultValue={profile?.city || ""} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State</Label>
                      <Input id="state" name="state" defaultValue={profile?.state || ""} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zip_code">ZIP Code</Label>
                      <Input id="zip_code" name="zip_code" defaultValue={profile?.zip_code || ""} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input id="country" name="country" defaultValue={profile?.country || "United States"} />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end space-x-4">
                <Button variant="outline">Cancel</Button>
                <Button type="submit" className="bg-green-600 hover:bg-green-700">
                  Save Changes
                </Button>
              </CardFooter>
            </Card>
          </form>
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
