"use client"
import OnboardingFooter from "@/app/student/_components/onboarding-footer";
import CustomCheckbox from "@/components/custom-checkbox";
import SectionContainer from "@/components/section-container";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { POPULAR_UNIVERSITIES, UNIVERSITIES_NEAR_BY } from "../data";
import OnboardingTabs from "../../_components/onboarding-tabs";
import OnboardingTitle from "../../_components/onboarding-title";
import { cn } from "@/lib/utils";
import { Space_Grotesk } from "next/font/google";
import { LucideSearch } from "lucide-react";
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"] });

export default function SchoolPage() {
    const router = useRouter()

    return (
        <>
            <OnboardingTabs active_step="Schools" />
            <div className="overflow-y-auto pb-32 h-[calc(100vh_-_10rem)]">
                <OnboardingTitle
                    title="Choose the University you are interested in"
                    subtitle="Where Will Your Curiosity Take You?"
                />
                <div className="mt-10">
                    <form>
                        <div className="flex-1 px-6 md:px-12 lg:px-20">
                            <SectionContainer
                                title="Your Interested University"
                                subTitle="Search and Choose your Interested University"
                                titleClass={cn(
                                    spaceGrotesk.className,
                                    "mb-0"
                                  )}
                            >
                                <div className="pt-6">
                                   <div className="relative">
                                   <Input
                                        label="Search Schools"
                                        placeholder="Search"
                                        className="rounded-lg p-[1.4rem] pl-8 placeholder:text-[#AAAAAA]"
                                    />
                                    <LucideSearch width={15} height={15} className="text-[#AAAAAA]  top-10 left-3 absolute"/>
                                   </div>
                                    <SectionContainer
                                        className="my-6"
                                        title="Popular university"
                                        titleClass="mb-1 md:text-sm"
                                    >
                                        <>
                                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-x-8">
                                                {
                                                    POPULAR_UNIVERSITIES.map(({ id, name }) => (
                                                        <CustomCheckbox
                                                            key={id}
                                                            id={id}
                                                            label={name}
                                                            hasBorder
                                                            className="rounded-lg p-[1.4rem"
                                                        />
                                                    ))
                                                }
                                            </div>
                                        </>
                                    </SectionContainer>

                                    <SectionContainer
                                        className="my-6"
                                        title="Near You"
                                        titleClass="mb-1 md:text-sm"
                                    >
                                        <>
                                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-x-8">
                                                {
                                                    UNIVERSITIES_NEAR_BY.map(({ id, name }) => (
                                                        <CustomCheckbox
                                                            key={id}
                                                            id={id}
                                                            label={name}
                                                            hasBorder
                                                            className="rounded-lg p-[1.4rem"
                                                        />
                                                    ))
                                                }
                                            </div>
                                        </>
                                    </SectionContainer>

                                    <CustomCheckbox
                                        label="I am undecided on what school"
                                        id="undecided"
                                        hasBorder
                                        className="rounded-lg p-[1.4rem"
                                    />
                                </div>
                            </SectionContainer>
                        </div>
                        <OnboardingFooter
                            prevPageHandler={() => router.push('/student/onboarding/vitals')}
                            nextPageHandler={() => router.push('/student/onboarding/majors')}
                            preventGoBack={false}
                        />
                    </form>
                </div>
            </div>
        </>
    )
}
