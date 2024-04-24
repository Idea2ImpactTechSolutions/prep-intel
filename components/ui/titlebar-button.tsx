import React, { MouseEventHandler, ReactNode } from "react";
import { UserPlus } from "lucide-react";

interface ButtonProps {
  title: string;
  icon?: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

export function TitlebarButton({ onClick, icon, title }: ButtonProps) {
  function defaultIcon() {
    return <UserPlus width={14} height={14} className="mr-1" />;
  }
  return (
    <span
      onClick={onClick}
      className="inline-flex border border-primary text-primary text-xs p-2 px-4 ml-2 rounded-md cursor-pointer"
    >
      {icon ? icon : defaultIcon()}
      <span className="font-bold">{ title }</span>
    </span>
  );
}
