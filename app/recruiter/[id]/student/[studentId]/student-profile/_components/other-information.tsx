import Image from 'next/image'
import React from 'react'

interface OtherInformationProps {
    student_details: {}
}

const OtherInformation = ({student_details}:OtherInformationProps) => {
  return (
    <div className='bg-white shadow-[-10px_-10px_30px_4px_rgba(0,0,0,0.1),_10px_10px_30px_4px_rgba(45,78,255,0.15)] rounded-xl p-10'>
        <h2 className="text-[24px] font-extrabold mb-10">Other Information</h2>
        <div className='flex flex-col lg:flex-row gap-5 lg:gap-16'>
            <div className='space-y-4'>
                <div className='space-y-3'>
                    <h3 className='text-[#8E8E8E] text-sm'>Language Spoken</h3>
                    <div className='w-full flex flex-wrap gap-4'>
                        <p className='py-1.5 px-3 border w-fit rounded-[6px]'>English</p>
                        <p className='py-1.5 px-3 border w-fit rounded-[6px]'>Japanese</p>
                        <p className='py-1.5 px-3 border w-fit rounded-[6px]'>Indonesia</p>
                        <p className='py-1.5 px-3 border w-fit rounded-[6px]'>Javanese</p>
                    </div>                
                </div>
                <div className='space-y-3'>
                    <h3 className='text-[#8E8E8E] text-sm'>Awards Received</h3>
                    <p className='font-semibold'>N/A</p>
                </div>
                <div className='space-y-3'>
                    <h3 className='text-[#8E8E8E] text-sm'>Career Goals</h3>
                    <p className='font-semibold'>N/A</p>
                </div>
            </div>
            <div className='space-y-4'>
                <div className='space-y-3'>
                    <h3 className='text-[#8E8E8E] text-sm'>Volunteer/Community Service</h3>
                    <p className='font-semibold'>N/A</p>
                </div>
                <div className='space-y-3'>
                    <h3 className='text-[#8E8E8E] text-sm'>Internship</h3>
                    <p className='font-semibold'>N/A</p>
                </div>
                <div className='space-y-3'>
                    <h3 className='text-[#8E8E8E] text-sm'>Desired Work Location</h3>
                    <p className='font-semibold'>N/A</p>
                </div>
            </div>
            <div className='space-y-4'>
                <div className='space-y-3'>
                    <h3 className='text-[#8E8E8E] text-sm'>Hobbies</h3>
                    <p className='font-semibold'>Cooking</p>
                </div>
                <div className='space-y-3'>
                    <h3 className='text-[#8E8E8E] text-sm'>Work Experience</h3>
                    <p className='font-semibold'>N/A</p>
                </div>
                <div className='space-y-3'>
                    <h3 className='text-[#8E8E8E] text-sm'>Personal Statement</h3>
                    <p className='font-semibold'>N/A</p>
                </div>
            </div>
        </div>
    </div>
  )
}

export default OtherInformation