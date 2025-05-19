"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { FilterSidebar } from "@/components/marketplace/filter-sidebar"
import { SortDropdown } from "@/components/marketplace/sort-dropdown"
import { ListingGrid } from "@/components/marketplace/listing-grid"
import { Pagination } from "@/components/marketplace/pagination"

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

type MarketplaceClientProps = {
  initialListings: any[]
  initialCurrentPage: number
  initialTotalPages: number
  grainTypes: string[]
  locations: string[]
  farmingMethods: string[]
  initialFilters: FilterParams
  onFilterChange: (filters: FilterParams) => Promise<any>
}

export function MarketplaceClient({
  initialListings,
  initialCurrentPage,
  initialTotalPages,
  grainTypes,
  locations,
  farmingMethods,
  initialFilters,
  onFilterChange,
}: MarketplaceClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [listings, setListings] = useState(initialListings)
  const [currentPage, setCurrentPage] = useState(initialCurrentPage)
  const [totalPages, setTotalPages] = useState(initialTotalPages)
  const [filters, setFilters] = useState<FilterParams>(initialFilters)
  const [isLoading, setIsLoading] = useState(false)

  // Handle filter changes
  const handleFilterChange = async (newFilters: FilterParams) => {
    setIsLoading(true)
    setFilters(newFilters)

    try {
      const result = await onFilterChange(newFilters)

      setListings(result.listings)
      setCurrentPage(result.currentPage)
      setTotalPages(result.totalPages)
    } catch (error) {
      console.error("Error applying filters:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle sort changes
  const handleSortChange = (sortBy: string) => {
    const newFilters = { ...filters, sortBy, page: 1 }
    handleFilterChange(newFilters)

    // Update URL
    const params = new URLSearchParams(searchParams.toString())
    params.set("sortBy", sortBy)
    params.set("page", "1")
    router.push(`/marketplace?${params.toString()}`)
  }

  // Handle page changes
  const handlePageChange = (page: number) => {
    const newFilters = { ...filters, page }
    handleFilterChange(newFilters)

    // Update URL
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", page.toString())
    router.push(`/marketplace?${params.toString()}`)
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <FilterSidebar
            grainTypes={grainTypes}
            locations={locations}
            farmingMethods={farmingMethods}
            onFilterChange={handleFilterChange}
            initialFilters={filters}
          />
        </div>

        <div className="md:col-span-3">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">{isLoading ? "Loading..." : "Available Grains"}</h2>
            <SortDropdown value={filters.sortBy || "newest"} onChange={handleSortChange} />
          </div>

          <div className={isLoading ? "opacity-50 pointer-events-none" : ""}>
            <ListingGrid listings={listings} />
          </div>

          {listings && listings.length > 0 && (
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
          )}
        </div>
      </div>
    </>
  )
}
