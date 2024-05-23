import React from 'react'
import { FaSchool } from "react-icons/fa6";

export default function GoalAndSkills({student_details}) {
  return (
    <div className='bg-white shadow-sm rounded-xl p-10 pt-8 border'>
        <h2 className="text-md font-bold mb-4">Goals, Skills, & Interest</h2>
        <div className='flex flex-col lg:flex-row justify-between gap-10'>
            <div className="space-t-4">
                <h2 className="text-gray-400 mb-3">Preferred Schools</h2>
                {
                    student_details?.schools_of_interest?.map((item:any, index:number)=>(
                        <div className='flex py-1 gap-x-4' key={index}>
                            <div className='relative h-[48px] w-[48px]'>
                                <FaSchool />
                            </div>
                            <div>
                                <h3 className='text-md font-semibold'>{item?.name}</h3>
                                <p>{item?.institution_type}</p>
                            </div>
                        </div>
                    ))
                }
            </div>
            <div className=''>
                <h2 className="text-gray-400 mb-3">Major Interests</h2>
                <div className='text-md font-semibold space-y-1.5'>
                    {
                        student_details?.student_majors?.map((name:any, index:number)=>(
                            <p key={index}>{name}</p>
                        ))
                    }
                </div>
            </div>
            <div className=''>
                <h2 className="text-gray-400 mb-3">Extracurricular Interests</h2>
                <div className='text-md font-semibold space-y-1.5'>
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
