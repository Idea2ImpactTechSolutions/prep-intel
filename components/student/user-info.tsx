"use client"
import React from 'react'
import { cn } from '@/lib/utils'
import Image from 'next/image'

export default function UserInformation ({userInfo, className = ''}) {
  return (
    <div>
        <div className={cn(`flex flex-col md:flex-row justify-start md:items-center gap-x-2`, className)}>
            {
                (userInfo?.connected || (userInfo?.connection_date &&  userInfo?.interested)) && (
                  <h2 className='text-2xl font-extrabold leading-10'>
                    {userInfo?.student_first_name + " " + userInfo?.student_last_name}
                  </h2>
                )
            }
        </div>

        {
          userInfo?.connected && (
            <div className="flex text-lg mb-6 gap-2">
              <Image
                src={"/images/logo/usa-icon.png"}
                alt="logo"
                width={20}
                height={20}
              />
              {userInfo?.student_city}, {userInfo?.student_state} {userInfo?.student_postal}
              {userInfo?.student_phone_number? ` | ${userInfo?.student_phone_number}` : null}
            </div>)
        }

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className='space-y-1'>
                <h3 className='text-gray-400 text-md'>High School</h3>
                <p className='text-md'>{userInfo?.student_high_school || "N/A"}</p>
            </div>
            <div className='space-y-1'>
                <h3 className='text-gray-400 text-md'>ACT Score</h3>
                <p className='text-md'>{userInfo?.student_act_score || "N/A"}</p>
            </div>
            <div className='space-y-1'>
                <h3 className='text-gray-400 text-md'>GPA</h3>
                <p className='text-md'>{userInfo?.student_gpa || "N/A"}</p>
            </div>
            <div className='space-y-1'>
                <h3 className='text-gray-400 text-md'>Expected Graduation Year</h3>
                <p className='text-md'>{userInfo?.student_graduation_year || "N/A"}</p>
            </div>
            <div className='space-y-1'>
                <h3 className='text-gray-400 text-md'>SAT Score</h3>
                <p className='text-md'>{ userInfo?.student_sat_score || "N/A"}</p>
            </div>
        </div>
    </div>
  )
}