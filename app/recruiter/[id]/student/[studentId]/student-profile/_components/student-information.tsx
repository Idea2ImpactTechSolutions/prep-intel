"use client"
import { Button } from '@/components/ui/button'
import { CircleUserRound, PencilLine } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import UserInformation from './user-info'
import TranscriptSection from './transcript-section'

const StudentInformation = ({student_details}) => {
    
  return (
    <div className='w-full'>
        <div className='relative'>
            <div className="w-full bg-[url('/images/student-profile-banner.png')] min-h-[180px] md:min-h-[320px] object-cover bg-no-repeat rounded-t-2xl">
            </div>
            <div className='absolute w-[152px] h-[152px] rounded-full bg-white left-[43px] -bottom-[74px] flex justify-center items-center'>
                {student_details?.connection_date &&  student_details?.interested?
                    <Image src={'/images/profile-picture.jpg'} fill objectFit='cover' alt='student-profile' className='rounded-full'/>:<CircleUserRound size={120}/>
                }
            </div>
        </div>
        <div className='p-10 bg-white shadow-xl rounded-b-xl'>
            <div className='flex justify-end'>
                {!student_details?.connection_date &&  !student_details?.interested ? 
                // (<Button variant="outline" className='gap-x-1.5 rounded-[10px]'>
                //     <PencilLine size={18}/> 
                //     <span className='text-xl'>Edit Profile</span>
                // </Button>):
                <Button variant="outline" className='text-xl'>Connect</Button> :null}
            </div>
            <UserInformation user_info ={student_details}/>
        </div>
        <TranscriptSection />
    </div>
  )
}

export default StudentInformation