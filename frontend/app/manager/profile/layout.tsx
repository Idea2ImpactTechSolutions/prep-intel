import CompletionPanel from "@/components/completion-panel";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Prep Intel | Student Onboarding",
    description: 'Some description here'
}

export default function StudentOnBoardingLayout({ children }: { children: React.ReactNode }) {
    return (
        <main className="font-sans">
            <nav className={`bg-panel p-2 border-b md:px-6 lg:px-6`}>
                <div className="flex flex-col items-center md:flex-row md:items-center md:justify-between">
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
                    { <div className="flex w-[90%] mt-4 md:w-[75vw] md:mt-0">
                        <a href="/manager/profile/academic-info">Academic</a> &nbsp; | &nbsp;
                        <a href="/manager/profile/school-profile">Profile</a>

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
