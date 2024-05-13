import {
  Sheet,
  SheetContent,
  SheetTitle
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"

interface SheetPanelProps {
  show: boolean,
  closeOnClickOutside?: boolean,
  children: React.ReactNode,
  title: string,
  handleClose: () => void,
  width?: number,
  sheetContentStyle?: string,
}

export default function SheetPanel({ show, title, children, handleClose, width, closeOnClickOutside = false, sheetContentStyle}: SheetPanelProps) {
  

  return (
      <>
          <Sheet
              open={show}
          >
              <SheetContent
              className={cn(``, sheetContentStyle)}
              style={{maxWidth: `${width}px`}}
              onPointerDownOutside={() => closeOnClickOutside && handleClose()}
              side="customRight"
              >
                  <div className="flex justify-between items-center relative lg:mx-5">
                      <SheetTitle className="text-xl">{title}</SheetTitle>
                      <span className=" w-8 h-8 border border-[#EA8072] rounded-[7.92px] grid place-content-center text-[#A71200] cursor-pointer"
                          onClick={handleClose}
                      ><X className="h-4 w-4" /></span>
                  </div>
                  {children}
              </SheetContent>
          </Sheet>
      </>
  )
}