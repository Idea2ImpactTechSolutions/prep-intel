import { Space_Grotesk } from "next/font/google";
import { cn } from "@/lib/utils";
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"] });

interface OnboardingTitleProps {
    title: string,
    subtitle: string,
    visible: boolean,
}

export default function OnboardingTitle({ title, subtitle, visible=true }: OnboardingTitleProps) {
  return (
    visible && <div className="text-center mb-12">
        <h2 className={cn(
          spaceGrotesk.className,
          "font-semibold text-xl md:text-2xl"
        )}>{title}</h2>
        <p className="text-xs text-[#757575] md:text-sm">{subtitle}</p>
      </div>
  )
}
