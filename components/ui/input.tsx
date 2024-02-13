import * as React from "react";

import { cn } from "@/lib/utils";
import { Label } from "./label";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  labelClass?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, labelClass, ...props }, ref) => {
    return (
      <div>
        <Label htmlFor='email' className={cn(
          "inline-block",
          labelClass
        )}>{label}</Label>
        <input
          type={type}
          className={cn(
            "flex h-10 w-full rounded-[4px] border border-gray-300 bg-background px-3 py-2 text-sm ring-offset-backgroun file:border-0 file:bg-transparent file:text-base file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring- focus-visible:border-primary focus-visible:ring-primar focus-visible:ring-offset- disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
