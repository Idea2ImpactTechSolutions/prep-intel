import {
    AlertDialog,
    AlertDialogContent
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface CustomModalProps {
    title?: string | React.ReactNode;
    show: boolean;
    hasCloseButton?: boolean;
    handleClose?: () => void;
    children?: React.ReactNode;
    modalClass?: string
    modalTitleStyle?: string
}

export default function CustomModal({ show, handleClose, children, modalClass, hasCloseButton = false, title, modalTitleStyle}: CustomModalProps) {
    return (
        <>
            <AlertDialog 
                open={show}
            >
                <AlertDialogContent
                    className={cn(
                        "md:w-[27rem] pt-4 px-5 mx-auto gap-y-0",
                        modalClass
                    )}
                >
                    <div className="flex justify-between items-center">
                        <h2 className={cn(
                            "text-[24px] font-bold pb-0",
                            modalTitleStyle
                        )}
                        >
                            {title}
                        </h2>
                        {hasCloseButton && <span className="absolute right-4 top-4 cursor-pointer border-2 border-[#8F8F8F] p-[.15rem] rounded-lg text-[#8F8F8F]"
                                onClick={handleClose}
                            ><X width={14} height={14}/></span>}
                    </div>

                    {children}

                </AlertDialogContent>
            </AlertDialog>
        </>

    )
}