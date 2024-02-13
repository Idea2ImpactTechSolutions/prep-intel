import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
  import { Button } from "@/components/ui/button"

  type AlertDialogType = {
    open: boolean,
    title?: string,
    loading?: boolean,
    discription?: string,
    onClick: () => void,
    handleClose: () => void
  }

export default function ConfirmationModal({open, title, discription, loading = false, onClick, handleClose}:AlertDialogType) {
    return (
        <AlertDialog
            open={open}
        >
            <AlertDialogContent 
                className="w-[90%] mx-auto p-8 font-sans"
            >
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-cente text-[1.2rem]">{title}</AlertDialogTitle>
                    <AlertDialogDescription className="text-[.9ren]">
                        {discription}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <Button 
                        onClick={handleClose}
                        variant="outline"
                    >Close</Button>
                    <Button 
                        onClick={onClick}
                        loading={loading}
                        loadingText="Submitting"
                        disabled={loading}
                    >
                        Continue
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
