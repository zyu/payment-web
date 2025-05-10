import type React from "react"
import { DashboardHeader } from "@/components/layout/header"
import { DashboardSidebar } from "@/components/layout/sidebar"
import { SidebarProvider } from "@/components/ui/sidebar" 

 
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) { 

  return ( 
      <SidebarProvider defaultOpen={true}>
        <div className="flex min-h-screen w-full">
          <DashboardSidebar />
          <div className="flex flex-1 flex-col w-full">
            <DashboardHeader />
            <main className="flex-1 w-full p-4 md:p-6">{children}</main>
          </div>
        </div>
      </SidebarProvider> 
  )
}
