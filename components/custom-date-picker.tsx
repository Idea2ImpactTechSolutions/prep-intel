import DatePicker from "react-multi-date-picker";
import { Label } from "./ui/label";
import { cn } from "@/lib/utils";

type DatePickerType = {
    label?: string,
    labelClass?: string
    className?: string
}

export default function CustomDatePicker({label, labelClass, className}: DatePickerType) {
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
                inputClass="p-2.5 w-full border border-gray-300 text-sm rounded-[4px] focus:border-primary focus:outline-none"
                format="MM/DD/YYYY"
                containerStyle={{width: "100%"}}
                placeholder="MM/DD/YYYY"
            />
        </div>
    )
}
