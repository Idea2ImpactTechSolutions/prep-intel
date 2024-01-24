import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import RecruiterTabs from "./shared/recruiter-tabs";
import { FaBell } from "react-icons/fa";
import { IoPersonCircle } from "react-icons/io5";

export const metadata: Metadata = {
    title: "Prep Intel | Student Onboarding",
    description: 'Some description here'
}

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <main className="font-sans">
            <nav className={`bg-panel p-2 border-b md:px-6 lg:px-6`}>
                <div className="container p-2 px-6 flex flex-col items-center md:flex-row md:items-center md:justify-between pl-0">
                    <Link
                        href="/"
                    >
                        <Image
                            src="/images/logo/text-logo.png"
                            className=""
                            width={160}
                            height={0}
                            alt="logo"
                        />
                    </Link>
                    <div className=" flex flex-grow-1"></div>
                    <div className="flex mt-4 md:mt-0 px-6">
                        <RecruiterTabs />
                        <IoPersonCircle size="1.5em" className="mx-4 w-8" />
                        <FaBell  size="1.2em" className="w-4 mt-[2px]" />
                    </div>
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
