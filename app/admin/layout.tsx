"use client";
import React, { useState } from 'react'
import { LayoutGrid } from "lucide-react"
import { Navbar, TabLink} from "components/ui/nav-bar"

const TABS = [
  {
      title: 'Dashboard',
      url: (id) => `/admin`,
      icon: <LayoutGrid className="w-4 h-4" />
  },
] as TabLink[];

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
