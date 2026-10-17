"use client"

import React from "react"
import ProtectedRoute from "@/components/ProtectedRoute"

export default function TeacherDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute allowedRoles={['teacher']}>
      <div className="p-4">{children}</div>
    </ProtectedRoute>
  )
} 