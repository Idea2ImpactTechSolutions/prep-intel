"use client"
import React from 'react'
import StudentInformation from './_components/student-information';
import GoalAndSkills from './_components/goals-skills-section';
import OtherInformation from './_components/other-information';
import { useGetStudentProfileQuery } from '@/redux/services/recruiter/recruiterApi';
import { useParams } from 'next/navigation';
import LoadingSpinner from '@/components/loading-spinner';

const StudentProfilePage = () => {
  const pageParams = useParams();

  const recruiterId = pageParams?.id
  const studentId = pageParams?.studentId

  const {data:studentProfileDetails, isLoading} = useGetStudentProfileQuery({studentId,recruiterId})

  return (
    <div className="container p-5">
      {
        !isLoading && studentProfileDetails ? 
        (
          <>
            <StudentInformation student_details={studentProfileDetails?.data}/>
            {/* <div className='my-10 grid lg:grid-cols-2 gap-5'> */}
            <div className='w-full my-10' >
              <GoalAndSkills student_details={studentProfileDetails?.data}/>
              {/* <OtherInformation student_details={studentProfileDetails?.data}/> */}
            </div>
          </>
        ):(
          <LoadingSpinner/>
        )
      }
    </div>
  )
}

export default StudentProfilePage