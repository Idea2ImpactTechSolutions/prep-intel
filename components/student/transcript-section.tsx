import { CircleAlert, FileQuestion } from 'lucide-react'
import { TranscriptsList } from '../transcript-list'

export default function TranscriptSection(userId="123"){
    return (
        <div className='w-full shadow-sm mt-6 rounded-xl border overflow-hidden'>
            <div className="bg-[#F6F8FA] w-full flex items-center gap-x-2 pl-8 py-3 rounded-t-xl border-b">
                <h2 className="text-md font-bold">Transcript</h2>
                <CircleAlert width={17} height={17} />
            </div>
            <div className='bg-white'>
                <TranscriptsList userId={userId} />
            </div>
        </div>
    )
}
