import Image from 'next/image'
import React from 'react'

const GoalAndSkills = ({student_details}) => {
  return (
    <div className='bg-white shadow-[-8px_-8px_30px_4px_rgba(0,0,0,0.1),_8px_8px_20px_4px_rgba(45,78,255,0.15)] rounded-xl p-10'>
        <h2 className="text-[24px] font-extrabold mb-10">Goals, Skills, & Interest</h2>
        <div className='lg:w-[90%] flex flex-col lg:flex-row justify-between gap-10'>
            <div className="space-y-4">
                <h2 className="text-[#8E8E8E] mb-3">Preferred Schools</h2>

                {
                    student_details?.schools_of_interest?.map((item:any, index:number)=>(
                        <div className='flex py-1 gap-x-4' key={index}>
                            <div className='relative h-[48px] w-[48px]'>
                                <Image src={'/images/university-1.png'} fill objectFit='cover' alt="university" />
                            </div>
                            <div>
                                <h3 className='text-base font-semibold'>{item?.name}</h3>
                                <p>{item?.institution_type}</p>
                            </div>
                        </div>
                    ))
                }
                {/* <div className='flex py-1 gap-x-4'>
                    <div className='relative h-[48px] w-[48px]'>
                        <Image src={'/images/university-2.png'} fill objectFit='cover' alt="university" />
                    </div>
                    <div>
                        <h3 className='text-base font-semibold'>Clark Atlanta University</h3>
                        <p>Privat University</p>
                    </div>
                </div>
                <div className='flex py-1 gap-x-4'>
                    <div className='relative h-[48px] w-[48px]'>
                        <Image src={'/images/university-3.png'} fill objectFit='cover' alt="university" />
                    </div>
                    <div>
                        <h3 className='text-base font-semibold'>Clark Atlanta University</h3>
                        <p>Privat University</p>
                    </div>
                </div>
                <div className='flex py-1 gap-x-4'>
                    <div className='relative h-[48px] w-[48px]'>
                        <Image src={'/images/university-2.png'} fill objectFit='cover' alt="university" />
                    </div>
                    <div>
                        <h3 className='text-base font-semibold'>Clark Atlanta University</h3>
                        <p>Privat University</p>
                    </div>
                </div> */}
            </div>
            <div className=''>
                <h2 className="text-[#8E8E8E] mb-3">Major Interest</h2>
                <div className='text-base font-semibold space-y-1.5'>
                    {
                        student_details?.student_majors?.map((name:any, index:number)=>(
                            <p key={index}>{name}</p>
                        ))
                    }
                </div>
            </div>
            <div className=''>
                <h2 className="text-[#8E8E8E] mb-3">Extracurricular Interest</h2>
                <div className='text-base font-semibold space-y-1.5'>
                {
                    student_details?.student_extracurricular?.map((name:any, index:number)=>(
                    <p key={index}>{name}</p>
                    ))
                }
                </div>
            </div>
        </div>
    </div>
  )
}

export default GoalAndSkills