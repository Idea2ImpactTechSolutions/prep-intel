import { Space_Grotesk } from "next/font/google";
import { cn } from "@/lib/utils";
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"] });

interface OnboardingTitleProps {
    title: string,
    subtitle: string
}

export default function OnboardingTitle({ title, subtitle }: OnboardingTitleProps) {
  return (
    <div className="text-center">
        <h2 className={cn(
          spaceGrotesk.className,
          "font-semibold text-xl md:text-2xl"
        )}>{title}</h2>
        <p className="text-xs text-[#757575] md:text-sm">{subtitle}</p>
      </div>
  )
}
