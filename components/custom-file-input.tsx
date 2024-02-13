import { cn } from "@/lib/utils";

// type FileInputEvent = React.ChangeEvent<HTMLInputElement> & {
//     target: {
//       files: FileList;
//     };
//   };

type CustomFileInputType = {
    handleFileChange?: (event: any) => void,
    handleFileDrop?: (event: any) => void,
    selectedFile?: File,
    className?: string,
    children: React.ReactNode
}
export default function CustomFileInput({handleFileChange, handleFileDrop, selectedFile, className, children}: CustomFileInputType) {
    return (
        <label className={cn(
            "cursor-pointer",
            className
        )}>
            <input
                type="file"
                onChange={handleFileChange}
                onDrop={handleFileDrop}
                className="hidden"
            />
            {children}
        </label>
    )
}
