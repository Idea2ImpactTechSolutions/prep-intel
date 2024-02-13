import SectionContainer from "@/components/section-container";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import Link from "next/link";
import OnboardingTabs from "../_components/onboarding-tabs";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Prep Intel | Student Onboarding",
    description: 'Some discription here'
}

export default function StudentOnBoardingLayout({ children }: { children: React.ReactNode }) {
    return (
        <main className="overflow-y-scroll font-sans">
            <nav className={`p-4 border-b md:px-12 lg:px-20`}>
                <div className="flex flex-col items-center md:flex-row md:items-center md:justify-between">
                    <Link
                        href="/login"
                    >
                        <Image
                            src="/images/logo/logo.png"
                            className="md:hidden"
                            width={50}
                            height={50}
                            alt="logo"
                        />
                        <Image
                            src="/images/logo/logo.png"
                            className="hidden md:block"
                            width={65}
                            height={65}
                            alt="logo"
                        />
                    </Link>
                    <div className="flex w-[90%] overflow-x-scroll mt-4 md:w-[75vw] md:mt-0">
                        <OnboardingTabs />
                    </div>
                </div>
            </nav>
            <section className="md:flex">
            <div className="mt-6 md:mt-12 md:w-[calc(100vw_-_20rem)] lg:md:w-[calc(100vw_-_25rem)]"> 
            <div className="flex flex-col overflow-y-scroll lg:h-[calc(100vh_-_10rem)]">
               {children}
            </div>
            </div>

                <div className="hidden border-l w-[20rem] md:md:w-[15rem] md:block lg:w-[25rem]lg:h-[calc(100vh_-_7rem)]">
                    <SectionContainer
                        title="Your Profile"
                        titleClass="md:font-medium md:text-[1rem]"
                        className="p-5"
                    >
                        <>
                            <div className="flex flex-col mb-3">
                                <Label className="font-normal text-sm">First Name</Label>
                                <span className="font-normal">Taylor</span>
                            </div>
                            <div className="flex flex-col">
                                <Label className="font-normal text-sm">Last Name</Label>
                                <span className="font-normal">Smith</span>
                            </div>
                        </>
                    </SectionContainer>
                </div>
            </section>
        </main>
    )
}
