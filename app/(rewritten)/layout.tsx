import React from 'react'
import { Navbar } from "components/ui/nav-bar"

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <main className="font-sans">
          <section>
            <Navbar tabs={[]} />
          </section>
          <section className="md:flex">
            <div className="flex flex-col flex-grow">
               {children}
            </div>
          </section>
        </main>
    )
}
