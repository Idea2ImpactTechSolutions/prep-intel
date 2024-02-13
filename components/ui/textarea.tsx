import * as React from "react"

import { cn } from "@/lib/utils"
import { Label } from "./label"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  labelClass?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, labelClass, ...props }, ref) => {
    return (
      <div>
       {label && <Label htmlFor='' className={cn(
          "inline-block",
          labelClass
        )}>{label}</Label>}
        <textarea
          className={cn(
            "flex min-h-[40px] w-full rounded-[4px] border border-gray-300 bg-background px-3 py-2 text-sm ring-offset-backgroun file:border-0 file:bg-transparent file:text-base file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring- focus-visible:border-primary focus-visible:ring-primar focus-visible:ring-offset- disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
