import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { GrapeIcon as Grain, Search } from "lucide-react"

export default function Marketplace() {
  const grains = [
    {
      id: 1,
      name: "Organic Wheat",
      farmer: "Johnson Family Farm",
      price: 8.5,
      location: "Iowa",
      quantity: "500 bushels",
      type: "Wheat",
      organic: true,
    },
    {
      id: 2,
      name: "Non-GMO Corn",
      farmer: "Green Valley Farms",
      price: 7.25,
      location: "Nebraska",
      quantity: "750 bushels",
      type: "Corn",
      organic: false,
    },
    {
      id: 3,
      name: "Premium Barley",
      farmer: "Sunset Acres",
      price: 9.75,
      location: "Montana",
      quantity: "300 bushels",
      type: "Barley",
      organic: false,
    },
    {
      id: 4,
      name: "Organic Oats",
      farmer: "Hillside Harvest",
      price: 10.25,
      location: "Minnesota",
      quantity: "400 bushels",
      type: "Oats",
      organic: true,
    },
    {
      id: 5,
      name: "Rye Grain",
      farmer: "Eastwood Farms",
      price: 8.75,
      location: "Wisconsin",
      quantity: "250 bushels",
      type: "Rye",
      organic: false,
    },
    {
      id: 6,
      name: "Organic Quinoa",
      farmer: "Mountain View Farm",
      price: 15.5,
      location: "Colorado",
      quantity: "150 bushels",
      type: "Quinoa",
      organic: true,
    },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container flex items-center justify-between h-16 px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2">
            <Grain className="w-6 h-6 text-green-600" />
            <span className="text-xl font-bold">Farm Fresh Market</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link href="/marketplace" className="text-sm font-medium hover:underline underline-offset-4">
              Marketplace
            </Link>
            <Link href="/how-it-works" className="text-sm font-medium hover:underline underline-offset-4">
              How It Works
            </Link>
            <Link href="/about" className="text-sm font-medium hover:underline underline-offset-4">
              About Us
            </Link>
            <Link href="/contact" className="text-sm font-medium hover:underline underline-offset-4">
              Contact
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="outline" size="sm">
                Log In
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm" className="bg-green-600 hover:bg-green-700">
                Sign Up
              </Button>
            </Link>
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
          </div>
        </div>
      </header>
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="md:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle>Filter Options</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="search" className="text-sm font-medium">
                        Search
                      </label>
                      <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                        <Input id="search" placeholder="Search grains..." className="pl-8" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="grain-type" className="text-sm font-medium">
                        Grain Type
                      </label>
                      <Select defaultValue="all">
                        <SelectTrigger id="grain-type">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Types</SelectItem>
                          <SelectItem value="wheat">Wheat</SelectItem>
                          <SelectItem value="corn">Corn</SelectItem>
                          <SelectItem value="barley">Barley</SelectItem>
                          <SelectItem value="oats">Oats</SelectItem>
                          <SelectItem value="rye">Rye</SelectItem>
                          <SelectItem value="quinoa">Quinoa</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="location" className="text-sm font-medium">
                        Location
                      </label>
                      <Select defaultValue="all">
                        <SelectTrigger id="location">
                          <SelectValue placeholder="Select location" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Locations</SelectItem>
                          <SelectItem value="iowa">Iowa</SelectItem>
                          <SelectItem value="nebraska">Nebraska</SelectItem>
                          <SelectItem value="montana">Montana</SelectItem>
                          <SelectItem value="minnesota">Minnesota</SelectItem>
                          <SelectItem value="wisconsin">Wisconsin</SelectItem>
                          <SelectItem value="colorado">Colorado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label htmlFor="price-range" className="text-sm font-medium">
                          Price Range
                        </label>
                        <span className="text-sm text-gray-500">$0 - $20</span>
                      </div>
                      <Slider id="price-range" defaultValue={[0, 20]} max={20} step={0.5} className="py-4" />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Farming Method</label>
                      <div className="grid grid-cols-2 gap-2">
                        <Button variant="outline" className="justify-start">
                          Organic
                        </Button>
                        <Button variant="outline" className="justify-start">
                          Conventional
                        </Button>
                        <Button variant="outline" className="justify-start">
                          Non-GMO
                        </Button>
                        <Button variant="outline" className="justify-start">
                          Sustainable
                        </Button>
                      </div>
                    </div>

                    <Button className="w-full bg-green-600 hover:bg-green-700">Apply Filters</Button>
                  </CardContent>
                </Card>
              </div>

              <div className="md:col-span-3">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Available Grains</h2>
                  <Select defaultValue="featured">
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
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {grains.map((grain) => (
                    <Card key={grain.id} className="overflow-hidden">
                      <div className="aspect-square relative">
                        <Image
                          src={`/placeholder.svg?height=300&width=300&text=${grain.name}`}
                          alt={grain.name}
                          fill
                          className="object-cover"
                        />
                        {grain.organic && (
                          <div className="absolute top-2 right-2 bg-green-600 text-white text-xs font-medium px-2 py-1 rounded">
                            Organic
                          </div>
                        )}
                      </div>
                      <CardHeader className="p-4">
                        <CardTitle className="text-lg">{grain.name}</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0 space-y-2">
                        <p className="text-sm text-gray-500">Grown by {grain.farmer}</p>
                        <p className="text-sm text-gray-500">Location: {grain.location}</p>
                        <p className="text-sm text-gray-500">Available: {grain.quantity}</p>
                        <p className="text-lg font-semibold">${grain.price.toFixed(2)}/bushel</p>
                      </CardContent>
                      <CardFooter className="p-4 pt-0">
                        <Button className="w-full bg-green-600 hover:bg-green-700">View Details</Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>

                <div className="flex items-center justify-center space-x-2 mt-8">
                  <Button variant="outline" size="icon">
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
                      className="h-4 w-4"
                    >
                      <path d="m15 18-6-6 6-6" />
                    </svg>
                  </Button>
                  <Button variant="outline" className="h-9 w-9">
                    1
                  </Button>
                  <Button variant="outline" className="h-9 w-9">
                    2
                  </Button>
                  <Button variant="outline" className="h-9 w-9">
                    3
                  </Button>
                  <Button variant="outline" size="icon">
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
                      className="h-4 w-4"
                    >
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t bg-gray-50">
        <div className="container flex flex-col gap-6 py-8 md:py-12 px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8">
            <Link href="/" className="flex items-center gap-2">
              <Grain className="w-6 h-6 text-green-600" />
              <span className="text-xl font-bold">Farm Fresh Market</span>
            </Link>
            <nav className="grid grid-cols-2 md:flex gap-4 md:gap-6 text-sm">
              <Link href="/marketplace" className="hover:underline underline-offset-4">
                Marketplace
              </Link>
              <Link href="/how-it-works" className="hover:underline underline-offset-4">
                How It Works
              </Link>
              <Link href="/about" className="hover:underline underline-offset-4">
                About Us
              </Link>
              <Link href="/contact" className="hover:underline underline-offset-4">
                Contact
              </Link>
              <Link href="/privacy" className="hover:underline underline-offset-4">
                Privacy
              </Link>
              <Link href="/terms" className="hover:underline underline-offset-4">
                Terms
              </Link>
            </nav>
          </div>
          <div className="text-sm text-gray-500">
            © {new Date().getFullYear()} Farm Fresh Market. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
