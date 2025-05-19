import { redirect } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/utils/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { SiteHeader } from "@/components/layout/site-header"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { formatCurrency, formatDate } from "@/lib/format"
import { CheckCircle2 } from "lucide-react"

export default async function OrderConfirmationPage({ params }: { params: { id: string } }) {
  const supabase = createClient()

  // Get the current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    redirect(`/login?redirect=/dashboard/orders/${params.id}/confirmation`)
  }

  // Get the order with related data
  const { data: order, error: orderError } = await supabase
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
        grain_type,
        farming_method,
        quantity_unit
      )
    `)
    .eq("id", params.id)
    .single()

  if (orderError || !order) {
    console.error("Error fetching order:", orderError)
    redirect("/dashboard/orders")
  }

  // Check if the user is part of this order
  if (order.buyer_id !== user.id && order.farmer_id !== user.id) {
    redirect("/dashboard/orders")
  }

  // Get buyer and farmer names
  const buyerName = order.buyer.company_name || order.buyer.full_name || "Buyer"
  const farmerName = order.farmer.company_name || order.farmer.full_name || "Farmer"

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />
      <div className="flex flex-col flex-1">
        <SiteHeader />
        <main className="flex-1 container py-10">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold">Order Placed Successfully!</h1>
              <p className="text-gray-500 mt-2">Your order has been received and is awaiting confirmation.</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
                <CardDescription>Order #{params.id.substring(0, 8)}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 border-b pb-4">
                  <h3 className="text-lg font-medium">Product Details</h3>
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div>
                      <p className="font-medium">{order.listing.title}</p>
                      <p className="text-sm text-gray-500 capitalize">
                        {order.listing.grain_type.replace("_", " ")} • {order.listing.farming_method.replace("_", " ")}
                      </p>
                      <p className="text-sm text-gray-500">Seller: {farmerName}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        {order.quantity} {order.listing.quantity_unit}
                        {order.quantity !== 1 && "s"}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatCurrency(order.unit_price)} per {order.listing.quantity_unit}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 border-b pb-4">
                  <h3 className="text-lg font-medium">Shipping Information</h3>
                  <div>
                    <p>{order.shipping_address}</p>
                    <p>
                      {order.shipping_city}, {order.shipping_state} {order.shipping_zip}
                    </p>
                    {order.shipping_notes && (
                      <div className="mt-2">
                        <p className="text-sm font-medium">Delivery Instructions:</p>
                        <p className="text-sm text-gray-500">{order.shipping_notes}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid gap-4 border-b pb-4">
                  <h3 className="text-lg font-medium">Payment Information</h3>
                  <div>
                    <p className="font-medium capitalize">Method: {order.payment_method.replace("_", " ")}</p>
                    <p className="text-sm text-gray-500">
                      Status: <span className="capitalize">{order.payment_status}</span>
                    </p>
                    <p className="text-sm text-gray-500 mt-2">The seller will contact you with payment instructions.</p>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <span className="font-medium">Order Total:</span>
                  <span className="text-xl font-bold">{formatCurrency(order.total_price)}</span>
                </div>

                <div className="bg-gray-50 p-4 rounded-md mt-4">
                  <p className="text-sm">
                    <span className="font-medium">Order Date:</span> {formatDate(order.created_at)}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Order Status:</span>{" "}
                    <span className="capitalize">{order.status}</span>
                  </p>
                  {order.notes && (
                    <div className="mt-2">
                      <p className="text-sm font-medium">Order Notes:</p>
                      <p className="text-sm text-gray-500">{order.notes}</p>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" asChild>
                  <Link href="/dashboard/orders">View All Orders</Link>
                </Button>
                <Button className="bg-green-600 hover:bg-green-700" asChild>
                  <Link href={`/dashboard/orders/${params.id}`}>Order Details</Link>
                </Button>
              </CardFooter>
            </Card>

            <div className="mt-8 text-center">
              <p className="text-gray-500 mb-4">Have questions about your order? Contact the seller directly.</p>
              <Button variant="outline" asChild>
                <Link href="/dashboard/messages">Go to Messages</Link>
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
