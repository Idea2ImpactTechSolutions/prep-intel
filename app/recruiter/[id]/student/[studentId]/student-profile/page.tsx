"use client"
import LoadingSpinner from '@/components/loading-spinner';
import { useGetStudentProfileQuery } from '@/redux/services/recruiter/recruiterApi';
import { useParams } from 'next/navigation';
import GoalAndSkills from './_components/goals-skills-section';
import StudentInformation from './_components/student-information';

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