import { formatPhoneNumber } from "@/app/config/helpers";
import { cn } from "@/lib/utils";
import { /*Globe,*/ CircleUserRound, Mail, Phone } from "lucide-react";
import { Space_Grotesk } from "next/font/google";
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"] });

interface SingleRecruiterCardProps {
  imgUrl: string,
  name: string,
  school_name: string,
  school_state: string,
  school_email: string,
  phone: string,
  email: string,
}

export default function SingleRecruiterCard({ imgUrl, name, school_name, school_state, school_email, phone, email}: SingleRecruiterCardProps) {
  return (
    <div className="w-full sm:w-[19rem rounded-[12px] p-5 bg-white card-shadow">
      <div className="border-b border-[#E9E9EA]">
        <div className="flex gap-4 items-center">
          { imgUrl ? <img
              src={imgUrl}
              alt="avatar"
              className="w-12 h-12 rounded-full object-cover"
            /> : <CircleUserRound className="text-gray-600" size={60}/>
          }
          <div className="flex flex-col gap-y-[.1rem]">
            <span className={cn(
              "font-semibold text-[1rem] text-[#141111]",
              spaceGrotesk.className
            )}>{name}</span>
            <span className="text-xs text-[#757575] font-normal">{school_name}</span>
          </div>
        </div>
        <div className="py-4 flex justify-between">
          <div className="flex flex-col">
            <span className="pb-1 text-xs text-[#141111] font-normal"> State </span>
            <div className="flex gap-1">
              <img
                src="/images/logo/usa-icon.png"
                alt="avatar"
                className="w-4"
              />
              <span className="text-xs text-[#757575] font-light">{school_state}</span>
            </div>
          </div>
          {/* <div className="flex flex-col">
            <span className="pb-1 text-xs text-[#141111] font-normal"> Application Deadline </span>
            <span className="text-xs text-[#757575] font-light">6/15/2023</span>
          </div> */}
        </div>
      </div>
      <div className="py-4">
        <div className="flex gap-2">
          <span><Phone width={16} height={16} className="text-xs text-[#757575]" /></span>
          <span className="text-xs text-[#141111] font-normal">{formatPhoneNumber(phone)}</span>
        </div>
        <div className="mt-3 flex gap-2">
          <span><Mail width={16} height={16} className="text-xs text-[#757575]" /></span>
          <span className="text-xs text-[#141111] font-normal">{email}</span>
        </div>
        {/*
        Disable fake school url for now
        <div className="mt-3 flex gap-2">
          <span><Globe width={16} height={16} className="text-xs text-[#757575]" /></span>
          <span className="text-xs text-[#141111] font-normal">uf.com</span>
        </div>
         */}
        {/* <div className="mt-5 flex flex-col">
        <span className="pb-1 text-xs text-[#141111] font-normal"> Personal Statement </span>
        <span className="text-xs text-[#757575] font-light">Did you know that the University of Alabama is often referred to as “The Capstone” by alumni and friends of the university? </span>
      </div> */}
      </div>
    </div>
  )
}
