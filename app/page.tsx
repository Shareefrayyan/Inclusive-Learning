import type React from "react"
import Link from "next/link"
import { BookOpen, Building, GraduationCap, Users } from "lucide-react"
import Logo from "@/components/Logo"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white flex flex-col items-center justify-center p-4 sm:p-6">
      <div className="mb-8 sm:mb-12">
        <Logo size="hero" className="justify-center" showText={false} />
      </div>

      <header className="text-center mb-8 sm:mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold text-slate-800 mb-3">TeachAssist</h1>
        <p className="text-slate-600 max-w-md mx-auto">Select your role to access the dashboard or sign up</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 w-full max-w-5xl">
        <RoleCard
          title="Student"
          description="Learn and Track Progress"
          icon={<GraduationCap size={32} />}
          href="/signup?role=student"
          color="bg-blue-50 hover:bg-blue-100"
          iconColor="text-blue-500"
        />
        <RoleCard
          title="Teacher"
          description="Manage Classes and Assignments"
          icon={<BookOpen size={32} />}
          href="/signup?role=teacher"
          color="bg-green-50 hover:bg-green-100"
          iconColor="text-green-500"
        />
        <RoleCard
          title="Parent"
          description="Monitor Child's Academic Journey"
          icon={<Users size={32} />}
          href="/signup?role=parent"
          color="bg-amber-50 hover:bg-amber-100"
          iconColor="text-amber-500"
        />
        <RoleCard
          title="Principal"
          description="Oversee School Operations"
          icon={<Building size={32} />}
          href="/signup?role=principal"
          color="bg-purple-50 hover:bg-purple-100"
          iconColor="text-purple-500"
        />
      </div>
      <div className="mt-12 text-center">
        <p className="text-slate-600">
          Already have an account?{" "}
          <Link href="/signin" className="font-medium text-indigo-600 hover:text-indigo-500">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  )
}

interface RoleCardProps {
  title: string
  description: string
  icon: React.ReactNode
  href: string
  color: string
  iconColor: string
}

function RoleCard({ title, description, icon, href, color, iconColor }: RoleCardProps) {
  return (
    <Link
      href={href}
      className={`flex flex-col items-center justify-center p-6 sm:p-8 rounded-xl shadow-sm border border-slate-100 transition-all duration-200 ${color} hover:shadow-md`}
    >
      <div className={`mb-4 ${iconColor}`}>{icon}</div>
      <h2 className="text-xl font-semibold text-slate-800 mb-2">{title}</h2>
      <p className="text-sm text-slate-600 text-center">{description}</p>
    </Link>
  )
}
