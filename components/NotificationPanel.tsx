"use client"

import {useCallback, useEffect, useRef, useState} from "react"
import SheetPanel from "@/components/custom-sheet"
import LoadingSpinner from "@/components/loading-spinner";
import { Button } from "@/components/ui/button"
import { useSession } from "next-auth/react";
import { X } from "lucide-react";
import { useFormik } from "formik";
import * as yup from "yup"
import { Textarea } from "./ui/textarea";
import { useLazyGetMessagesQuery, useSendMessageMutation} from "@/redux/services/user/userApi";
import { dateTimeDifference } from "@/utils/helpers/date-format";
import { toast } from "sonner";
import moment from "moment";
import { useLazyGetConnectionRequestsQuery, useUpdateConnectionRequestsMutation } from "@/redux/services/student/studentApi";

interface NotificationPanelProp {
  open:boolean,
  setOpen:(value:boolean)=>void
}

interface Connection {
  id: number;
  recruiterName: string;
  requestDate: string;
  schoolName: string;
}

interface Message {
  create_date: string;
  id: number;
  message_text: string;
  recipient_role: string;
  recruiter_id: number;
  school_id: number;
  sender_role: string;
  status: string | null;
  student_id: number;
}

type CombinedItem = Connection | Message;

const combineMessageAndConnections = (messages: Message[], connections: Connection[]): CombinedItem[] => {
  const combinedArray: CombinedItem[] = [
    ...(connections?.map(connection => ({ ...connection, type: 'connection' })) ?? []),
    ...messages.map(message => ({ ...message, type: 'message' }))
  ];

  combinedArray.sort((a:any, b:any) => {
    if (a.type === 'connection' && b.type === 'message') {
      return new Date((b as Message).create_date).getTime() - new Date((a as Connection).requestDate).getTime();
    } else if (a.type === 'message' && b.type === 'connection') {
      return new Date((b as Connection).requestDate).getTime() - new Date((a as Message).create_date).getTime();
    } else {
      return 0;
    }
  });

  return combinedArray;
};

