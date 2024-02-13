import { cn } from "@/lib/utils"

type SectionContainerType = {
    title?: string,
    children: React.ReactElement,
    className?: string,
    titleClass?: string
}

export default function SectionContainer({ title, className, titleClass, children }: SectionContainerType) {
    return (
        <div className={cn(
            className
        )}>
            <h1 className={cn(
                "font-semibold text-md md:text-xl md:font-bold mb-4",
                titleClass
            )}>{title}</h1>
            {children}
        </div>
    )
}
