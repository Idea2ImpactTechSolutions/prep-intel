import { cn } from "@/lib/utils"

type SectionContainerType = {
    title?: string,
    subTitle?: string
    children: React.ReactElement,
    className?: string,
    titleClass?: string,
    subTitleClass?: string,
}

export default function SectionContainer({ title, subTitle, className, titleClass, subTitleClass, children }: SectionContainerType) {
    return (
        <div className={cn(
            className
        )}>
            <h1 className={cn(
                "font-semibold text-md md:text-xl md:font-bold mb-4",
                titleClass
            )}>{title}</h1>
            <span className={cn(
                "text-xs",
                subTitleClass
            )}>{subTitle}</span>
            {children}
        </div>
    )
}