const NotificationPanel =({open, setOpen}:NotificationPanelProp)=>{
  const [getMessages, {isLoading} ] = useLazyGetMessagesQuery()
  const [sendMessage, {isLoading:sendingMessage} ] = useSendMessageMutation()
  const [getConnections, {data, isLoading:isLoadingConns}] = useLazyGetConnectionRequestsQuery()
  const [connect, {isLoading:connecting}] = useUpdateConnectionRequestsMutation()

  const [openMessage, setOpenMessage] = useState(false)
  const [accept, setAccept] = useState<boolean |undefined>()
  const [recent] = useState(true)
  const [messages, setMessages] = useState<any>([])
  const [viewMessages, setViewMessages] = useState<any>([])
  const [combineMsgAndConns, setCombineMsgAndConns] =useState<any>([])
  const [buttonLoading, setButtonLoading] = useState<number | undefined>(undefined)

  const session = useSession()
  const roleId = session?.data?.user?.roleId
  const senderRole = session?.data?.user?.role

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {values, errors, touched, handleSubmit, handleBlur, handleChange, resetForm} = useFormik({
    initialValues: {message: ""},
    validationSchema: yup.object().shape({
        message: yup.string().required('message is required'),
    }),
    onSubmit:async (values, {resetForm})=>{
      try {
        const res = await sendMessage({recruiter_id: viewMessages[0]?.recruiter_id, student_id:viewMessages[0]?.student_id, sender_role:senderRole, message_text:values?.message}).unwrap()

        if(res?.status === 201){
          toast.success(res.message)
          handleViewMessage(viewMessages[0])
        }
      } catch (error:any) {
        toast.error(error.message)
      } finally {
        resetForm()
      }
    }
  })

  const getMessagesFunc = useCallback(async ()=>{
    try {
      if(senderRole === "student"){
        getConnections(roleId)
        const res = await getMessages({recruiter_id:"" ,school_id:"", student_id:roleId, recent}).unwrap()
        setMessages(res?.data)
      }

      if(senderRole === "recruiter"){
        const res = await getMessages({recruiter_id:roleId ,school_id:"", student_id:"", recent}).unwrap()
        setMessages(res?.data)
      }

    } catch (error:any) {
      toast.error(error?.message)
    }

  }, [roleId, senderRole])

  const handleViewMessage = async (message:any)=>{
    setOpenMessage(true)
    if(senderRole === "student"){
      const res = await getMessages({recruiter_id: message?.recruiter_id ,school_id:"", student_id:roleId}).unwrap()
      setViewMessages(res?.data)
    }

    if(senderRole === "recruiter"){
      const res = await getMessages({recruiter_id:roleId ,school_id:"", student_id:message?.student_id})
      setViewMessages(res?.data?.data)
    }
  }

  const handleAcceptOrRejectConnection = async(connection:Connection, connectionAccepted:boolean, index:number ) => {
    setButtonLoading(index)
    setAccept(connectionAccepted)
    const payload = {
      "connectionReqId": connection?.id,
      "connection_accepted": connectionAccepted,
      "studentId": roleId
     }
    try {
      const res = await connect(payload).unwrap()
      if(res.status === 204 || res.status === 200 ){
        if (!connectionAccepted) {
          toast.success("Invite declined")
        } else {
          toast.success("Connected")
        }
      }
    } catch (error:any) {
      toast.error(error.data.message)
    } finally{
      removeConnectionRequest(index)
      getMessagesFunc()
    }
  }

  const removeConnectionRequest = (index) => {
    setCombineMsgAndConns(combineMsgAndConns => {
      return combineMsgAndConns.filter((_, i) => i !== index)
    })
  }

  useEffect(()=>{
    getMessagesFunc()
  }, [senderRole, roleId, recent])

  useEffect(()=>{
    if(openMessage){
      setOpenMessage(false)
    }
  }, [open])

  useEffect(()=>{
    setCombineMsgAndConns(combineMessageAndConnections(messages, data?.data))
  },[data, messages])

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current?.scrollHeight;
    }
  }, [viewMessages]);

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
            {(isLoading || isLoadingConns )? <LoadingSpinner className="h-[250px]" /> :
            combineMsgAndConns?.map((message:any, index:number)=> message?.type === 'message'?
              <div className="mb-5" key={"msg-request-"+index} onClick={()=>handleViewMessage(message)}>
                <div className="flex flex-row gap-x-3 justify-between cursor-pointer" >
                  <p><span className="font-semibold mr-1 capitalize">James Sparks</span>{message?.message_text}</p>
                  <span className="w-[75px] text-sm text-right">{dateTimeDifference(message?.create_date)}</span>
                </div>
              </div>:
              <div className="mb-5" key={"conn-"+index} >
                <div className="mb-2 flex flex-row gap-x-3 justify-between cursor-pointer">
                  <p><span className="font-semibold mr-1 capitalize ">{message?.recruiterName}</span> has sent you an invitation to connect. Would you like to share your information and connect? </p>
                  <span className="w-[75px] text-sm text-right">{dateTimeDifference(message?.requestDate)}</span>
                </div>
                <div className="flex flex-row gap-x-3">
                  <Button variant="outline" size="sm" className="h-7" loading={!accept && connecting && buttonLoading === index} loadingText="Rejecting..." onClick={()=>handleAcceptOrRejectConnection(message, false, index)}>No</Button>

                  <Button variant="default" size="sm" className="h-7" loading={accept && connecting && buttonLoading === index} loadingText="Accepting..." onClick={()=>handleAcceptOrRejectConnection(message, true, index)}>Yes</Button>
                </div>
              </div>
            )}
            {combineMsgAndConns?.length < 1 && !isLoading ? <h2 className="font-[500] text-sm md:text-base">No notification found!</h2>:null}
          </div> :
          <div className="h-full flex flex-col gap-y-3" key={viewMessages}>
            <div className="flex justify-end mt-3 "><Button variant={'ghost'} title="Close Message" size="sm" className="h-5 px-1" onClick={()=>{setOpenMessage(false); resetForm()}}><X className="h-3 w-3 text-gray-400 cursor-pointer" /></Button></div>
            <div className="w-full h-full pb-3 overflow-y-auto" ref={messagesEndRef}>
              {
                viewMessages?.length < 1 ? <LoadingSpinner className="h-[250px]" />: viewMessages?.map((message:any, index)=>
                  <div className="mb-4" key={index}>
                    <div className={`flex ${message?.sender_role === senderRole ? "justify-end" : "justify-start"}`}>
                      <p className={`w-fit max-w-[90%] p-3 rounded-md text-sm ${message?.sender_role === senderRole ? "bg-green-100" : "bg-primary/10"}`}>
                        <span className="mb-2">{message?.message_text}</span>
                        <span className="text-[10px] text-muted-foreground block text-right">{moment(message?.create_date).format('LLL')}</span>
                      </p>
                    </div>
                  </div>
                )
              }
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
                      loading={sendingMessage}
                      disabled={viewMessages?.length < 1 && true}
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