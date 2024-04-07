"use client"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SlidersHorizontal } from "lucide-react";
import React, { useEffect, useState } from "react";

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
  setSearchData:(data)=> void,
  data: any
} 

const Header = ({title, users, data, setSearchData}:HeaderProps) => {
  const [sortOrder, setSortOrder] = React.useState<boolean>(false)
  const [showPanel, setShowPanel] = React.useState<boolean>(false)

  const [sortBy, setSortBy] = useState(null);

  // Function to filter data based on search text
  const searchedData =(values:any)=>{
    let searchedValues = users?.filter(item =>
      Object.values(item)?.some(value =>
        typeof value === 'string' && value.toLowerCase().includes(values?.toLowerCase())
        || typeof value === 'number' && value.toString().includes(values)
      )
    );
    setSearchData(searchedValues)
  }

  // Function to handle sorting option selection
  const handleSortChange = (option:any) => {
    setSortOrder(prev => prev = !prev)
    if (sortBy === option) {
      setSortBy(null);
    } else {
      setSortBy(option); 
    }
  };

  // Function to sort the array based on a specific key
  const sortByKey = (array: any[], key: string) => {
    const sortedArray = [...array].sort((a, b) => {
      const aValue = typeof a[key] === 'string' ? a[key].toLowerCase() : a[key];
      const bValue = typeof b[key] === 'string' ? b[key].toLowerCase() : b[key];
      if (sortOrder && key === sortBy) {
        return aValue - bValue;
      } else {
        return bValue - aValue;
      }
    });
    setSearchData(sortedArray);
  };

  return (
    <div className="flex lg:flex-row justify-between items-center mb-5">
      <h3 className="hidden md:flex md:text-[36px] font-bold">{title}</h3>  
      <div className="flex gap-x-4">
        <div className="w-full lg:w-[600px] ">
          <Input placeholder="Type to search" onChange={(e)=>searchedData(e.target.value)}/>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button> <SlidersHorizontal size={14} className="mr-2" />Filter & Sort</Button>
          </DropdownMenuTrigger>
          
          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuLabel>Sort By</DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuCheckboxItem
              checked={sortBy === 'SAT'}
              onCheckedChange={() => {
                handleSortChange('SAT')
                sortByKey(data, 'SAT')
              }}
            >
              SAT
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={sortBy === 'GPA'}
              onCheckedChange={() => {
                handleSortChange('GPA')
                sortByKey(data, 'GPA')
              }}
            >
              GPA
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={sortBy === 'ACT'}
              onCheckedChange={() => {
                handleSortChange('ACT')
                sortByKey(data, 'ACT')
              }}
            >
              ACT
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
