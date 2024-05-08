"use client"

import {useEffect, useState} from "react"
import SheetPanel from "@/components/custom-sheet"
import LoadingSpinner from "@/components/loading-spinner";
import { Button } from "@/components/ui/button"
import { useLazyGetMessagesQuery, useUpdateConnectionRequestsMutation } from "@/redux/services/student/studentApi";
import { useSession } from "next-auth/react";
import { X } from "lucide-react";
import { useFormik } from "formik";
import * as yup from "yup"
import { Textarea } from "./ui/textarea";

interface NotificationPanelProp {
  open:boolean,
  setOpen:(value:boolean)=>void
}

const NotificationPanel =({open, setOpen}:NotificationPanelProp)=>{
  // const [updateConnection, {isLoading}] = useUpdateConnectionRequestsMutation()
  const [getMessages, {data:messages, isLoading} ] = useLazyGetMessagesQuery()

  const [openMessage, setOpenMessage] =useState(false)

  const session = useSession()
  const roleId = session?.data?.user?.roleId
  const senderRole = session?.data?.user?.role 
  const school_id = session?.data?.user?.schoolID || ""


  const {values, errors, touched, handleSubmit, handleBlur, handleChange, resetForm} = useFormik({
    initialValues: {message: ""},
    validationSchema: yup.object().shape({
        message: yup.string().required('message is required'),
    }),
    onSubmit:(values)=>{
      console.log(values)
    }
  })


  useEffect(()=>{
    if(senderRole === "student"){
        getMessages({recruiter_id:"" ,school_id, student_id:roleId, receiver_role:senderRole})
    }
    if(senderRole === "recruiter"){
      getMessages({recruiter_id:roleId ,school_id, student_id:"", receiver_role:senderRole})
    }
  }, [senderRole, roleId])

  useEffect(()=>{
    if(openMessage){
      setOpenMessage(false)
    }
  }, [open])
    
  return (
    <div className="">
      <SheetPanel
          show={open}
          title={`Notifications`}
          handleClose={() => setOpen(false)}
          width={450}
      >
        
          {!openMessage ?
            <div className="mt-8 pb-16 h-[90vh] overflow-y-auto lg:mx-5">
              {isLoading ? <LoadingSpinner className="h-[250px]" /> :
              messages?.data?.map((message, index:number)=><div className="mb-8">
                <div className="flex justify-between" key={"conn-request-"+index}>
                  <div className="flex flex-row">                
                    <span> <h2 className="font-semibold inline-block">Ralph Edwards</h2> has sent you an invitation to connect. Would you like to share your information and connect?</span>
                    <span>49m</span>
                  </div>
                </div>
              </div>)
              }
              
              <div className="mb-8 cursor-pointer" onClick={()=>setOpenMessage(true)}>
                <div className="flex flex-row">                
                  <span> <h2 className="font-semibold inline-block">Ralph Edwards</h2> has sent you an invitation to connect. Would you like to share your information and connect?</span>
                  <span>49m</span>
                </div>
              </div>
            </div> : 
            <div className="h-full flex flex-col gap-y-3">
              <div className="flex justify-end mt-3 "><Button variant={'ghost'} title="Close Message" size="sm" className="h-5 px-1" onClick={()=>setOpenMessage(false)}><X className="h-3 w-3 text-gray-400 cursor-pointer" /></Button></div>
              <div className="w-full h-full pb-3 overflow-y-auto">
                <div className="mb-4"><p className="w-[90%] bg-primary/10 p-3 rounded-md">I am a recuiter and I would love to connect with you so we can check your grades and potentially employ you to our company. Just say yes!</p></div>
                <div className="w-full flex justify-end mb-4"><p className="w-[90%] bg-green-100 rounded-md p-3">I am a recuiter and I would love to connect with you so we can check your grades and potentially employ you to our company. Just say yes!</p></div>
                <div className="mb-4"><p className="w-[90%] bg-primary/10 p-3 rounded-md">I am a recuiter and I would love to connect with you so we can check your grades and potentially employ you to our company. Just say yes!</p></div>
                <div className="w-full flex justify-end mb-4"><p className="w-[90%] bg-green-100 rounded-md p-3">I am a recuiter and I would love to connect with you so we can check your grades and potentially employ you to our company. Just say yes!</p></div>
              </div>
              <div className=" pt-2 mb-5">
                <form onSubmit={handleSubmit}>
                  <Textarea 
                      id='message'
                      name="message"
                      className='w-full mt-2 rounded-xl' 
                      placeholder='Enter your message here' 
                      rows={2}
                      value={values.message}
                      onChange={handleChange}
                      handleBlur={handleBlur}
                      touched={touched.message}
                      error={errors.message}
                  />
                  <div className='flex justify-end items-center gap-x-5 mt-2'>
                    <Button 
                        type='submit'
                        variant="orange" 
                        className='w-fit md:px-4 h-8 rounded-lg font-[500]'
                        loading={isLoading}
                        disabled={isLoading}
                        loadingText={"Sending..."}
                    >
                        Send
                      </Button>
                  </div>
                </form>
              </div>
            </div>
          }
      </SheetPanel>
    </div>
  )
}

export default NotificationPanel