"use client";
import { Navbar, TabLink} from "components/ui/nav-bar"
import React from 'react'
import { LayoutGrid, UserPlus } from "lucide-react"

const TABS = [
  {
      title: 'Dashboard',
      url: () => `/recruiter/dashboard`,
      // url2: (id) => `/recruiter/${id}/dashboard`, // coming shortly
      icon: <LayoutGrid className="w-4 h-4" />

  },
  {
    title: 'Territories',
    url: () => `/recruiter/profile/territory`,
    // url2: (id) => `/recruiter/${id}/dashboard`, // coming shortly
    icon: <LayoutGrid className="w-4 h-4" />
  },
  {
      title: 'Connections',
      url: () => `/recruiter/connections`,
      // url2: (id) => `/recruiter/${id}/connections`, // coming shortly
      icon: <UserPlus className="w-4 h-4" />
  },
] as TabLink[];

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <main className="font-sans">
          <section>
            <Navbar tabs={TABS} />
          </section>
          <section className="md:flex">
            <div className="flex flex-col flex-grow">
               {children}
            </div>
          </section>
        </main>
    )
}
