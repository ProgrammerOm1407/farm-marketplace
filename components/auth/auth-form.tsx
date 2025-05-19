"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { getSupabaseBrowserClient } from "@/utils/supabase/client"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface AuthFormProps {
  view: "sign-in" | "sign-up"
}

export function AuthForm({ view }: AuthFormProps) {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [userType, setUserType] = useState<string>("buyer")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = getSupabaseBrowserClient()

    try {
      if (view === "sign-up") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              user_type: userType,
            },
          },
        })

        if (error) throw error

        // Redirect to verification page or dashboard
        router.push("/auth/verification")
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) throw error

        // Refresh the page to update auth state
        router.refresh()
        router.push("/dashboard")
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during authentication")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">
          {view === "sign-in" ? "Login to your account" : "Create an account"}
        </CardTitle>
        <CardDescription>
          {view === "sign-in"
            ? "Enter your email and password to access your account"
            : "Enter your information to create an account"}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {view === "sign-up" && (
            <div className="space-y-2">
              <Label htmlFor="full-name">Full name</Label>
              <Input
                id="full-name"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="farmer@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              {view === "sign-in" && (
                <Link href="/auth/forgot-password" className="text-sm text-green-600 hover:underline">
                  Forgot password?
                </Link>
              )}
            </div>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {view === "sign-up" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="account-type">Account type</Label>
                <Select value={userType} onValueChange={setUserType}>
                  <SelectTrigger id="account-type">
                    <SelectValue placeholder="Select account type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="farmer">Farmer (I want to sell grains)</SelectItem>
                    <SelectItem value="buyer">Buyer (I want to purchase grains)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox id="terms" required />
                <Label htmlFor="terms" className="text-sm">
                  I agree to the{" "}
                  <Link href="/terms" className="text-green-600 hover:underline">
                    terms and conditions
                  </Link>
                </Label>
              </div>
            </>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={loading}>
            {loading ? "Loading..." : view === "sign-in" ? "Login" : "Create account"}
          </Button>
          <div className="text-center text-sm">
            {view === "sign-in" ? (
              <>
                Don't have an account?{" "}
                <Link href="/signup" className="text-green-600 hover:underline">
                  Sign up
                </Link>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <Link href="/login" className="text-green-600 hover:underline">
                  Login
                </Link>
              </>
            )}
          </div>
        </CardFooter>
      </form>
    </Card>
  )
}
