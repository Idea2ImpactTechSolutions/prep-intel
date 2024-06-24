import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import moment from "moment";

interface Props extends React.HTMLAttributes<HTMLElement> {
    profileImage: string | React.ReactNode;
    from: string | ReactNode;
    className?: string;
    sentAt: string;
    children: ReactNode;
}

export function MessageRow({profileImage, from, className, sentAt, children, ...rest}: Props) {
  return (
  <div className={cn("mb-5 flex items-start", className)} {...rest}>
    <div className="w-8 h-8 mr-3 flex items-center justify-center overflow-hidden rounded-full bg-gray-200">
      {profileImage}
    </div>
    <div className="flex flex-col">
      <div className="flex items-center">
        <span className="font-semibold capitalize mr-2">{from}</span>
        <span className="text-xs text-gray-500">{moment(sentAt).format('MMM D, h:mm A')}</span>
      </div>
      {children}
    </div>
  </div>)
}
