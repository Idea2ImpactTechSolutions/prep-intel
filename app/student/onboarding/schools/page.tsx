"use client"
import OnboardingFooter from "@/app/student/_components/onboarding-footer";
import CustomCheckbox from "@/components/custom-checkbox";
import SectionContainer from "@/components/section-container";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { POPULAR_UNIVERSITIES, UNIVERSITIES_NEAR_BY } from "../data";

export default function SchoolPage() {
    const router = useRouter()

    return (
        <form>
            <div className="flex-1 px-6 md:px-12 lg:px-20">
                <SectionContainer
                    title="Where are you interested in Going?"
                >
                    <>
                        <Input
                            label="Search Schools"
                            placeholder="ex. University of Oklahoma"
                        />
                        <SectionContainer
                            className="my-6"
                            title="Popular"
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
                        />
                    </>
                </SectionContainer>
            </div>
            <OnboardingFooter
                prevPageHandler={() => router.push('/student/onboarding/vitals')}
                nextPageHandler={() => router.push('/student/onboarding/majors')}
            />
        </form>
    )
}
