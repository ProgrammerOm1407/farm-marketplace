"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type SortDropdownProps = {
  value: string
  onChange: (value: string) => void
}

export function SortDropdown({ value, onChange }: SortDropdownProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="featured">Featured</SelectItem>
        <SelectItem value="price-low">Price: Low to High</SelectItem>
        <SelectItem value="price-high">Price: High to Low</SelectItem>
        <SelectItem value="newest">Newest Listings</SelectItem>
      </SelectContent>
    </Select>
  )
}
