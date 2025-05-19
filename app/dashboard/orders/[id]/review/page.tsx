import { redirect, notFound } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/utils/supabase/server"
import { SiteHeader } from "@/components/layout/site-header"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { ReviewForm } from "@/components/reviews/review-form"
import { ArrowLeft } from "lucide-react"

export default async function OrderReviewPage({ params }: { params: { id: string } }) {
  const supabase = createClient()

  // Get the current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    redirect(`/login?redirect=/dashboard/orders/${params.id}/review`)
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
        title
      )
    `)
    .eq("id", params.id)
    .single()

  if (orderError || !order) {
    console.error("Error fetching order:", orderError)
    notFound()
  }

  // Check if the user is the buyer of this order
  if (order.buyer_id !== user.id) {
    redirect("/dashboard/orders")
  }

  // Check if the order is completed
  if (order.status !== "completed") {
    redirect(`/dashboard/orders/${params.id}?error=not-completed`)
  }

  // Check if the user has already reviewed this order
  const { data: existingReview, error: reviewCheckError } = await supabase
    .from("reviews")
    .select("id")
    .eq("order_id", params.id)
    .eq("buyer_id", user.id)
    .maybeSingle()

  if (existingReview) {
    redirect(`/dashboard/orders/${params.id}?error=already-reviewed`)
  }

  // Get farmer display name
  const farmerName = order.farmer.company_name || order.farmer.full_name || "Farmer"

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />
      <div className="flex flex-col flex-1">
        <SiteHeader />
        <main className="flex-1 container py-10">
          <div className="mb-6">
            <Link
              href={`/dashboard/orders/${params.id}`}
              className="inline-flex items-center text-green-600 hover:underline"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Order
            </Link>
          </div>

          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Review Your Purchase</h1>
            <ReviewForm
              orderId={params.id}
              farmerId={order.farmer_id}
              listingId={order.listing_id}
              listingTitle={order.listing.title}
              farmerName={farmerName}
            />
          </div>
        </main>
      </div>
    </div>
  )
}
