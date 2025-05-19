import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { GrapeIcon as Grain, ShoppingBasket, TrendingUp, Users } from "lucide-react"

export default function Home() {
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
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Sell Your Grains Directly to Buyers
                </h1>
                <p className="text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Farm Fresh Market connects farmers with buyers, making it easy to list and sell your grains at fair
                  prices without middlemen.
                </p>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/marketplace">
                    <Button className="bg-green-600 hover:bg-green-700">Browse Marketplace</Button>
                  </Link>
                  <Link href="/signup">
                    <Button variant="outline">Start Selling</Button>
                  </Link>
                </div>
              </div>
              <Image
                src="/placeholder.svg?height=400&width=600"
                alt="Farm field with grain"
                width={600}
                height={400}
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover"
              />
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Featured Grains</h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Browse our selection of high-quality grains from local farmers
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {[
                {
                  name: "Organic Wheat",
                  farmer: "Johnson Family Farm",
                  price: "$8.50/bushel",
                  location: "Iowa",
                },
                {
                  name: "Non-GMO Corn",
                  farmer: "Green Valley Farms",
                  price: "$7.25/bushel",
                  location: "Nebraska",
                },
                {
                  name: "Premium Barley",
                  farmer: "Sunset Acres",
                  price: "$9.75/bushel",
                  location: "Montana",
                },
              ].map((grain, index) => (
                <div
                  key={index}
                  className="flex flex-col items-start gap-2 rounded-lg border p-6 hover:shadow-md transition-shadow"
                >
                  <div className="w-full aspect-square relative mb-2">
                    <Image
                      src={`/placeholder.svg?height=300&width=300&text=${grain.name}`}
                      alt={grain.name}
                      fill
                      className="rounded-md object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-bold">{grain.name}</h3>
                  <p className="text-sm text-gray-500">Grown by {grain.farmer}</p>
                  <p className="text-sm text-gray-500">Location: {grain.location}</p>
                  <p className="text-lg font-semibold mt-2">{grain.price}</p>
                  <Button className="mt-2 w-full bg-green-600 hover:bg-green-700">View Details</Button>
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-8">
              <Link href="/marketplace">
                <Button variant="outline">View All Listings</Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-green-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">How It Works</h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Simple steps to start selling or buying grains on our platform
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <Users className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold">Create an Account</h3>
                <p className="text-gray-500">
                  Sign up for free and create your farmer profile with just a few simple steps.
                </p>
              </div>
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <Grain className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold">List Your Grains</h3>
                <p className="text-gray-500">
                  Add details about your grain products, including photos, quantity, and pricing.
                </p>
              </div>
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <ShoppingBasket className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold">Connect with Buyers</h3>
                <p className="text-gray-500">
                  Receive inquiries and offers directly from interested buyers in your area.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <Image
                src="/placeholder.svg?height=400&width=600"
                alt="Farmers using the platform"
                width={600}
                height={400}
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover"
              />
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Why Farmers Choose Us</h2>
                <ul className="grid gap-6">
                  <li className="flex items-start gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 shrink-0">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-xl font-bold">Better Prices</h3>
                      <p className="text-gray-500">
                        Sell directly to buyers and get fair market value for your grains.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 shrink-0">
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
                        className="h-5 w-5 text-green-600"
                      >
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                      </svg>
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-xl font-bold">Secure Transactions</h3>
                      <p className="text-gray-500">
                        Our platform ensures safe and transparent transactions between farmers and buyers.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 shrink-0">
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
                        className="h-5 w-5 text-green-600"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <path d="m16 10-4 4-2-2" />
                      </svg>
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-xl font-bold">Simple to Use</h3>
                      <p className="text-gray-500">
                        Designed with farmers in mind, our platform is easy to navigate even for those who aren't tech
                        experts.
                      </p>
                    </div>
                  </li>
                </ul>
                <div className="flex flex-col gap-2 min-[400px]:flex-row pt-4">
                  <Link href="/signup">
                    <Button className="bg-green-600 hover:bg-green-700">Join Now</Button>
                  </Link>
                  <Link href="/testimonials">
                    <Button variant="outline">Read Success Stories</Button>
                  </Link>
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
