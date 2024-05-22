"use client"
import { Button } from "@/components/ui/button";
import { Space_Grotesk } from "next/font/google";
import { cn } from "@/lib/utils";
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"] });

type OnboardingFooterType = {
    prevPageHandler: () => void,
    nextPageHandler: () => void,
    nextBtnLabel?: string,
    preventGoBack?: boolean,
    loading?: boolean
}

export default function OnboardingFooter({prevPageHandler, nextPageHandler, nextBtnLabel, preventGoBack = true, loading = false}: OnboardingFooterType) {
    return (
        <div className="pt-8 flex gap-x-6 items-center justify-end h-[4rem]">
            <Button
                type="button"
                variant="outline"
                onClick={prevPageHandler}
                className={cn(
                    spaceGrotesk.className,
                    "p-5 px-8 border border-gray-300 text-gray-400",
                    !preventGoBack && "hover:bg-[#E3E3E3]/80 hover:border-[#E3E3E3] hover:text-[#141111]",
                    preventGoBack && "hover:bg-transparent hover:text-[#8E8E8E]"
                )}
                disabled={preventGoBack}
            >Back</Button>
            <Button
                type="button"
                variant="default"
                onClick={nextPageHandler}
                loading={loading}
                loadingText={nextBtnLabel ? nextBtnLabel : "Next Step"}
                disabled={loading}
                className={cn(
                    spaceGrotesk.className,
                    "bg-[#FEBB0E] text-[#141111] hover:bg-[#FEBB0E]/80"
                )}
            >
               {nextBtnLabel ? nextBtnLabel : 'Next Step'}
            </Button>
        </div>
    )
}
