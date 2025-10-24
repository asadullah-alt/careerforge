"use client"

import React from "react"
import AuthGuard from '@/components/auth-guard'
// ChartAreaInteractive intentionally unused here
import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"
// TextShimmer intentionally unused here

import data from "./data.json"

export default function Page() {
  return (
    <AuthGuard>
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <SectionCards />
         
          <DataTable data={data} />
        </div>
      </div>
    </AuthGuard>
  )
}
