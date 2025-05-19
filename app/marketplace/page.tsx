import { MarketplaceClient } from "./client"
import { createClient } from "@/utils/supabase/server"

export const dynamic = "force-dynamic"

// Define the FilterParams type
type FilterParams = {
  search?: string
  grainType?: string
  location?: string
  minPrice?: number
  maxPrice?: number
  farmingMethod?: string[]
  sortBy?: string
  page?: number
}

// Server-side function to get filtered listings
async function getFilteredListings(filters: FilterParams) {
  const supabase = createClient()

  // Start building the query
  let query = supabase
    .from("grain_listings")
    .select(`
      *,
      profiles:farmer_id (
        full_name,
        company_name,
        id
      ),
      reviews!listing_id (
        rating,
        id
      )
    `)
    .eq("status", "active")

  // Apply search filter
  if (filters.search && filters.search.trim() !== "") {
    query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
  }

  // Apply grain type filter
  if (filters.grainType && filters.grainType !== "all") {
    query = query.eq("grain_type", filters.grainType)
  }

  // Apply location filter
  if (filters.location && filters.location !== "all") {
    query = query.eq("state", filters.location)
  }

  // Apply price range filter
  if (filters.minPrice !== undefined) {
    query = query.gte("price", filters.minPrice)
  }

  if (filters.maxPrice !== undefined) {
    query = query.lte("price", filters.maxPrice)
  }

  // Apply farming method filter
  if (filters.farmingMethod && filters.farmingMethod.length > 0) {
    query = query.in("farming_method", filters.farmingMethod)
  }

  // Apply sorting
  if (filters.sortBy) {
    switch (filters.sortBy) {
      case "price-low":
        query = query.order("price", { ascending: true })
        break
      case "price-high":
        query = query.order("price", { ascending: false })
        break
      case "newest":
        query = query.order("created_at", { ascending: false })
        break
      case "featured":
        query = query.order("featured", { ascending: false }).order("created_at", { ascending: false })
        break
      default:
        query = query.order("created_at", { ascending: false })
    }
  } else {
    // Default sorting
    query = query.order("created_at", { ascending: false })
  }

  // Get total count for pagination
  const { count } = await supabase
    .from("grain_listings")
    .select("*", { count: "exact", head: true })
    .eq("status", "active")

  // Apply pagination
  const pageSize = 9
  const page = filters.page || 1
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  query = query.range(from, to)

  // Execute the query
  const { data, error } = await query

  if (error) {
    console.error("Error fetching filtered listings:", error)
    return { listings: [], count: 0, error: error.message }
  }

  // Calculate total pages
  const totalPages = count ? Math.ceil(count / pageSize) : 0

  return {
    listings: data || [],
    count,
    currentPage: page,
    totalPages,
    error: null,
  }
}

// Server-side function to get grain types
async function getGrainTypes() {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("grain_listings")
    .select("grain_type")
    .eq("status", "active")
    .order("grain_type")

  if (error) {
    console.error("Error fetching grain types:", error)
    return []
  }

  // Get unique grain types
  const uniqueTypes = [...new Set(data.map((item) => item.grain_type))]
  return uniqueTypes
}

// Server-side function to get locations
async function getLocations() {
  const supabase = createClient()

  const { data, error } = await supabase.from("grain_listings").select("state").eq("status", "active").order("state")

  if (error) {
    console.error("Error fetching locations:", error)
    return []
  }

  // Get unique states
  const uniqueStates = [...new Set(data.map((item) => item.state).filter(Boolean))]
  return uniqueStates
}

// Server-side function to get farming methods
async function getFarmingMethods() {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("grain_listings")
    .select("farming_method")
    .eq("status", "active")
    .order("farming_method")

  if (error) {
    console.error("Error fetching farming methods:", error)
    return []
  }

  // Get unique farming methods
  const uniqueMethods = [...new Set(data.map((item) => item.farming_method))]
  return uniqueMethods
}

export default async function Marketplace({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  // Parse search params
  const search = typeof searchParams.search === "string" ? searchParams.search : ""
  const grainType = typeof searchParams.grainType === "string" ? searchParams.grainType : "all"
  const location = typeof searchParams.location === "string" ? searchParams.location : "all"
  const minPrice = typeof searchParams.minPrice === "string" ? Number.parseFloat(searchParams.minPrice) : 0
  const maxPrice = typeof searchParams.maxPrice === "string" ? Number.parseFloat(searchParams.maxPrice) : 20
  const farmingMethod = typeof searchParams.farmingMethod === "string" ? searchParams.farmingMethod.split(",") : []
  const sortBy = typeof searchParams.sortBy === "string" ? searchParams.sortBy : "newest"
  const page = typeof searchParams.page === "string" ? Number.parseInt(searchParams.page) : 1

  // Create filter params object
  const filters: FilterParams = {
    search,
    grainType,
    location,
    minPrice,
    maxPrice,
    farmingMethod,
    sortBy,
    page,
  }

  // Fetch data
  const { listings, currentPage, totalPages } = await getFilteredListings(filters)
  const grainTypes = await getGrainTypes()
  const locations = await getLocations()
  const farmingMethods = await getFarmingMethods()

  // Create a server action that can be passed to the client
  async function handleFilterChange(newFilters: FilterParams) {
    "use server"
    return getFilteredListings(newFilters)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-green-50">
          <div className="container px-4 md:px-6">
            <div className="space-y-4 text-center">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Grain Marketplace</h1>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Browse and purchase high-quality grains directly from farmers across the country
              </p>
            </div>
          </div>
        </section>

        <section className="w-full py-12">
          <div className="container px-4 md:px-6">
            <MarketplaceClient
              initialListings={listings}
              initialCurrentPage={currentPage}
              initialTotalPages={totalPages}
              grainTypes={grainTypes}
              locations={locations}
              farmingMethods={farmingMethods}
              initialFilters={filters}
              onFilterChange={handleFilterChange}
            />
          </div>
        </section>
      </main>
      <footer className="border-t bg-gray-50">
        <div className="container flex flex-col gap-6 py-8 md:py-12 px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8">
            {/* Footer content */}
          </div>
          <div className="text-sm text-gray-500">
            © {new Date().getFullYear()} Farm Fresh Market. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
