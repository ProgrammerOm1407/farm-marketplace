import Link from "next/link"
import { GrapeIcon as Grain } from "lucide-react"
import { AuthForm } from "@/components/auth/auth-form"

export default function Login() {
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
        <AuthForm view="sign-in" />
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
