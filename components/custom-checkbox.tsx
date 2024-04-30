"use client"

import { cn } from "@/lib/utils"
import { Checkbox } from "./ui/checkbox"
import { LucideCheck } from "lucide-react"

type CustomCheckboxType = {
    id?: string,
    label?: string,
    labelClass?: string,
    hasBorder?: boolean,
    icon?: React.ReactElement,
    className?: string,
    checkboxClass?: string,
    disabled?: boolean,
    checked?: boolean,
    onClick?: () => void
}

export default function CustomCheckbox({ id, label, labelClass, hasBorder, icon, className, checkboxClass, disabled, checked, onClick }: CustomCheckboxType) {
    return (
        <label className={cn(
            "items-top flex space-x-2 items-center transition-all cursor-pointer hover:border-primary",
            hasBorder && 'border border-gray-300 p-3.5',
            className
        )}
            onClick={(e) => {
                e.stopPropagation()
                onClick && onClick()
            }}
        >
            <div className="flex-1 flex items-center space-x-2" >
                {/* <Checkbox id={id} className={checkboxClass} disabled={disabled} checked={checked} /> */}
                {/* <input type="checkbox" /> */}
                <span className={cn(
                    "peer h-4 w-4 rounded-sm border border-primary grid place-content-center",
                    checked && "bg-primary"
                )}>
                   {checked && <LucideCheck className="w-3 h-3 text-white font-bold"/>}
                </span>

                <div className="grid gap-1.5 leading-none">
                    <label
                        htmlFor={id}
                        className={cn(
                            "text-sm font-medium leading-none cursor-pointer  peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                            labelClass
                        )}
                    >
                        {label}
                    </label>
                </div>
            </div>
            {
                icon && <span className="text-gray-500">{icon}</span>
            }
        </label>
    )
}
