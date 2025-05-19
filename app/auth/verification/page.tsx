import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { GrapeIcon as Grain, Mail } from "lucide-react"

export default function VerificationPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container flex items-center justify-between h-16 px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2">
            <Grain className="w-6 h-6 text-green-600" />
            <span className="text-xl font-bold">Farm Fresh Market</span>
          </Link>
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center p-4 md:p-6">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Check your email</CardTitle>
            <CardDescription>We've sent you a verification link to confirm your email address</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center space-y-4 pt-4">
            <div className="rounded-full bg-green-100 p-6">
              <Mail className="h-12 w-12 text-green-600" />
            </div>
            <p className="text-center text-sm text-gray-500">
              Please check your email inbox and click on the verification link to complete your registration. If you
              don't see the email, check your spam folder.
            </p>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button className="w-full" variant="outline" asChild>
              <Link href="/login">Back to login</Link>
            </Button>
            <div className="text-center text-sm text-gray-500">
              Didn't receive an email?{" "}
              <Link href="/auth/resend-verification" className="text-green-600 hover:underline">
                Resend verification email
              </Link>
            </div>
          </CardFooter>
        </Card>
      </main>
      <footer className="border-t bg-gray-50">
        <div className="container py-6 px-4 md:px-6">
          <div className="text-sm text-gray-500 text-center">
            © {new Date().getFullYear()} Farm Fresh Market. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
