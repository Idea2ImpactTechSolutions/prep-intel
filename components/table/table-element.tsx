import { cn } from "@/lib/utils"

interface TRProps {
    children: React.ReactNode
    className?: string

}

interface TDProps {
    children: React.ReactNode
    className?: string

}

interface TBodyProps {
    children: React.ReactNode
}

const TBODY = ({children}:TBodyProps) => (
    <tbody>{children}</tbody>
)

const TR = ({children, className}:TRProps) => (
    <tr className={cn(
        'bg-white border-b border-[#E6EBF0] hover:bg-gray-50',
        className
    )}>{children}</tr>
)

const TD = ({children, className}:TDProps) => (
    <td className={cn(
        'w-4 p-4',
        className
    )}>{children}</td>
)



export {TR, TD, TBODY}

 