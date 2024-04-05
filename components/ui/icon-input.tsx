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
    icon: React.ReactElement,
    error?: any
  }

const IconInput  = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, labelClass, id, name, isRequired, onChange, error, value, touched, handleBlur, icon:srcIcon, ...props }, ref) => {

    const icon = React.cloneElement(srcIcon, {
      className: 'pointer-events-none absolute top-1/2 transform -translate-y-1/2 left-3',
    });

    return (
      <div className="mb-3">
      {label && <label htmlFor={label} className={cn(
        "block font-normal text-[.8rem] pb-1",
        labelClass
      )}> {label}{isRequired && <span className="text-red-500 text-lg">*</span>} </label>}

      <label className="relative block m-0  text-gray-400 focus-within:text-gray-600 ">
        { icon }
        <input
                type={type}
                onBlur={handleBlur}
                onChange={onChange}
                id={id}
                name={name}
                value={value}
                className={cn(
                  "flex h-10 w-full rounded-[4px] border border-gray-300 bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-base file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring- focus-visible:border-primary focus-visible:ring-primary focus-visible:ring-offset- disabled:cursor-not-allowed disabled:opacity-50",
                  "px-3 pl-8",
                  className,
                  error && touched && 'border-red-500',
                )}
                ref={ref}
                {...props}
              />
      </label>




      <span className={cn(
              "text-xs text-red-500 hidden",
              error &&  'block'
            )}>{error && touched && error}</span>
      </div>
    )
  }
)
IconInput.displayName = "IconInput"

export { IconInput }
