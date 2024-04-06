"use client"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SlidersHorizontal } from "lucide-react";
import React from "react";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


interface HeaderProps {
  title?: string;
  
}

const Header = ({title}:HeaderProps) => {

  const [showStatusBar, setShowStatusBar] = React.useState<boolean>(true)
  const [showActivityBar, setShowActivityBar] = React.useState<boolean>(false)
  const [showPanel, setShowPanel] = React.useState<boolean>(false)


  return (
    <div className="flex lg:flex-row justify-between items-center mb-5">
      <h3 className="hidden md:flex md:text-[36px] font-bold">{title}</h3>  
      <div className="flex gap-x-4">
        <div className="w-full lg:w-[600px] ">
          <Input placeholder="Type to search"/>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button> <SlidersHorizontal size={14} className="mr-2" />Filter & Sort</Button>
          </DropdownMenuTrigger>
          
          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuLabel>Sort By</DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuCheckboxItem
              checked={showPanel}
              onCheckedChange={setShowPanel}
            >
              ACT
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={showStatusBar}
              onCheckedChange={setShowStatusBar}
            >
              GPA
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={showPanel}
              onCheckedChange={setShowPanel}
            >
              SAT
            </DropdownMenuCheckboxItem>

            <DropdownMenuSeparator />
            <DropdownMenuLabel>Filter By</DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuCheckboxItem
              checked={showPanel}
              onCheckedChange={setShowPanel}
            >
              SAT
            </DropdownMenuCheckboxItem>
            
          </DropdownMenuContent>
        </DropdownMenu>
      </div>    
    </div>
  );
};

export default Header;
