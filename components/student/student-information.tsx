"use client"
import { CircleUserRound } from 'lucide-react'
import Image from 'next/image'
import TranscriptSection from './transcript-section'
import UserInformation from './user-info'
import { useState } from 'react'
import CustomModal from '@/components/modal/custom-modal'
import { useFormik } from 'formik'
import * as yup from 'yup'

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import ConfirmationModal from '@/components/modal/confirmation-modal'
import { useSendMessageMutation } from '@/redux/services/user/userApi'
import { useCreateConnectionRequestsMutation } from '@/redux/services/student/studentApi'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import GoalAndSkills from './goals-skills-section'

import { useGetStudentProfileQuery } from '@/redux/services/recruiter/recruiterApi';
import LoadingSpinner from '@/components/loading-spinner';
import CustomSelect from "@/components/custom-select";
import { ApplicantStatus } from '@/app/enums/applicant-status'
import { useUpdateRecruitMutation } from "@/redux/services/student/studentApi";

interface PageProps {
  studentId: string;
  schoolId: string;
  recruiterId?: string;
}

export default function StudentInformation({ studentId, schoolId, recruiterId }:PageProps) {
    // Invoke getStudentProfile and destructure into student_details
    const {data: { data: studentDetails } = {}, isLoading} = useGetStudentProfileQuery({studentId,recruiterId, schoolId});
    const [showModal, setShowModal] = useState<boolean>(false)
    const [showConfirmationModal, setShowConfirmationModal] = useState<boolean>(false)
    const {data: session}: any = useSession()
    const router = useRouter()
    const [updateRecruit, { isLoading: isSendingApplicantStatus }] = useUpdateRecruitMutation();

    const [createConnectionRequest, { isLoading: isLoadingConnectionRequest }] = useCreateConnectionRequestsMutation();
    const [sendMessage, { isLoading: isSending }] = useSendMessageMutation()

    const [disableConnectionButton, setDisableConnectionButton] = useState<boolean>(!!studentDetails?.open_connection_request)

    function sendConnectRequest() {
      if (!recruiterId) return;

      createConnectionRequest({
        studentId: parseInt(studentId),
        recruiterId: parseInt(recruiterId),
        schoolId: parseInt(schoolId),
        requestMessage: "Let's get connected",
      })
      setDisableConnectionButton(true)
    }

    const handleSubmitMessage = (values:any, resetForm:()=>void)=>{
        setShowConfirmationModal(false)
        sendMessage({
            studentId:studentDetails?.student_id,
            recruiterId:session?.user?.roleId,
            schoolId:"",
            senderRole:session?.user?.role,
            message:values.message
        }).unwrap()
        .then((payload) => {
            if (payload?.status === 201) {
                toast.success(payload?.message)
            }
        })
        .catch((err) => {
            toast.error("Uh oh. Something went wrong. Please try again in a few minutes")
        })
        .finally(()=>{
            setShowModal(false)
            resetForm()
            router.refresh()
        })
    }

    const {values, errors, touched, handleSubmit, handleBlur, handleChange, resetForm} = useFormik({
        initialValues: {message: ""},
        validationSchema: yup.object().shape({
            message: yup.string().required('message is required'),
        }),
        onSubmit:()=>setShowConfirmationModal(true)
    })

    if (isLoading) {
      return <LoadingSpinner />;
    }

    return (
    <div className='w-full flex flex-col space-y-2 md:space-y-6'>
        <div className="shadow-sm rounded-xl border overflow-hidden">
          <div className='relative'>
              <div
                style={{ backgroundSize: '10%' }}
                 className="w-full bg-[url('/images/student-profile-banner.png')] min-h-[120px] md:min-h-[140px]">
              </div>
              <div className='absolute w-[100px] h-[100px] bg-gray-300 rounded-full bg-white left-[50px] -bottom-[50px] flex justify-center items-center'>
                  {studentDetails?.connection_date && studentDetails?.interested && studentDetails.profile_image ?
                      <Image src={studentDetails.profile_image} fill objectFit='cover' alt='student-profile' className='rounded-full'/>
                      :
                      <CircleUserRound size={100} stroke="#888" />
                  }
              </div>
          </div>
          <div className='p-10 pt-4'>
              <div className='flex justify-end  min-h-[2rem]'>
                  { !recruiterId ? null : (disableConnectionButton) ?
                      <Button variant="outline" className='text-xl' disabled
                      >Invite Sent</Button>
                      : (!studentDetails?.connected) ?
                      <Button variant="outline"
                        loading={isLoadingConnectionRequest}
                        onClick={sendConnectRequest}
                      >Connect To Unlock</Button>
                      : (<div className="flex flex-col">
                          <Button variant="outline" className='text-xl' onClick={()=>setShowModal(true)}>Message</Button>
                          <CustomSelect
                            label="Applicant Status"
                            labelClass="mt-3 text-xs font-normal text-[#61646B]"
                            name="applicantStatus"
                            showSearch={false}
                            error={false}
                            disabled={isSendingApplicantStatus}
                            selected={studentDetails?.applicant_status}
                            setSelected={(selected) => updateRecruit({
                                studentId,
                                data: {
                                  applicant_status: selected.toUpperCase(),
                                  school_id: schoolId,
                                },
                              })
                            }
                            options={
                              Object.values(ApplicantStatus).map((status) => (
                                {
                                  label: status,
                                  value: status,
                                }
                              ))
                            }
                          />
                        </div>)
                  }
              </div>
              <UserInformation userInfo={studentDetails} />
          </div>
        </div>

        <TranscriptSection />

        <GoalAndSkills student_details={studentDetails}/>

        <CustomModal handleClose={()=>setShowModal(false)} show={showModal}   title="Connect with Student" modalClass="w-full max-w-[85%] lg:w-[750px] !rounded-2xl">
            <form onSubmit={handleSubmit}>
                <div className='mt-[7px]'>
                    <p className="text-base font-bold">Add your message</p>
                </div>
                <Textarea
                    id='message'
                    name="message"
                    className='w-full mt-3 rounded-2xl'
                    placeholder='Enter your message here'
                    rows={5}
                    value={values.message}
                    onChange={handleChange}
                    handleBlur={handleBlur}
                    touched={touched.message}
                    error={errors.message}
                />
                <div className='flex justify-end items-center gap-x-5 mt-9'>
                    <Button
                        type='button'
                        variant="outline"
                        disabled={isSending}
                        onClick={()=>{
                            setShowModal(false)
                            resetForm()
                        }}
                        className='w-full sm:w-fit md:px-10 rounded-lg font-[500] text-primary'
                    >
                      Cancel
                    </Button>

                    <Button
                        type='submit'
                        variant="orange"
                        className='w-full sm:w-fit md:px-10 rounded-lg font-[500]'
                        loading={isSending}
                        disabled={isSending}
                        loadingText={"Sending..."}
                    >
                        Send Message
                    </Button>
                </div>
            </form>
        </CustomModal>

        <ConfirmationModal
            title='Confirm Send Message'
            description ="Would you like to send the message?"
            variant={"orange"}
            open={showConfirmationModal}
            handleClose={()=>setShowConfirmationModal(false)}
            modalContentStyle={"top-32"}
            onClick={()=>handleSubmitMessage(values, resetForm)}
        />
    </div>
  )
}
