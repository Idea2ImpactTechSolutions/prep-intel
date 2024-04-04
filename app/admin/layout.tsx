"use client";
import React, { useState } from 'react'
import { LayoutGrid } from "lucide-react"
import Navbar from "components/ui/nav-bar"

export const TABS = [
  {
      title: 'Dashboard',
      url: (id) => `/recruiter/${id}/dashboard`,
      icon: <LayoutGrid className="w-4 h-4" />
  },
];

export default function Layout({ children }: { children: React.ReactNode }) {
    const [showSidebar, setShowSidebar] = useState<boolean>(true)

    return (
       <main className="font-sans">
          <section>
            <Navbar
                showSidebar={showSidebar}
                setShowSidebar={setShowSidebar}
                tabs={TABS}
            />
          </section>
          <section className="md:flex">
            <div className="flex flex-col flex-grow">
               {children}
            </div>
          </section>
        </main>
    )
}
