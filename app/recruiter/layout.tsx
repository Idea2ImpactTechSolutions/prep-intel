"use client";
import Image from "next/image";
import Link from "next/link";
import RecruiterTabs from "./shared/recruiter-tabs";
import { FaBell } from "react-icons/fa";
import { IoPersonCircle } from "react-icons/io5";
import { usePathname } from "next/navigation";


export default function Layout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    return (
        <main className="font-sans">
            <nav className={`bg-panel border-b`}>
                <div className="pi-container flex flex-col items-center md:flex-row md:items-center md:justify-between">
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
                    {pathname?.includes('/profile/') ? <div className="flex mt-4 md:mt-0 px-6"></div> : <div className="flex mt-4 md:mt-0 px-6">
                      <RecruiterTabs />
                      <IoPersonCircle size="1.5em" className="mx-4 w-8" />
                      <FaBell  size="1.2em" className="w-4 mt-[2px]" />
                    </div>}
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
