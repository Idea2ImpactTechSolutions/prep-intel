import { cn } from "@/lib/utils"

type ClaimAccountProps = {
    title: string | React.ReactNode,
    rightContent?: React.ReactNode,
    titleClass?: string,
    className?: string,
}

export default function PageTitleContainer({title, rightContent, titleClass, className}: ClaimAccountProps) {

  return (
    <section className={cn(
      "p-4 flex items-center justify-between md:px-16 md:mt-4",
      className
    )}>
        <h2 className={cn(
          "font-bold md:text-lg",
          titleClass
        )}>{title}</h2>
        <div>{rightContent}</div>
    </section>
  )
}
