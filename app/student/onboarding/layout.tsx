import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Prep Intel | Student Onboarding",
    description: 'Some discription here'
}

export default function StudentOnBoardingLayout({ children }: { children: React.ReactNode }) {
    return (
        <main className="overflow-y-scroll font-sans">
            <div className="mx-auto md:w-[calc(100vw_-_10rem)] lg:w-[calc(100vw_-_10rem)] xl:w-[calc(100vw_-_25rem)]">
                <div className="flex flex-col">
                    {children}
                </div>
            </div>
        </main>
    )
}
