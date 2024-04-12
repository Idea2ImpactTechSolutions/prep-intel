import { cn } from '@/lib/utils'
import { LucideCheck } from 'lucide-react'
import React from 'react'

interface CheckPassedProps {
    checked?: boolean
}

export default function CheckPassed({checked}: CheckPassedProps) {
  return (
    <div  className={cn(
        "grid place-content-center text-[#767676] text-sm w-4 h-4 border rounded-sm",
        checked && "bg-primary text-white"
    )}> <span className="w-4 h-4 grid place-content-center p-1"><LucideCheck width={11} height={11} /> </span> </div>
  )
}
