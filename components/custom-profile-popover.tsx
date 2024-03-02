import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { LucideUser, LucideUserCircle } from "lucide-react";
import { Button } from "./ui/button";
import  Cookies from 'js-cookie';
import { useAppDispatch } from "@/redux/store";
import { reset } from "@/redux/features/auth/authSlice";
import { signOut } from "next-auth/react";
import { managerReset } from "@/redux/features/school/managerSlice";

interface CustomProfilePopoverProps {
    show: boolean;
    handleClose?: () => void;
}

export default function CustomProfilePopover({ show, handleClose }: CustomProfilePopoverProps) {

    const dispatch = useAppDispatch()

    const handleLogout = () => {
        signOut()
        dispatch(managerReset());
        // Cookies.remove("token");
        // dispatch(reset());
        // window.location.href = "/login";
    }

    return (
        <Popover
            open={show}
        >
            <PopoverTrigger></PopoverTrigger>
            <PopoverContent
                className="p-5 w-40"
                align="end"
            >
                <div className="flex flex-col">
                    <span className="text-xs border-b border-gray-100 pb-2 flex  gap-1 items-center text-gray-00"><LucideUserCircle width={15} height={15} /> <span> Welcome! admin</span> </span>
                    <div className="mt-2 flex flex-col">
                        <span className="p-1 pl-4 cursor-pointer rounded-sm text-xs text-gray-700 w-fit px-4 hover:bg-gray-100">Profile</span>
                        <Button
                            className="mt-1 text-xs bg-red-500 text-gray-100 text-left w-fit h-6 hover:bg-red-400 focus:border-none focus:outline-none focus:ring-0 focus:appearance-none"
                            onClick={handleLogout}
                        >Logout</Button>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}
