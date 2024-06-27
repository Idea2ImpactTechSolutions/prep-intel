import React from 'react'

export default function GoalAndSkills({student_details}) {
  return (
    <div className='bg-white shadow-sm rounded-xl p-10 pt-8 border'>
        <h2 className="text-md font-bold mb-4">Goals, Skills, & Interest</h2>
        <div className='flex flex-col lg:flex-row justify-between gap-10'>
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
