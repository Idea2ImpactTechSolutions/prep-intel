
interface SingleStatProps {
    title: string,
    value: string
}

export default function SingleStat({title, value}: SingleStatProps) {
    return (
        <div className="bg-[#F0F4F7] rounded-md flex flex-col gap-2 items-center p-5">
            <span className="text-sm">{title}</span>
            <h3 className="text-[#000000] font-medium lg:text-2xl">{value}</h3>
        </div>
    )
}
