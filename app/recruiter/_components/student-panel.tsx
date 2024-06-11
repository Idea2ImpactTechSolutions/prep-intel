"use client"
import { useGetStudentProfileQuery } from '@/redux/services/recruiter/recruiterApi';
import StudentInformation from './student/student-information';
import LoadingSpinner from '@/components/loading-spinner';

interface PageProps {
  studentId: string;
  recruiterId: string;
}

export default function StudentPanel({ studentId, recruiterId }:PageProps) {
  const {data: response, isLoading} = useGetStudentProfileQuery({studentId,recruiterId});
  // Alias response data as student
  const student = response?.data;

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
      <StudentInformation student_details={student} recruiterId={recruiterId} studentId={studentId} />
  )
}