import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
  } from "@/components/ui/alert-dialog"
  import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

  type AlertDialogType = {
    open: boolean,
    title?: string,
    loading?: boolean,
    description?: string,
    modalContentStyle?: string,
    descriptionStyle?: string,
    titleStyle?: string,
    loadingText?: string,
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "outlinePrimary" | "orange" | null | undefined,
    onClick: () => void,
    handleClose: () => void
  }

export default function ConfirmationModal({open, title, description: description, loading = false, modalContentStyle, titleStyle,descriptionStyle,variant, loadingText="Submitting", onClick, handleClose}:AlertDialogType) {
    return (
        <AlertDialog
            open={open}
        >
            <AlertDialogContent
                className={cn("w-[90%] mx-auto p-8 font-sans", modalContentStyle)}
            >
                <AlertDialogHeader>
                    <AlertDialogTitle className={cn("text-center text-[1.2rem]", titleStyle)}>{title}</AlertDialogTitle>
                    <AlertDialogDescription className={cn("text-[.9ren]", descriptionStyle)}>
                        {description}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="gap-y-4 md:gap-y-0 ">
                    <Button
                        onClick={handleClose}
                        variant="outline"
                        disabled={loading}
                    >Close</Button>
                    <Button
                        onClick={onClick}
                        loading={loading}
                        loadingText={loadingText}
                        disabled={loading}
                        variant={variant? variant:"default"}
                    >
                        Continue
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
