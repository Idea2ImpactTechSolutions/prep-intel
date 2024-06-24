"use client"
import React from 'react'


const UserInformation = ({user_info}) => {
  return (
    <div>
        <div className={`flex flex-col md:flex-row justify-start md:items-center gap-x-2`}>
            {
                user_info?.connection_date &&  user_info?.interested && (
                    <>
                        <h2 className='text-3xl md:text-[32px] font-extrabold leading-10'>
                            {user_info?.student_first_name + " " + user_info?.student_last_name}
                        </h2>
                    </>
                )
            }
        </div>

        {user_info?.connection_date &&  user_info?.interested && <p className="text-xl mb-10">{user_info?.student_city}  |  {user_info?.student_state} {user_info?.student_postal? `| ${user_info?.student_postal}` : null} {user_info?.student_phone_number? ` | ${user_info?.student_phone_number}` : null}</p>}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className='space-y-1'>
                <h3 className='text-gray-400 text-md'>High School</h3>
                <p className='text-md'>{user_info?.student_high_school}</p>
            </div>
            <div className='space-y-1'>
                <h3 className='text-gray-400 text-md'>ACT Score</h3>
                <p className='text-md'>{user_info?.student_act_score?user_info?.student_act_score:"N/A"}</p>
            </div>
            <div className='space-y-1'>
                <h3 className='text-gray-400 text-md'>GPA</h3>
                <p className='text-md'>{user_info?.student_gpa?user_info?.student_gpa:"N/A"}</p>
            </div>
            <div className='space-y-1'>
                <h3 className='text-gray-400 text-md'>Expected Graduation Year</h3>
                <p className='text-md'>{user_info?.student_graduation_year?user_info?.student_graduation_year:"N/A"}</p>
            </div>
            <div className='space-y-1'>
                <h3 className='text-gray-400 text-md'>SAT Score</h3>
                <p className='text-md'>{ user_info?.student_sat_score? user_info?.student_sat_score: "N/A"}</p>
            </div>
        </div>
    </div>
  )
}

export default UserInformation