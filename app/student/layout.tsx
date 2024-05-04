"use client"
import React, { useState } from 'react'
import { Navbar, TabLink} from "components/ui/nav-bar"
import { GraduationCap, LayoutGrid, UserPlus } from "lucide-react"
import { usePathname } from "next/navigation";

const TABS = [
  {
      title: 'Dashboard',
      url: (schoolId) => `/student/explore`,
      icon: <LayoutGrid className="w-4 h-4" />
  },
  {
      title: 'Connections',
      url: (schoolId) => `/student/connections`,
      icon: <UserPlus className="w-4 h-4" />
  },
  {
      title: 'Schools',
      url: (schoolId) => `/student/schools`,
      icon: <GraduationCap className="w-4 h-4" />
  },
] as TabLink[];

export default function Layout({ children }: { children: React.ReactNode }) {
    const [showSidebar, setShowSidebar] = useState<boolean>(true);
    const location = usePathname() as string;


    return (
      <main className="overflow-y-hidden font-sans">
        <section className="">
            <Navbar
                showTabs={!location.includes('onboarding')}
                leftContent={
                  location.includes('onboarding') && <span className="ml-10 md:border-l md:pl-10">Complete Account Setup</span>
                }
                showSidebar={showSidebar}
                setShowSidebar={setShowSidebar}
                tabs={TABS}
            />
            <section>
               {children}
            </section>
        </section>
        </main>


    )
}
