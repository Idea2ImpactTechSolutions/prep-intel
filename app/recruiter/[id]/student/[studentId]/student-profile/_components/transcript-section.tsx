import { Checkbox } from '@/components/ui/checkbox'
import { CircleAlert, FileQuestion } from 'lucide-react'

const TranscriptSection = () => {
    // const TRANSCRIPT_COLUMNS = [  
    //     {
    //         id: 1,
    //         title: <Checkbox/>,
    //     },
    //     {
    //         id: 2,
    //         title:"NAME",
    //     },
    //     {
    //         id: 3,
    //         title:"MAJOR",
    //     },
    //     {
    //         id: 4,
    //         title:"GPA",
    //     },
    //     {
    //         id: 5,
    //         title:"INSTRUCTOR",
    //     },
    //     {
    //         id: 6,
    //         title:"GRADE",
    //     },
    //     {
    //         id: 7,
    //         title:"STATUS",
    //     },
    //     ]

    const searchData = []

    return (
        <div className='w-full shadow-lg mt-6 rounded-xl border '>
            <div className="bg-[#F6F8FA] w-full flex items-center gap-x-2 pl-8 py-5 rounded-t-xl border-b">
                <p>Transcript</p>
                
                <CircleAlert width={17} height={17} />
            </div>
            <div className='mt-5'>
                {/* {<Table
                title={'Transcript'}
                columns={TRANSCRIPT_COLUMNS}
                columnHeaderStyle={'text-xl text-[#8E8E8E]'}
                >
                <TBODY>
                    {searchData?.length ?
                    searchData?.map((recruits:any, index) => (
                        <TR key={index}>
                        <TD>No Data</TD>
                        </TR>)):null
                    }
                </TBODY>
                </Table>
                } */}

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