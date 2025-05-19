import { redirect } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/utils/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SiteHeader } from "@/components/layout/site-header"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { formatCurrency, formatDate } from "@/lib/format"
import { ShoppingCart, Package } from "lucide-react"

export default async function OrdersPage() {
  const supabase = createClient()

  // Get the current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    redirect("/login?redirect=/dashboard/orders")
  }

  // Get the user's profile
  const { data: profile, error: profileError } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (profileError) {
    console.error("Error fetching profile:", profileError)
    redirect("/dashboard")
  }

  // Get the user's orders
  const { data: orders, error: ordersError } = await supabase
    .from("orders")
    .select(`
      *,
      buyer:buyer_id (
        id,
        full_name,
        company_name
      ),
      farmer:farmer_id (
        id,
        full_name,
        company_name
      ),
      listing:listing_id (
        id,
        title,
        quantity_unit
      )
    `)
    .or(`buyer_id.eq.${user.id},farmer_id.eq.${user.id}`)
    .order("created_at", { ascending: false })

  if (ordersError) {
    console.error("Error fetching orders:", ordersError)
  }

  // Separate orders by status
  const activeOrders = orders?.filter((order) => !["completed", "cancelled"].includes(order.status)) || []
  const completedOrders = orders?.filter((order) => ["completed", "cancelled"].includes(order.status)) || []

  // Determine if the user is a buyer or farmer
  const isBuyer = profile.user_type === "buyer"

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />
      <div className="flex flex-col flex-1">
        <SiteHeader />
        <main className="flex-1 container py-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold">Orders</h1>
              <p className="text-gray-500">
                {isBuyer ? "Manage your purchase orders" : "Manage orders for your grain listings"}
              </p>
            </div>
            {isBuyer && (
              <Link href="/marketplace">
                <Button className="bg-green-600 hover:bg-green-700">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Browse Marketplace
                </Button>
              </Link>
            )}
          </div>

          <Tabs defaultValue="active">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="active">Active Orders ({activeOrders.length})</TabsTrigger>
              <TabsTrigger value="completed">Completed Orders ({completedOrders.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="active">
              {activeOrders.length > 0 ? (
                <div className="grid gap-4">
                  {activeOrders.map((order) => {
                    // Determine the other party (if buyer, show farmer; if farmer, show buyer)
                    const otherParty = isBuyer ? order.farmer : order.buyer
                    const otherPartyName = otherParty?.company_name || otherParty?.full_name || "User"

                    return (
                      <Link key={order.id} href={`/dashboard/orders/${order.id}`}>
                        <Card className="hover:shadow-md transition-shadow">
                          <CardContent className="p-6">
                            <div className="grid md:grid-cols-6 gap-4 items-center">
                              <div className="md:col-span-2">
                                <div className="flex items-center gap-3">
                                  <div className="w-12 h-12 rounded-md bg-green-100 flex items-center justify-center">
                                    <Package className="h-6 w-6 text-green-600" />
                                  </div>
                                  <div>
                                    <div className="font-medium">{order.listing.title}</div>
                                    <div className="text-sm text-gray-500">
                                      {isBuyer ? "Seller" : "Buyer"}: {otherPartyName}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="text-sm">
                                <div className="font-medium">Quantity</div>
                                <div className="text-gray-500">
                                  {order.quantity} {order.listing.quantity_unit}
                                  {order.quantity !== 1 && "s"}
                                </div>
                              </div>
                              <div className="text-sm">
                                <div className="font-medium">Total</div>
                                <div className="text-gray-500">{formatCurrency(order.total_price)}</div>
                              </div>
                              <div className="text-sm">
                                <div className="font-medium">Date</div>
                                <div className="text-gray-500">{formatDate(order.created_at)}</div>
                              </div>
                              <div className="flex items-center justify-end">
                                <Badge
                                  className={
                                    order.status === "pending"
                                      ? "bg-yellow-600"
                                      : order.status === "confirmed"
                                        ? "bg-blue-600"
                                        : order.status === "processing"
                                          ? "bg-purple-600"
                                          : order.status === "ready"
                                            ? "bg-indigo-600"
                                            : order.status === "shipped"
                                              ? "bg-orange-600"
                                              : order.status === "delivered"
                                                ? "bg-green-600"
                                                : "bg-gray-600"
                                  }
                                >
                                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                </Badge>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-12 border rounded-lg bg-gray-50">
                  <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h2 className="text-xl font-semibold mb-2">No Active Orders</h2>
                  <p className="text-gray-500 mb-6">You don't have any active orders at the moment.</p>
                  {isBuyer && (
                    <Button className="bg-green-600 hover:bg-green-700" asChild>
                      <Link href="/marketplace">Browse Marketplace</Link>
                    </Button>
                  )}
                </div>
              )}
            </TabsContent>

            <TabsContent value="completed">
              {completedOrders.length > 0 ? (
                <div className="grid gap-4">
                  {completedOrders.map((order) => {
                    // Determine the other party (if buyer, show farmer; if farmer, show buyer)
                    const otherParty = isBuyer ? order.farmer : order.buyer
                    const otherPartyName = otherParty?.company_name || otherParty?.full_name || "User"

                    return (
                      <Link key={order.id} href={`/dashboard/orders/${order.id}`}>
                        <Card className="hover:shadow-md transition-shadow">
                          <CardContent className="p-6">
                            <div className="grid md:grid-cols-6 gap-4 items-center">
                              <div className="md:col-span-2">
                                <div className="flex items-center gap-3">
                                  <div className="w-12 h-12 rounded-md bg-gray-100 flex items-center justify-center">
                                    <Package className="h-6 w-6 text-gray-600" />
                                  </div>
                                  <div>
                                    <div className="font-medium">{order.listing.title}</div>
                                    <div className="text-sm text-gray-500">
                                      {isBuyer ? "Seller" : "Buyer"}: {otherPartyName}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="text-sm">
                                <div className="font-medium">Quantity</div>
                                <div className="text-gray-500">
                                  {order.quantity} {order.listing.quantity_unit}
                                  {order.quantity !== 1 && "s"}
                                </div>
                              </div>
                              <div className="text-sm">
                                <div className="font-medium">Total</div>
                                <div className="text-gray-500">{formatCurrency(order.total_price)}</div>
                              </div>
                              <div className="text-sm">
                                <div className="font-medium">Date</div>
                                <div className="text-gray-500">{formatDate(order.created_at)}</div>
                              </div>
                              <div className="flex items-center justify-end">
                                <Badge className={order.status === "completed" ? "bg-green-600" : "bg-red-600"}>
                                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                </Badge>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-12 border rounded-lg bg-gray-50">
                  <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h2 className="text-xl font-semibold mb-2">No Completed Orders</h2>
                  <p className="text-gray-500">You don't have any completed orders yet.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
