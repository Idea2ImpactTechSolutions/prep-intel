import { cn } from "@/lib/utils";

type ProfileCreationProgressType = {
    progressValue: number,
    step: number
}

export default function ProfileCreationProgress({ progressValue, step }: ProfileCreationProgressType) {

    return (
        <div className="p-2 px-4 flex items-center justify-between bg-[#F0F4F7] rounded-[6px] md:w-[25rem]">
            <h2 className="hidden text-primary font-medium text-xs md:block md:text-[0.8rem]">School Profile Completion</h2>
            <div className="flex items-center gap-x-4">
                <h1 className="font-bold text-primary italic md:text-2xl">{progressValue}<span className="font-medium md:text-xl">%</span></h1>
                <div className={cn(
                    "w-7 h-7 border-[3px] border-gray-200 rounded-full grid place-content-center relative after:w-7 after:h-7 after:absolute after:rounded-full after:-top-1 after:-left-1 after:border-[3px] after:border-t-primary",
                    step === 1 && "after:rotate-[125deg]"
                )}>
                    <span className="text-primary font-medium text-[0.6rem]">{`${step}/5`}</span>
                </div>
            </div>
        </div>
    )
}
