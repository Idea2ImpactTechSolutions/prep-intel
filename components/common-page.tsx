import { cn } from "@/lib/utils"
import { Space_Grotesk } from "next/font/google";
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"] });

type TitleProps = {
    title: string | React.ReactNode;
    subtitle?: string;
    rightContent?: React.ReactNode;
    titleClass?: string;
    className?: string;
    children?: React.ReactNode;
}

type ContentProps = {
  className?: string;
  children?: React.ReactNode;
}

export function PageHeading({title, subtitle, rightContent, titleClass, className, children}: TitleProps) {
  return (
    <>
    <section className={cn("pi-container flex items-center justify-between !bg-sky-100", className)}>
        <h2 className={cn("font-bold md:text-lg", spaceGrotesk.className, titleClass)}>
          {title}
          {
            subtitle &&
            <div className="flex flex-col text-xs font-normal">
                <span className="capitalize">{subtitle}</span>
            </div>
          }
        </h2>
        <div>{rightContent || children}</div>
    </section>
    {/* <hr className="border-t border-gray-300" /> */}
    </>
  )
}

export function PageContent({className, children}: ContentProps) {
  return (
    <div className={cn("pi-container mb-6 md:!mb-8 rounded-b-lg !bg-sky-50", className)}>
      {children}
    </div>
  )
}