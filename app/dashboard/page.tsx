import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { GrapeIcon as Grain, Plus, BarChart3, ShoppingCart, MessageSquare, Settings, LogOut } from "lucide-react"

export default function Dashboard() {
  const listings = [
    {
      id: 1,
      name: "Organic Wheat",
      price: 8.5,
      quantity: "500 bushels",
      status: "active",
      views: 42,
      inquiries: 5,
    },
    {
      id: 2,
      name: "Premium Barley",
      price: 9.75,
      quantity: "300 bushels",
      status: "active",
      views: 28,
      inquiries: 3,
    },
    {
      id: 3,
      name: "Non-GMO Corn",
      price: 7.25,
      quantity: "750 bushels",
      status: "pending",
      views: 0,
      inquiries: 0,
    },
  ]

  const messages = [
    {
      id: 1,
      from: "John Buyer",
      subject: "Interested in your Organic Wheat",
      preview: "Hello, I'm interested in purchasing 50 bushels of your organic wheat...",
      time: "2 hours ago",
      unread: true,
    },
    {
      id: 2,
      from: "Sarah Miller",
      subject: "Question about delivery options",
      preview: "Hi there, I was wondering if you offer delivery services for your grains...",
      time: "Yesterday",
      unread: false,
    },
    {
      id: 3,
      from: "Midwest Mills",
      subject: "Bulk purchase inquiry",
      preview: "Our mill is looking to establish a regular supply of high-quality wheat...",
      time: "3 days ago",
      unread: false,
    },
  ]

  return (
    <div className="flex min-h-screen">
      <aside className="hidden md:flex w-64 flex-col border-r bg-gray-50">
        <div className="flex h-14 items-center border-b px-4">
          <Link href="/" className="flex items-center gap-2">
            <Grain className="w-6 h-6 text-green-600" />
            <span className="text-xl font-bold">Farm Fresh</span>
          </Link>
        </div>
        <nav className="flex-1 overflow-auto py-4">
          <div className="px-4 mb-4">
            <h2 className="mb-2 text-xs font-semibold text-gray-500">Dashboard</h2>
            <div className="grid gap-1">
              <Link
                href="/dashboard"
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium bg-green-50 text-green-600"
              >
                <BarChart3 className="h-4 w-4" />
                Overview
              </Link>
              <Link
                href="/dashboard/listings"
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                <Grain className="h-4 w-4" />
                My Listings
              </Link>
              <Link
                href="/dashboard/messages"
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                <MessageSquare className="h-4 w-4" />
                Messages
                <Badge className="ml-auto bg-green-600">3</Badge>
              </Link>
              <Link
                href="/dashboard/orders"
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                <ShoppingCart className="h-4 w-4" />
                Orders
              </Link>
            </div>
          </div>
          <div className="px-4">
            <h2 className="mb-2 text-xs font-semibold text-gray-500">Settings</h2>
            <div className="grid gap-1">
              <Link
                href="/dashboard/profile"
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                <Settings className="h-4 w-4" />
                Account Settings
              </Link>
              <Link
                href="/logout"
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Link>
            </div>
          </div>
        </nav>
      </aside>
      <div className="flex flex-col flex-1">
        <header className="flex h-14 items-center gap-4 border-b bg-white px-4 md:px-6">
          <Button variant="outline" size="icon" className="md:hidden">
            <span className="sr-only">Toggle menu</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
            >
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </svg>
          </Button>
          <div className="ml-auto flex items-center gap-4">
            <Button variant="outline" size="sm">
              <MessageSquare className="mr-2 h-4 w-4" />
              Messages
              <Badge className="ml-2 bg-green-600">3</Badge>
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-green-600 font-bold text-sm">JF</span>
              </div>
              <div className="hidden md:block">
                <div className="text-sm font-medium">Johnson Farm</div>
                <div className="text-xs text-gray-500">Farmer</div>
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <div className="grid gap-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold">Welcome back, Johnson Farm</h1>
                <p className="text-gray-500">Manage your grain listings and connect with buyers</p>
              </div>
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="mr-2 h-4 w-4" />
                Add New Listing
              </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Listings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">3</div>
                  <p className="text-xs text-gray-500">2 active, 1 pending</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">70</div>
                  <p className="text-xs text-gray-500">↑ 12% from last week</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Inquiries</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">8</div>
                  <p className="text-xs text-gray-500">3 new since yesterday</p>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="listings">
              <TabsList className="grid w-full grid-cols-2 md:w-auto">
                <TabsTrigger value="listings">My Listings</TabsTrigger>
                <TabsTrigger value="messages">Recent Messages</TabsTrigger>
              </TabsList>
              <TabsContent value="listings" className="border rounded-md p-4 mt-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">Your Grain Listings</h2>
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </div>
                <div className="grid gap-4">
                  {listings.map((listing) => (
                    <Card key={listing.id}>
                      <CardContent className="p-4">
                        <div className="grid md:grid-cols-6 gap-4 items-center">
                          <div className="md:col-span-2 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-md bg-gray-100 flex items-center justify-center">
                              <Grain className="h-5 w-5 text-gray-600" />
                            </div>
                            <div>
                              <div className="font-medium">{listing.name}</div>
                              <div className="text-sm text-gray-500">${listing.price.toFixed(2)}/bushel</div>
                            </div>
                          </div>
                          <div className="text-sm">
                            <div className="font-medium">Quantity</div>
                            <div className="text-gray-500">{listing.quantity}</div>
                          </div>
                          <div className="text-sm">
                            <div className="font-medium">Views</div>
                            <div className="text-gray-500">{listing.views}</div>
                          </div>
                          <div className="text-sm">
                            <div className="font-medium">Inquiries</div>
                            <div className="text-gray-500">{listing.inquiries}</div>
                          </div>
                          <div className="flex justify-end">
                            <Badge className={listing.status === "active" ? "bg-green-600" : "bg-yellow-600"}>
                              {listing.status === "active" ? "Active" : "Pending"}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="messages" className="border rounded-md p-4 mt-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">Recent Messages</h2>
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </div>
                <div className="grid gap-4">
                  {messages.map((message) => (
                    <Card key={message.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                            <span className="font-medium text-sm">{message.from.charAt(0)}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <div className="font-medium truncate">{message.from}</div>
                              {message.unread && <Badge className="bg-green-600">New</Badge>}
                              <div className="ml-auto text-xs text-gray-500">{message.time}</div>
                            </div>
                            <div className="font-medium text-sm">{message.subject}</div>
                            <div className="text-sm text-gray-500 truncate">{message.preview}</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Market Trends</CardTitle>
                  <CardDescription>Average grain prices in your region</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px] flex items-center justify-center bg-gray-100 rounded-md">
                    <p className="text-gray-500">Price trend chart would appear here</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Events</CardTitle>
                  <CardDescription>Agricultural events in your area</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-md bg-green-100 flex items-center justify-center text-green-600 font-bold">
                        15
                      </div>
                      <div>
                        <h3 className="font-medium">Midwest Grain Expo</h3>
                        <p className="text-sm text-gray-500">Des Moines Convention Center</p>
                        <p className="text-xs text-gray-500">May 15-17, 2025</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-md bg-green-100 flex items-center justify-center text-green-600 font-bold">
                        22
                      </div>
                      <div>
                        <h3 className="font-medium">Sustainable Farming Workshop</h3>
                        <p className="text-sm text-gray-500">County Agricultural Center</p>
                        <p className="text-xs text-gray-500">May 22, 2025</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-md bg-green-100 flex items-center justify-center text-green-600 font-bold">
                        30
                      </div>
                      <div>
                        <h3 className="font-medium">Farm Tech Innovation Summit</h3>
                        <p className="text-sm text-gray-500">State University Extension</p>
                        <p className="text-xs text-gray-500">May 30-31, 2025</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
