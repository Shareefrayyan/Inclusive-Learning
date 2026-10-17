"use client"

import React from "react"
import ProtectedRoute from "@/components/ProtectedRoute"

export default function StudentDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute allowedRoles={['student']}>
      <div className="p-4">{children}</div>
    </ProtectedRoute>
  )
} 