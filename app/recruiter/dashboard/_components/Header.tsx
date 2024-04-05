import { Input } from "@/components/ui/input";
import React from "react";

interface HeaderProps {
  title?: string;
  
}

const Header = ({title}:HeaderProps) => {
  return (
    <div className="flex flex-row justify-between items-center">
      <h3 className="">{title}</h3>  
      <div className="">
        div
        <Input placeholder="Type to search"/>
      </div>    
    </div>
  );
};

export default Header;
