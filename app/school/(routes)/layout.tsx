"use client"
import React, { useState } from 'react'
import Sidebar from '../_components/side-bar'

export default function RootLayout({ children }: { children: React.ReactNode }) {
    const [showSidebar, setShowSidebar] = useState<boolean>(true)
    return (
        <main className="overflow-y-hidden font-sans">
            <section className="">
                <Sidebar
                    showSidebar={showSidebar}
                    setShowSidebar={setShowSidebar}
                />
                <section>
                    {children}
                </section>
            </section>
        </main>
    )
}
