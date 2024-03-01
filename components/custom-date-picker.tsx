import DatePicker from "react-multi-date-picker";
import { Label } from "./ui/label";
import { cn } from "@/lib/utils";

type DatePickerType = {
    label?: string,
    labelClass?: string
    className?: string,
    selected?: string, 
    value?: string,
    handleChange: (event: any) => void,
    onOpenPickNewDate?: false,
    touched?: any,
    error?: any,
}

export default function CustomDatePicker({label, labelClass, className, touched, error, value, onOpenPickNewDate = false, selected, handleChange}: DatePickerType) {
    return (
        <div className={cn(
            "mt-1",
            className
            )}>
           {label && <Label className={cn(
            "block mb-1",
            labelClass
           )}>{label}</Label>}
            <DatePicker
                className="custom-calendar mb-4 md:mb-6"
                inputClass={cn(
                    "p-2.5 w-full border border-gray-300 text-sm rounded-[4px] focus:border-primary focus:outline-none",
                    error && "border-red-500"
                )}
                format="MM/DD/YYYY"
                containerStyle={{width: "100%"}}
                onOpenPickNewDate={onOpenPickNewDate}
                value={value ? new Date(value) : ""}
                placeholder="MM/DD/YYYY"
                onChange={handleChange}
            />
            <span className={cn(
              "text-xs text-red-500 hidden",
              error &&  'block'
            )}>{error && touched && error}</span>
        </div>
    )
}
