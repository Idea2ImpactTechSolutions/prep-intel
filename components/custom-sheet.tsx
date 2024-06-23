import {
  Sheet,
  SheetContent,
  SheetTitle
} from "@/components/ui/sheet"
import { X } from "lucide-react"

interface SheetPanelProps {
  show: boolean,
  closeOnClickOutside?: boolean,
  children: React.ReactNode,
  title: string | React.ReactNode,
  handleClose: () => void,
  width?: number,
  sheetContentStyle?: string,
}

export default function SheetPanel({ show, title, children, handleClose, width, closeOnClickOutside = false, sheetContentStyle}: SheetPanelProps) {
  

  return (
    <Sheet open={show}>
      <SheetContent
        className="flex flex-col gap-0"
        style={{maxWidth: `450px`}}
        onPointerDownOutside={handleClose}
        side="customRight"
        >
        <div className="flex justify-between items-center relative px-4 py-2 bg-gray-100">
            <SheetTitle className="text-xl">{title}</SheetTitle>
            <span className=" w-8 h-8 border rounded-[7.92px] grid place-content-center text-[#A71200] cursor-pointer"
                onClick={handleClose}
            ><X className="h-4 w-4" /></span>
        </div>
        <div className="p-4 flex-grow">
          {children}
        </div>
      </SheetContent>
    </Sheet>
  )
}