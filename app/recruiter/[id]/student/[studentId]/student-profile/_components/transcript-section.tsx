import { CircleAlert, FileQuestion } from 'lucide-react'

const TranscriptSection = () => {

    const searchData = []

    return (
        <div className='w-full shadow-lg mt-6 rounded-xl border '>
            <div className="bg-[#F6F8FA] w-full flex items-center gap-x-2 pl-8 py-5 rounded-t-xl border-b">
                <p>Transcript</p>
                
                <CircleAlert width={17} height={17} />
            </div>
            <div className='mt-5'>
                {
                    !searchData?.length && 
                    
                    <div className='w-full flex flex-col justify-center items-center pt-10 pb-24 space-y-2 '>
                        <div className='w-[176px] h-[176px] bg-[#F6F8FA] rounded-full flex justify-center items-center'><FileQuestion size={55} className="text-[#AAAAAA]"/></div>
                        <p className='text-[#141111] text-[28px]'>No Results Found</p>
                        <span className='text-2xl text-[#8E8E8E]'>No transcript data is available at this time.</span>
                    </div>
                }
            </div>
        </div>
    )
}

export default TranscriptSection