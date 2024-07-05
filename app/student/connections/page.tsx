"use client"
import LoadingSpinner from "@/components/loading-spinner";
import SingleRecruiterCard from "@/components/single-recruiter-card";
import { Button } from "@/components/ui/button";
import { useLazyGetStudentRecruiterConnectionsQuery } from "@/redux/services/student/studentApi";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { PageHeader, PageContent } from "@/components/common-page";
import { useSendMessageMutation } from '@/redux/services/user/userApi'
import CustomModal from "@/components/modal/custom-modal";
import { useFormik } from "formik";
import * as yup from "yup";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";

export default function StudentConnection() {
  const [availableConnections, setAvailableConnections] = useState([])
  const [sendMessage, { isLoading: isSending }] = useSendMessageMutation()
  const [getStudentRecruiterConnections, { isLoading, isFetching }] = useLazyGetStudentRecruiterConnectionsQuery()

  const { data } = useSession()
  const studentId = data?.user?.roleId
  const [recipientRecruiterId, setRecipientRecruiterId] = useState(null);

  const handleGetStudentRecruiterConnections = async (studentId) => {
    getStudentRecruiterConnections(studentId)
      .unwrap()
      .then((payload) => {
        setAvailableConnections(payload.data)
      })
  }

  const {values, errors, touched, handleSubmit, handleBlur, handleChange, resetForm} = useFormik({
    initialValues: {message: ""},
    validationSchema: yup.object().shape({
        message: yup.string().required('message is required'),
    }),
    onSubmit: (values, {resetForm}) => {
      sendMessage({
        studentId: studentId,
        recruiterId: recipientRecruiterId,
        schoolId:"",
        senderRole: "student",
        message: values.message
    }).unwrap()
    .catch((err) => {
        toast.error("Uh oh. Something went wrong. Please try again in a few minutes")
    })
    .finally(()=>{
        resetForm()
        setRecipientRecruiterId(null);
    })
    },
  })

  useEffect(() => {
    if (studentId) {
      handleGetStudentRecruiterConnections(studentId)
    }
  }, [studentId])

  if (isLoading || isFetching) {
    return <LoadingSpinner />
  }

  return (
    <>
    <PageHeader
        title="Recruiter Connections"
        subtitle="Discover your ideal institution match here." />
    <PageContent>
          {
            availableConnections?.length > 0 ? <>
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-6">
                {
                  availableConnections?.map(({ recruiter, school }: { recruiter: any, school: any }, idx) => (
                    <SingleRecruiterCard
                      key={recruiter?.id}
                      imgUrl={recruiter?.user.profile_image}
                      name={`${recruiter?.user?.first_name} ${recruiter?.user?.last_name}`}
                      school_name={school?.name}
                      school_state={school?.school_address?.state}
                      school_email=""
                      phone={recruiter.user?.phone}
                      email={recruiter.user?.email}
                      onMessageClick={()=>setRecipientRecruiterId(recruiter?.id)}
                    />
                  ))
                }
              </div>
              <CustomModal handleClose={()=>setRecipientRecruiterId(null)} show={!!recipientRecruiterId}   title="Connect" modalClass="w-full max-w-[85%] lg:w-[750px] !rounded-2xl">
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
                            onClick={()=> {
                                setRecipientRecruiterId(null),
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
              </>
              :
              <section className='h-[calc(100vh_-_20rem)] bg-[#F0F4F7] rounded-[6px] flex justify-center items-center text-center'>
                <div>
                  <p className="pb-4"> No Connection Found</p>
                  <Button
                    className="font-light h-8 text-xs px-6"
                    onClick={() => window.location.reload()}
                  >Refresh</Button>
                </div>
              </section>
          }
    </PageContent>
    </>
  )
}