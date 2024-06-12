
interface SingleStatProps {
    title: string,
    value: string
}

export default function SingleStat({title, value}: SingleStatProps) {
    return (
        <div className="border rounded-md flex flex-col gap-1 p-5">
            <h3 className="text-[#000000] font-medium lg:text-xl">{value}</h3>
            <span className="text-sm">{title}</span>
        </div>
    )
}
