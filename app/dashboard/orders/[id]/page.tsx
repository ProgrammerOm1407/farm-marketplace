import { redirect, notFound } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/utils/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SiteHeader } from "@/components/layout/site-header"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { formatCurrency, formatDate } from "@/lib/format"
import { ArrowLeft, Package, Truck, CreditCard, Clock, CheckCircle2, XCircle } from "lucide-react"
import { OrderStatusUpdate } from "@/components/orders/order-status-update"
import { PaymentForm } from "@/components/orders/payment-form"
import { OrderActions } from "@/components/orders/order-actions"

export default async function OrderDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient()

  // Get the current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    redirect(`/login?redirect=/dashboard/orders/${params.id}`)
  }

  // Get the order with related data
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select(`
      *,
      buyer:buyer_id (
        id,
        full_name,
        company_name,
        phone,
        email:id
      ),
      farmer:farmer_id (
        id,
        full_name,
        company_name,
        phone,
        email:id
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
    notFound()
  }

  // Check if the user is part of this order
  if (order.buyer_id !== user.id && order.farmer_id !== user.id) {
    redirect("/dashboard/orders")
  }

  // Get order history
  const { data: orderHistory, error: historyError } = await supabase
    .from("order_history")
    .select(`
      *,
      user:created_by (
        id,
        full_name,
        company_name
      )
    `)
    .eq("order_id", params.id)
    .order("created_at", { ascending: true })

  if (historyError) {
    console.error("Error fetching order history:", historyError)
  }

  // Get transactions
  const { data: transactions, error: transactionsError } = await supabase
    .from("transactions")
    .select("*")
    .eq("order_id", params.id)
    .order("created_at", { ascending: false })

  if (transactionsError) {
    console.error("Error fetching transactions:", transactionsError)
  }

  // Determine if the user is the buyer or farmer
  const isBuyer = order.buyer_id === user.id
  const otherParty = isBuyer ? order.farmer : order.buyer
  const otherPartyName = otherParty?.company_name || otherParty?.full_name || "User"

  // Calculate total paid amount
  const totalPaid =
    transactions?.reduce((sum, transaction) => {
      return transaction.status === "paid" ? sum + Number(transaction.amount) : sum
    }, 0) || 0

  // Calculate remaining balance
  const remainingBalance = Number(order.total_price) - totalPaid

  // Check if the order has been reviewed
  const { data: existingReview, error: reviewCheckError } = await supabase
    .from("reviews")
    .select("id")
    .eq("order_id", params.id)
    .eq("buyer_id", user.id)
    .maybeSingle()

  const hasReviewed = !!existingReview

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />
      <div className="flex flex-col flex-1">
        <SiteHeader />
        <main className="flex-1 container py-10">
          <div className="mb-6">
            <Link href="/dashboard/orders" className="inline-flex items-center text-green-600 hover:underline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Orders
            </Link>
          </div>

          <div className="flex flex-col md:flex-row items-start justify-between gap-6 mb-8">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-bold">Order #{params.id.substring(0, 8)}</h1>
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
                                : order.status === "completed"
                                  ? "bg-green-600"
                                  : "bg-red-600"
                  }
                >
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </Badge>
              </div>
              <p className="text-gray-500 mt-1">
                Placed on {formatDate(order.created_at)} • {isBuyer ? "Seller" : "Buyer"}: {otherPartyName}
              </p>
            </div>

            {!isBuyer && order.status !== "cancelled" && order.status !== "completed" && (
              <OrderStatusUpdate orderId={params.id} currentStatus={order.status} />
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Order Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 border-b pb-4">
                    <h3 className="text-lg font-medium">Product Information</h3>
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 rounded-md bg-gray-100 flex items-center justify-center shrink-0">
                        <Package className="h-8 w-8 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                          <div>
                            <p className="font-medium">{order.listing.title}</p>
                            <p className="text-sm text-gray-500 capitalize">
                              {order.listing.grain_type?.replace("_", " ")} •{" "}
                              {order.listing.farming_method?.replace("_", " ")}
                            </p>
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
                        <div className="mt-4 pt-4 border-t flex justify-between">
                          <span className="font-medium">Total:</span>
                          <span className="font-bold">{formatCurrency(order.total_price)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 border-b pb-4">
                    <h3 className="text-lg font-medium">Shipping Information</h3>
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                        <Truck className="h-5 w-5 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-medium">{order.buyer.full_name || order.buyer.company_name}</p>
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
                        {order.delivery_date && (
                          <p className="mt-2 text-sm">
                            <span className="font-medium">Estimated Delivery:</span> {formatDate(order.delivery_date)}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4">
                    <h3 className="text-lg font-medium">Payment Information</h3>
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                        <CreditCard className="h-5 w-5 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-medium capitalize">Method: {order.payment_method?.replace("_", " ")}</p>
                        <p className="text-sm">
                          <span className="font-medium">Status:</span>{" "}
                          <Badge
                            variant="outline"
                            className={
                              order.payment_status === "paid"
                                ? "text-green-600 border-green-600"
                                : order.payment_status === "partially_paid"
                                  ? "text-blue-600 border-blue-600"
                                  : "text-yellow-600 border-yellow-600"
                            }
                          >
                            {order.payment_status?.replace("_", " ")}
                          </Badge>
                        </p>
                        <div className="mt-2 space-y-1">
                          <div className="flex justify-between">
                            <span>Total Amount:</span>
                            <span>{formatCurrency(order.total_price)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Amount Paid:</span>
                            <span>{formatCurrency(totalPaid)}</span>
                          </div>
                          <div className="flex justify-between font-medium">
                            <span>Remaining Balance:</span>
                            <span>{formatCurrency(remainingBalance)}</span>
                          </div>
                        </div>
                        {isBuyer && remainingBalance > 0 && order.status !== "cancelled" && (
                          <div className="mt-4">
                            <PaymentForm orderId={params.id} remainingBalance={remainingBalance} />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Tabs defaultValue="history">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="history">Order History</TabsTrigger>
                  <TabsTrigger value="transactions">Transactions</TabsTrigger>
                </TabsList>
                <TabsContent value="history" className="mt-4">
                  <Card>
                    <CardContent className="p-6">
                      <div className="space-y-6">
                        {orderHistory && orderHistory.length > 0 ? (
                          <div className="relative">
                            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />
                            <ul className="space-y-6">
                              {orderHistory.map((history, index) => {
                                const userName = history.user?.company_name || history.user?.full_name || "Unknown User"
                                const isFirst = index === 0
                                const isLast = index === orderHistory.length - 1

                                return (
                                  <li key={history.id} className="relative pl-10">
                                    <div
                                      className={`absolute left-0 top-2 w-8 h-8 rounded-full flex items-center justify-center ${
                                        isFirst
                                          ? "bg-green-100"
                                          : isLast && history.status === "completed"
                                            ? "bg-green-100"
                                            : isLast && history.status === "cancelled"
                                              ? "bg-red-100"
                                              : "bg-blue-100"
                                      }`}
                                    >
                                      {isFirst ? (
                                        <Clock className={`h-4 w-4 ${isFirst ? "text-green-600" : "text-blue-600"}`} />
                                      ) : isLast && history.status === "completed" ? (
                                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                                      ) : isLast && history.status === "cancelled" ? (
                                        <XCircle className="h-4 w-4 text-red-600" />
                                      ) : (
                                        <Clock className="h-4 w-4 text-blue-600" />
                                      )}
                                    </div>
                                    <div>
                                      <p className="font-medium">
                                        Status changed to{" "}
                                        <span className="capitalize">{history.status.replace("_", " ")}</span>
                                      </p>
                                      {history.payment_status && (
                                        <p className="text-sm text-gray-500">
                                          Payment status:{" "}
                                          <span className="capitalize">{history.payment_status.replace("_", " ")}</span>
                                        </p>
                                      )}
                                      <p className="text-sm text-gray-500">
                                        By {userName} • {formatDate(history.created_at)}
                                      </p>
                                      {history.notes && <p className="text-sm text-gray-500 mt-1">{history.notes}</p>}
                                    </div>
                                  </li>
                                )
                              })}
                            </ul>
                          </div>
                        ) : (
                          <p className="text-center text-gray-500 py-4">No order history available</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="transactions" className="mt-4">
                  <Card>
                    <CardContent className="p-6">
                      {transactions && transactions.length > 0 ? (
                        <div className="space-y-4">
                          {transactions.map((transaction) => (
                            <div key={transaction.id} className="border-b pb-4 last:border-0 last:pb-0">
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="font-medium">Payment - {formatCurrency(transaction.amount)}</p>
                                  <p className="text-sm text-gray-500 capitalize">
                                    Method: {transaction.payment_method.replace("_", " ")}
                                  </p>
                                  <p className="text-sm text-gray-500">Date: {formatDate(transaction.created_at)}</p>
                                  {transaction.transaction_reference && (
                                    <p className="text-sm text-gray-500">
                                      Reference: {transaction.transaction_reference}
                                    </p>
                                  )}
                                  {transaction.notes && (
                                    <p className="text-sm text-gray-500 mt-1">{transaction.notes}</p>
                                  )}
                                </div>
                                <Badge
                                  className={
                                    transaction.status === "paid"
                                      ? "bg-green-600"
                                      : transaction.status === "pending"
                                        ? "bg-yellow-600"
                                        : transaction.status === "failed"
                                          ? "bg-red-600"
                                          : "bg-blue-600"
                                  }
                                >
                                  {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-center text-gray-500 py-4">No transactions recorded yet</p>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-medium">{isBuyer ? "Seller" : "Buyer"}</h3>
                    <p>{otherPartyName}</p>
                    <p className="text-sm text-gray-500">{otherParty.phone || "No phone provided"}</p>
                    <Button variant="outline" size="sm" className="mt-2" asChild>
                      <Link href="/dashboard/messages">Send Message</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>{formatCurrency(order.total_price)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping:</span>
                    <span>Calculated by seller</span>
                  </div>
                  <div className="flex justify-between font-bold border-t pt-2">
                    <span>Total:</span>
                    <span>{formatCurrency(order.total_price)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Payment Status:</span>
                    <span className="capitalize">{order.payment_status.replace("_", " ")}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Order Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <OrderActions orderId={params.id} status={order.status} hasReviewed={hasReviewed} isBuyer={isBuyer} />
                </CardContent>
              </Card>

              {order.notes && (
                <Card>
                  <CardHeader>
                    <CardTitle>Order Notes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">{order.notes}</p>
                  </CardContent>
                </Card>
              )}

              {isBuyer && order.status === "pending" && (
                <Card>
                  <CardContent className="p-6">
                    <form action={`/api/orders/cancel?id=${params.id}`} method="post">
                      <Button variant="destructive" className="w-full" type="submit">
                        Cancel Order
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
