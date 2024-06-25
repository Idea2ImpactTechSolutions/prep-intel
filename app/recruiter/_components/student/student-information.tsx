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

const StudentInformation = ({student_details, recruiterId, studentId }) => {
    const [showModal, setShowModal] = useState<boolean>(false)
    const [showConfirmationModal, setShowConfirmationModal] = useState<boolean>(false)
    const [disableConnectionButton, setDisableConnectionButton] = useState<boolean>(student_details?.open_connection_request)
    const {data: session}: any = useSession()
    const schoolId = session?.user?.schoolID;
    const router = useRouter()

    const [createConnectionRequest, { isLoading: isLoadingConnectionRequest }] = useCreateConnectionRequestsMutation();
    const [sendMessage, { isLoading }] = useSendMessageMutation()

    function sendConnectRequest() {
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
            studentId:student_details?.student_id,
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

  return (
    <div className='w-full flex flex-col space-y-2 md:space-y-6'>
        <div className="shadow-sm rounded-xl border overflow-hidden">
          <div className='relative'>
              <div className="w-full bg-[#F6F8FA] min-h-[120px] md:min-h-[140px] object-cover bg-no-repeat">
              </div>
              <div className='absolute w-[140px] h-[140px] rounded-full bg-white left-[43px] -bottom-[70px] flex justify-center items-center'>
                  {student_details?.connection_date && student_details?.interested && student_details.profile_image ?
                      <Image src={student_details.profile_image} fill objectFit='cover' alt='student-profile' className='rounded-full'/>
                      :
                      <CircleUserRound size={100} />
                  }
              </div>
          </div>
          <div className='p-10 bg-white'>
              <div className='flex justify-end'>
                  {(disableConnectionButton) ?
                      <Button variant="outline" className='text-xl' disabled
                      >Invite Sent</Button>
                      : (!student_details?.connection_date &&  !student_details?.interested) ?
                      <Button variant="outline"
                        loading={isLoadingConnectionRequest}
                        onClick={sendConnectRequest}
                      >Connect To Unlock</Button>
                      : <Button variant="outline" className='text-xl' onClick={()=>setShowModal(true)}>Message</Button>
                  }
              </div>
              <UserInformation user_info ={student_details}/>
          </div>
        </div>

        <TranscriptSection />

        <GoalAndSkills student_details={student_details}/>

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
                        disabled={isLoading}
                        onClick={()=>{
                            setShowModal(false)
                            resetForm()
                        }}
                        className='w-full sm:w-fit md:px-10 rounded-lg font-[500] text-primary'
                    >
                            No, cancel
                    </Button>

                    <Button
                        type='submit'
                        variant="orange"
                        className='w-full sm:w-fit md:px-10 rounded-lg font-[500]'
                        loading={isLoading}
                        disabled={isLoading}
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

export default StudentInformation