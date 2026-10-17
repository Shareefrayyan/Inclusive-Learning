import type React from "react"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import ProtectedRoute from "@/components/ProtectedRoute"
import Logo from "@/components/Logo"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-50">
        <header className="bg-white border-b border-slate-200 p-4">
          <div className="max-w-7xl mx-auto flex items-center">
            <Link href="/" className="flex items-center text-slate-600 hover:text-slate-900 transition-colors">
              <ChevronLeft className="mr-1" size={16} />
              Back to Home
            </Link>
            <div className="flex-1 flex justify-center mr-8">
              <Logo size="md" />
            </div>
          </div>
        </header>
        <main className="max-w-7xl mx-auto">{children}</main>
      </div>
    </ProtectedRoute>
  )
}
