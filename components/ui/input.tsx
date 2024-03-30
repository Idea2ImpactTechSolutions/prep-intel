import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string,
    labelClass?: string,
    isRequired?: boolean,
    id?: string,
    name?: string,
    value?: string,
    handleBlur?: (event: any) => void,
    onChange?: (event: any) => void,
    touched?: any,
    error?: any
  }

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, labelClass, id, name, isRequired, onChange, error, value, touched, handleBlur, ...props }, ref) => {
    return (
      <div className="mb-3">
      {label && <label htmlFor={label} className={cn(
        "block font-normal text-[.8rem] pb-1",
        labelClass
      )}> {label}{isRequired && <span className="text-red-500 text-lg">*</span>} </label>}
      <input
        type={type}
        onBlur={handleBlur}
        onChange={onChange}
        id={id}
        name={name}
        value={value}
        className={cn(
          "flex h-10 w-full rounded-[4px] border border-gray-300 bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-base file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring- focus-visible:border-primary focus-visible:ring-primar focus-visible:ring-offset- disabled:cursor-not-allowed disabled:opacity-50",
          className,
          error && touched && 'border-red-500',
        )}
        ref={ref}
        {...props}
      />
      <span className={cn(
              "text-xs text-red-500 hidden",
              error &&  'block'
            )}>{error && touched && error}</span>
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
