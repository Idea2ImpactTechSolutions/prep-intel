import { FileCheck } from 'lucide-react'
import React from 'react'

const UserInformation = ({user_info}) => {
  return (
    <div>
        <div className={`flex flex-col md:flex-row justify-start md:items-center gap-x-2 mt-6 mb-2`}>
            {
                user_info?.connection_date &&  user_info?.interested && (
                    <>
                        <h2 className='text-3xl md:text-[32px] font-extrabold leading-10'>
                            {user_info?.student_first_name + " " + user_info?.student_last_name}
                        </h2>
                        <div className='flex items-center gap-x-1 bg-[#57BFC7]/10 text-[#57BFC7] text-sm py-1 px-3 rounded-sm w-fit'>
                            <FileCheck size={14}/>
                            <span>68% Complete</span>
                        </div>
                    </>
                )
            }
        </div>

        {user_info?.connection_date &&  user_info?.interested && <p className="text-xl mb-10">{user_info?.student_city}  |  {user_info?.student_state} {user_info?.student_postal? `| ${user_info?.student_postal}` : null} {user_info?.student_phone_number? ` | ${user_info?.student_phone_number}` : null}</p>}
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 mb-10">
            <div className='space-y-1'>
                <h3 className='text-[#8E8E8E] text-[22px]'>High Score</h3>
                <p className='text-[#141111] text-xl'>{user_info?.student_high_school}</p>
            </div>
            <div className='space-y-1'>
                <h3 className='text-[#8E8E8E] text-[22px]'>ACT Score</h3>
                <p className='text-[#141111] text-xl'>{user_info?.student_act_score?user_info?.student_act_score:"N/A"}</p>
            </div>
            <div className='space-y-1'>
                <h3 className='text-[#8E8E8E] text-[22px]'>GPA</h3>
                <p className='text-[#141111] text-xl'>{user_info?.student_gpa?user_info?.student_gpa:"N/A"}</p>
            </div>
            <div className='space-y-1'>
                <h3 className='text-[#8E8E8E] text-[22px]'>Expected Graduated Year</h3>
                <p className='text-[#141111] text-xl'>{user_info?.student_graudation_year?user_info?.student_graudation_year:"N/A"}</p>
            </div>
            <div className='space-y-1'>
                <h3 className='text-[#8E8E8E] text-[22px]'>SAT Score</h3>
                <p className='text-[#141111] text-xl'>{ user_info?.student_sat_score? user_info?.student_sat_score: "N/A"}</p>
            </div>
            {/* <div className='space-y-1'>
                <h3 className='text-[#8E8E8E] text-[22px]'>Dual Enrollment</h3>
                <p className='text-[#141111] text-xl'>No</p>
            </div> */}
        </div>
    </div>
  )
}

export default UserInformation