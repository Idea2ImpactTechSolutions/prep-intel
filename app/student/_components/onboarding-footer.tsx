"use client"
import { Button } from "@/components/ui/button";

type OnboardingFooterType = {
    prevPageHandler: () => void,
    nextPageHandler: () => void,
    nextBtnLabel?: string
}

export default function OnboardingFooter({prevPageHandler, nextPageHandler, nextBtnLabel}: OnboardingFooterType) {
    return (
        <div className="mt-16 flex items-center justify-between h-[4rem] bg-accent p-5 md:px-12 lg:px-20">
            <Button
                type="button"
                variant="outline"
                onClick={() => prevPageHandler()}
            >Back</Button>
            <Button
                type="button"
                variant="default"
                onClick={() => nextPageHandler()}
            >
               {nextBtnLabel ? nextBtnLabel : 'Next'}
            </Button>
        </div>
    )
}
