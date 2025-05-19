"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Search } from "lucide-react"

type FilterSidebarProps = {
  grainTypes: string[]
  locations: string[]
  farmingMethods: string[]
  onFilterChange: (filters: any) => void
  initialFilters: any
}

export function FilterSidebar({
  grainTypes,
  locations,
  farmingMethods,
  onFilterChange,
  initialFilters,
}: FilterSidebarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [search, setSearch] = useState(initialFilters.search || "")
  const [grainType, setGrainType] = useState(initialFilters.grainType || "all")
  const [location, setLocation] = useState(initialFilters.location || "all")
  const [priceRange, setPriceRange] = useState<[number, number]>([
    initialFilters.minPrice || 0,
    initialFilters.maxPrice || 20,
  ])
  const [selectedFarmingMethods, setSelectedFarmingMethods] = useState<string[]>(initialFilters.farmingMethod || [])

  // Handle farming method selection
  const toggleFarmingMethod = (method: string) => {
    setSelectedFarmingMethods((prev) => {
      if (prev.includes(method)) {
        return prev.filter((m) => m !== method)
      } else {
        return [...prev, method]
      }
    })
  }

  // Apply filters
  const applyFilters = () => {
    const filters = {
      search,
      grainType,
      location,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      farmingMethod: selectedFarmingMethods,
      page: 1, // Reset to first page when filters change
    }

    onFilterChange(filters)

    // Update URL with filters
    const params = new URLSearchParams()
    if (search) params.set("search", search)
    if (grainType !== "all") params.set("grainType", grainType)
    if (location !== "all") params.set("location", location)
    params.set("minPrice", priceRange[0].toString())
    params.set("maxPrice", priceRange[1].toString())
    if (selectedFarmingMethods.length > 0) {
      params.set("farmingMethod", selectedFarmingMethods.join(","))
    }

    router.push(`/marketplace?${params.toString()}`)
  }

  // Reset filters
  const resetFilters = () => {
    setSearch("")
    setGrainType("all")
    setLocation("all")
    setPriceRange([0, 20])
    setSelectedFarmingMethods([])

    onFilterChange({
      search: "",
      grainType: "all",
      location: "all",
      minPrice: 0,
      maxPrice: 20,
      farmingMethod: [],
      page: 1,
    })

    router.push("/marketplace")
  }

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <div className="space-y-2">
          <h3 className="font-semibold">Filter Options</h3>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              id="search"
              placeholder="Search grains..."
              className="pl-8"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="grain-type" className="text-sm font-medium">
            Grain Type
          </label>
          <Select value={grainType} onValueChange={setGrainType}>
            <SelectTrigger id="grain-type">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {grainTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label htmlFor="location" className="text-sm font-medium">
            Location
          </label>
          <Select value={location} onValueChange={setLocation}>
            <SelectTrigger id="location">
              <SelectValue placeholder="Select location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              {locations.map((loc) => (
                <SelectItem key={loc} value={loc}>
                  {loc}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="price-range" className="text-sm font-medium">
              Price Range
            </label>
            <span className="text-sm text-gray-500">
              ${priceRange[0].toFixed(2)} - ${priceRange[1].toFixed(2)}
            </span>
          </div>
          <Slider
            id="price-range"
            value={priceRange}
            onValueChange={setPriceRange}
            max={20}
            step={0.5}
            className="py-4"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Farming Method</label>
          <div className="space-y-2">
            {farmingMethods.map((method) => (
              <div key={method} className="flex items-center space-x-2">
                <Checkbox
                  id={`method-${method}`}
                  checked={selectedFarmingMethods.includes(method)}
                  onCheckedChange={() => toggleFarmingMethod(method)}
                />
                <Label htmlFor={`method-${method}`} className="text-sm">
                  {method.charAt(0).toUpperCase() + method.slice(1)}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col space-y-2">
          <Button className="w-full bg-green-600 hover:bg-green-700" onClick={applyFilters}>
            Apply Filters
          </Button>
          <Button variant="outline" className="w-full" onClick={resetFilters}>
            Reset Filters
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
