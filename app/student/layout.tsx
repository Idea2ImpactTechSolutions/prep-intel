import { X } from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Prep Intel | Student Onboarding",
    description: 'Some description here'
}

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <main className="font-sans h-screen overflow-hidden">
            <nav className={`bg-panel p-2 border-b md:px-6 lg:px-6`}>
                <div className="container p-2 px-6 flex flex-col items-center md:flex-row md:items-center md:justify-between pl-0">
                    <div className="flex flex-col items-center md:flex-row md:items-center md:gap-x-8">
                        <Link
                            href="/"
                            className="md:border-r md:pr-10"
                        >
                            <Image
                                src='/images/logo/text-logo.png'
                                width={100}
                                height={100}
                                alt="logo"
                            />
                        </Link>
                        <span> Complete Account Setup </span>
                    </div>
                    <div className="flex flex-grow-1"></div>
                    <span className="absolute right-2 md:relative block border border-[#DEDEDE] cursor-pointer p-2 rounded-full text-[#000000]"> <X width={15} height={15}/> </span>
                </div>
            </nav>
            <section className="md:flex">
            <div className="flex flex-col flex-grow">
               {children}
            </div>
            </section>
        </main>
    )
}
