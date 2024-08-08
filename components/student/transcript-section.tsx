import { CircleAlert } from 'lucide-react'
import { TranscriptsList } from '../transcript-list'

interface Props {
  userId: string;
}

export default function TranscriptSection({ userId }: Props) {
    return (
        <div className='w-full shadow-sm mt-6 rounded-xl border overflow-hidden'>
            <div className="bg-[#F6F8FA] w-full flex items-center gap-x-2 pl-8 py-3 rounded-t-xl border-b">
                <h2 className="text-md font-bold">Transcripts</h2>
                <CircleAlert width={17} height={17} />
            </div>
            <div className='bg-white px-6 py-4'>
                <TranscriptsList userId={userId} />
            </div>
        </div>
    )
}
