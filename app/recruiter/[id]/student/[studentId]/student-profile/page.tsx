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


  const {data:studentProfileDetails, isLoading:kdk} = useGetStudentProfileQuery({studentId,recruiterId})

  // const studentProfileDetails =  {
  //   data: {
  //     student_id: "studentId",
  //     student_first_name: "student_first_name" || null,
  //     student_last_name: "student_last_name" || null,
  //     student_city: "students.city" || null,
  //     student_state: "students.state" || null,
  //     student_postal: "students.postal" || null,
  //     student_high_school: "students.high_school" || null,
  //     student_act_score: "students.act_score" || null,
  //     student_sat_score: "students.sat_score" || null,
  //     schools_of_interest: [1,2,3,4] || null,
  //     connection_date:  null,
  //     student_gpa: "students.gpa" || null,
  //     student_graudation_year: "students.graduation_year" || null,
  //     contacted: "recruits.contacted "|| null,
  //     interested: false || null,
  //     student_majors: ["Business", "Accounting", "Programming"] || null,
  //     student_extracurricular: ["Football", "Greek Life"] || null,
  //     recruiter_id: "recruiter_id" || null,
  //     recruiter_first_name: "recruiter.user.first_name" || null,
  //     recruiter_last_name: "recruiter.user.last_name"|| null,
  //   }
  // }

  const isLoading = false

  return (
    <div className="container p-5">
      {
        !isLoading && studentProfileDetails ? 
        (
          <>
            <StudentInformation student_details={studentProfileDetails?.data}/>
            {/* <div className='my-10 grid lg:grid-cols-2 gap-5'> */}
            <div className='w-full mt-6 mb-10' >
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