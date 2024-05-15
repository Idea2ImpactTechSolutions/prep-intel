import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Prep Intel | Student Onboarding",
    description: 'Some discription here'
}

export default function StudentOnBoardingLayout({ children }: { children: React.ReactNode }) {
    return (
        <main className="font-sans">
          <div className="flex flex-col bg-sdddlate-100 p-0">
              {children}
          </div>
        </main>
    )
}
