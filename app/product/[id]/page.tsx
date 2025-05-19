import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { GrapeIcon as Grain, MapPin, Phone, Mail, Star, Truck, Calendar, Shield } from "lucide-react"

export default function ProductDetail({ params }: { params: { id: string } }) {
  // This would normally fetch data based on the ID
  const product = {
    id: params.id,
    name: "Organic Wheat",
    farmer: "Johnson Family Farm",
    price: 8.5,
    location: "Iowa",
    quantity: "500 bushels",
    type: "Wheat",
    organic: true,
    description:
      "Premium organic wheat grown using sustainable farming practices. Our wheat is perfect for baking bread, pastries, and other wheat-based products. We harvest at the peak of ripeness to ensure maximum nutrition and flavor.",
    harvestDate: "August 2023",
    minimumOrder: "10 bushels",
    farmerInfo: {
      name: "Robert Johnson",
      phone: "(555) 123-4567",
      email: "robert@johnsonfarming.com",
      experience: "25+ years",
      rating: 4.8,
      reviews: 42,
    },
  }

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
        <div className="container px-4 py-8 md:px-6 md:py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="relative aspect-square overflow-hidden rounded-lg">
                <Image
                  src={`/placeholder.svg?height=600&width=600&text=${product.name}`}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
                {product.organic && <Badge className="absolute top-4 right-4 bg-green-600">Organic</Badge>}
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="relative aspect-square overflow-hidden rounded-md">
                    <Image
                      src={`/placeholder.svg?height=150&width=150&text=Image ${i}`}
                      alt={`Product image ${i}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold">{product.name}</h1>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline">{product.type}</Badge>
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="w-4 h-4 mr-1" />
                    {product.location}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-3xl font-bold">${product.price.toFixed(2)}</div>
                <div className="text-gray-500">per bushel</div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Truck className="w-5 h-5 text-green-600" />
                  <span>Available: {product.quantity}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-green-600" />
                  <span>Harvest Date: {product.harvestDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-600" />
                  <span>Minimum Order: {product.minimumOrder}</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Button className="w-full bg-green-600 hover:bg-green-700">Contact Farmer</Button>
                  <Button variant="outline" className="w-full">
                    Add to Favorites
                  </Button>
                </div>
                <Button className="w-full">Request Purchase</Button>
              </div>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                      <span className="text-green-600 font-bold">JF</span>
                    </div>
                    <div>
                      <h3 className="font-semibold">{product.farmerInfo.name}</h3>
                      <div className="flex items-center text-sm">
                        <Star className="w-4 h-4 text-yellow-500 mr-1" />
                        <span>
                          {product.farmerInfo.rating} ({product.farmerInfo.reviews} reviews)
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 grid gap-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span>{product.farmerInfo.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <span>{product.farmerInfo.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Grain className="w-4 h-4 text-gray-500" />
                      <span>Farming Experience: {product.farmerInfo.experience}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="mt-12">
            <Tabs defaultValue="description">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="specifications">Specifications</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>
              <TabsContent value="description" className="p-4 border rounded-md mt-4">
                <h3 className="text-lg font-semibold mb-2">Product Description</h3>
                <p>{product.description}</p>
              </TabsContent>
              <TabsContent value="specifications" className="p-4 border rounded-md mt-4">
                <h3 className="text-lg font-semibold mb-2">Product Specifications</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between py-2 border-b">
                      <span className="font-medium">Type</span>
                      <span>{product.type}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="font-medium">Organic</span>
                      <span>{product.organic ? "Yes" : "No"}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="font-medium">Harvest Date</span>
                      <span>{product.harvestDate}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between py-2 border-b">
                      <span className="font-medium">Location</span>
                      <span>{product.location}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="font-medium">Available Quantity</span>
                      <span>{product.quantity}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="font-medium">Minimum Order</span>
                      <span>{product.minimumOrder}</span>
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="reviews" className="p-4 border rounded-md mt-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Customer Reviews</h3>
                  <Button variant="outline" size="sm">
                    Write a Review
                  </Button>
                </div>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="border-b pb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-xs font-medium">U{i}</span>
                        </div>
                        <div>
                          <div className="font-medium">User {i}</div>
                          <div className="flex items-center">
                            {Array(5)
                              .fill(0)
                              .map((_, j) => (
                                <Star
                                  key={j}
                                  className={`w-4 h-4 ${j < 5 - (i % 2) ? "text-yellow-500" : "text-gray-300"}`}
                                />
                              ))}
                          </div>
                        </div>
                        <div className="ml-auto text-sm text-gray-500">2 weeks ago</div>
                      </div>
                      <p className="text-sm">
                        {i === 1
                          ? "Great quality wheat! I've been buying from this farm for years and they never disappoint."
                          : i === 2
                            ? "The grain was delivered on time and in excellent condition. Will order again."
                            : "Excellent product and the farmer was very helpful with all my questions."}
                      </p>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Similar Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <div className="aspect-square relative">
                    <Image
                      src={`/placeholder.svg?height=300&width=300&text=Similar ${i}`}
                      alt={`Similar product ${i}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold">Similar Grain Product {i}</h3>
                    <p className="text-sm text-gray-500">Another Farm</p>
                    <div className="flex items-center justify-between mt-2">
                      <p className="font-semibold">${(7 + i).toFixed(2)}/bushel</p>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
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
