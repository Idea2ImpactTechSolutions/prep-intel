import CompletionPanel from "@/components/completion-panel";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import SchoolTabs from "../profile/shared/school-tabs";

export const metadata: Metadata = {
    title: "Prep Intel | Student Onboarding",
    description: 'Some description here'
}

export default function Page({ children }: { children: React.ReactNode }) {
    return (
        <main className="font-sans">
            <nav className={`bg-panel p-2 border-b md:px-6 lg:px-6`}>
                <div className="container p-2 px-6 flex flex-col items-center md:flex-row md:items-center md:justify-between">
                    <Link
                        href="/login"
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
                        <SchoolTabs />

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
