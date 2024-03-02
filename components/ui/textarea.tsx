import * as React from "react"

import { cn } from "@/lib/utils"
import { Label } from "./label"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  labelClass?: string;
  id?: string,
  name?: string,
  value?: string,
  handleBlur?: (event: any) => void,
  onChange?: (event: any) => void,
  touched?: any,
  error?: any
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, labelClass, id, name, onChange, error, value, touched, handleBlur, ...props }, ref) => {
    return (
      <div>
        {label && <Label htmlFor='' className={cn(
          "inline-block",
          labelClass
        )}>{label}</Label>}
        <textarea
          onBlur={handleBlur}
          onChange={onChange}
          id={id}
          name={name}
          value={value}
          className={cn(
            "flex min-h-[40px] w-full rounded-[4px] border border-gray-300 bg-background px-3 py-2 text-sm ring-offset-backgroun file:border-0 file:bg-transparent file:text-base file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring- focus-visible:border-primary focus-visible:ring-primar focus-visible:ring-offset- disabled:cursor-not-allowed disabled:opacity-50",
            className,
            error && touched && 'border-red-500',
          )}
          ref={ref}
          {...props}
        />
        <span className={cn(
          "text-xs text-red-500 hidden",
          error && 'block'
        )}>{error && touched && error}</span>
      </div>
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
