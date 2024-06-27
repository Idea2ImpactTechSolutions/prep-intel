import { CircleAlert, FileQuestion } from 'lucide-react'

export default function TranscriptSection(){
    const searchData = []

    return (
        <div className='w-full shadow-sm mt-6 rounded-xl border overflow-hidden'>
            <div className="bg-[#F6F8FA] w-full flex items-center gap-x-2 pl-8 py-3 rounded-t-xl border-b">
                <h2 className="text-md font-bold">Transcript</h2>
                <CircleAlert width={17} height={17} />
            </div>
            <div className='bg-white'>
                {
                    !searchData?.length &&
                    <div className='w-full flex flex-col justify-center items-center py-12 space-y-4'>
                        <div className='w-[100px] h-[100px] bg-[#F6F8FA] rounded-full flex justify-center items-center'>
                          <FileQuestion size={40} className="text-[#AAAAAA]"/>
                        </div>
                        <div className="flex items-center flex-col space-y-2">
                          <p className='text-md'>No Results Found</p>
                          <span className='text-md text-gray-400'>No transcript data is available at this time.</span>
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}
