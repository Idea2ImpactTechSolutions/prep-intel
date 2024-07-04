import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { User } from "lucide-react";
import { cn } from "@/lib/utils";
import { BiLogOut } from "react-icons/bi";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from 'react';
import { LucideLoader } from "lucide-react";
import {tabs} from "@/app/student/_components/onboarding-tabs";

const expandProfileMenu = true;

export interface Props
{
  sharedLogout: () => void;
}

export function UserProfileMenu ({sharedLogout}: Props){
    const session:any = useSession();
    const router = useRouter();
    const [loggingOff, setLoggingOff] = useState(false);
    const name = session?.data?.user?.firstName;

    function logoutUser(){
      setLoggingOff(true);
      sharedLogout();
    }

    function openProfilePage() {
      switch (session?.data?.user?.role) {
        case 'recruiter':
          router.push(`/recruiter/profile/personal-info`);
          break;
        case 'student':
          router.push(`/student/onboarding/vitals`);
          break;
        case 'admin':
          router.push('/admin/')
      }
    }

  const menuItem = "group hover:bg-gray-200 leading-none rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-violet9 data-[highlighted]:text-primary";
  const separator = "h-[1px] bg-gray-200 m-[5px]";

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <div>
          { loggingOff ? <span className="flex items-center m-0 p-0 text-blue-600 gap-0"> <span className="mr-1 animate-spin"><LucideLoader width={15} height={15} /></span></span>
              : <User className="w-4 h-4" />
          }
        </div>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          className="min-w-[220px] bg-white rounded-md p-[5px] shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.15),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade"
          sideOffset={5}
        >
          <DropdownMenu.Label className="pl-1 text-sm leading-[24px] text-gray">
            <div className="all-small-caps ml-0 text-gray-400">Account</div>
            <div>
              <div className="rounded-full w-[32px] h-[32px] mr-2 mb-1 mt-1 inline-flex items-center justify-center bg-orange-100">
                {name?.substr(0,1)}
              </div>
              <span>{name}</span>
            </div>

          </DropdownMenu.Label>
          <DropdownMenu.Separator className={separator} />
          {
            expandProfileMenu ? (
              <>
                <DropdownMenu.Label className="pl-1 text-sm leading-[24px] text-gray">
                  <div className="all-small-caps ml-0 text-gray-400">Profile</div>
                </DropdownMenu.Label>
                {
                  tabs.map(({ title, path}, index) => (
                    <DropdownMenu.Item  key={index} className={cn(menuItem, "pl-1")} onClick={() => router.push(path)}>
                      {title}
                    </DropdownMenu.Item>
                  ))
                }
              </> ) : (
                <DropdownMenu.Item className={cn(menuItem, "pl-1")} onClick={openProfilePage}>
                  <User className="w-4 h-4 mr-1" /> Profile
                </DropdownMenu.Item>
              )
          }

          <DropdownMenu.Separator className={separator} />
          <DropdownMenu.Item className={cn(menuItem, "pl-1")} onClick={logoutUser}>
            <BiLogOut className="w-4 h-4 mr-1" />Logout
          </DropdownMenu.Item>

        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};
export default UserProfileMenu;
