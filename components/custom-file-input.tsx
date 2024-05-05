import { cn } from "@/lib/utils";
import { LucideLoader } from "lucide-react";

// type FileInputEvent = React.ChangeEvent<HTMLInputElement> & {
//     target: {
//       files: FileList;
//     };
//   };

type CustomFileInputType = {
    handleFileChange: (event: any) => void,
    handleFileDrop?: (event: any) => void,
    selectedFile?: File,
    className?: string,
    children: React.ReactNode,
    touched?: any,
    error?: any,
    uploading?: boolean,
    disabled?: boolean
    accept?: string,
}
export default function CustomFileInput({ handleFileChange, handleFileDrop, selectedFile, className, children, uploading = false, disabled = false, accept = "image/png, image/jpg, image/jpeg" }: CustomFileInputType) {
    const onFileChange = (file: HTMLInputElement) => {
        handleFileChange(file);
    }
    return (
        <label className={cn(
            "cursor-pointer flex flex-col items-center justify-center",
            className
        )}>
            <input
                type="file"
                accept={accept}
                onChange={(e: any) => onFileChange(e.target.files[0])}
                onDrop={handleFileDrop}
                className="hidden"
                disabled={disabled}
            />
            {children}
            {uploading && <span className="flex items-center mt-1 text-blue-600"> <span className="mr-1 animate-spin"><LucideLoader width={15} height={15} /></span> <span className="text-sm"> uploading</span></span>}
        </label>
    )
}
