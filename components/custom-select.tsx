import { cn } from "@/lib/utils"
import { Button } from "./ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { useRef, useState } from "react"
import { CheckIcon, ChevronsUpDown, SortAscIcon } from "lucide-react"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "./ui/command"
import { Label } from "./ui/label"
import { SelectGroup } from "./ui/select"
// import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons"

type CustomSelectType = {
    options: Record<string, any>[],
    selected: string,
    name?: string,
    label?: string,
    labelClass?: string,
    disabled?: boolean,
    setSelected: (event: any) => void,
    touched?: any,
    error: any
}

export default function CustomSelect({ options, selected, disabled, label, name, labelClass, setSelected, error, touched }: CustomSelectType) {
    const [open, setOpen] = useState(false)
    const buttonRef = useRef<HTMLButtonElement>(null)

    return (
        <div
            className="mt-1"
        >
            {label && <Label className={cn(
                "block mb-1",
                labelClass
            )}>{label}</Label>}
            <Popover
                open={open}
                onOpenChange={setOpen}
            >
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        name={name}
                        aria-expanded={open}
                        className={cn(
                            "w-full justify-between border-gray-300 text-gray-600 bg-background hover:bg-white hover:text-gray-600 focus:border-primary",
                            error && touched && "border-red-500"
                        )}
                        ref={buttonRef}
                        disabled={disabled}

                    >
                        {
                            selected ? options?.filter((option) => option?.value?.toString().toLowerCase() === selected?.toString().toLowerCase())[0]?.label : "Select..."
                        }
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0" style={{ width: `${buttonRef?.current?.offsetWidth}px` }}>
                    <Command className="">
                        <CommandInput
                            placeholder={`Search`}
                            className="h-9"
                        />
                        <CommandEmpty>No Record Found.</CommandEmpty>
                        <CommandGroup
                            className="h-56 overflow-y-scroll"
                        >
                            {options?.map((option) => (
                                <CommandItem
                                    key={option.value}
                                    value={option.value}
                                    onSelect={(currentValue) => {
                                        setSelected(currentValue)
                                        setOpen(false)
                                    }}
                                >
                                    {option.label}
                                    <CheckIcon
                                        className={cn(
                                            "ml-auto h-4 w-4",
                                            selected === option.value ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </Command>
                </PopoverContent>
                <span className={cn(
                        "text-xs text-red-500 hidden",
                        error && 'block'
                    )}>{error && touched && error}</span>
            </Popover>
        </div>
    )
}
