"use client"

import {useCallback, useEffect, useRef, useState} from "react"
import SheetPanel from "@/components/custom-sheet"
import LoadingSpinner from "@/components/loading-spinner";
import { Button } from "@/components/ui/button"
import { useSession } from "next-auth/react";
import { ChevronLeft, X } from "lucide-react";
import { useFormik } from "formik";
import * as yup from "yup"
import { Textarea } from "./ui/textarea";
import { useLazyGetMessagesQuery, useSendMessageMutation} from "@/redux/services/user/userApi";
import { toast } from "sonner";
import { useLazyGetConnectionRequestsQuery, useUpdateConnectionRequestsMutation } from "@/redux/services/student/studentApi";
import { FaUser as DefaultProfileImage  } from "react-icons/fa";
import { MessageRow } from "@/components/notification-panel/message-row";

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

  const [openMessage, setOpenMessage] =useState(false)
  const [accept, setAccept] =useState<boolean |undefined>()
  const [recent] =useState(true)
  const [messages, setMessages] =useState<any>([])
  const [viewMessages, setViewMessages] =useState<any>([])
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
        const res = await sendMessage({
                                        recruiterId: viewMessages[0]?.recruiter_id,
                                        studentId:viewMessages[0]?.student_id,
                                        senderRole:senderRole,
                                        message:values?.message})
                                        .unwrap()
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


  const getLastMessagePreview = (message) => {
    if (message.sender_role === senderRole) {
      return `You: ${message.message_text}`;
    }
    return message.message_text;
  };

  const getProfileImage = (message) => {
    const imgUrl = message.sender_role !== senderRole ? message.sender_image : message.receiver_image;
    return imgUrl ? <img src={imgUrl} alt="Profile" className="w-full h-full object-cover" /> : <DefaultProfileImage />;
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current?.scrollHeight;
    }
  }, [viewMessages]);

  return (
    <div className="">
      <SheetPanel
          show={open}
          title={!openMessage ? 'Notifications' : (<div className="flex">
            <div className="rounded-full h-8 w-8 bg-white cursor-pointer flex justify-center items-center mr-3" onClick={() => setOpenMessage(false)}>
              <ChevronLeft className="h-6 w-6" />
            </div> {combineMsgAndConns[0]?.sender_name}
          </div>
          )}
          handleClose={() => setOpen(false)}
          width={450}
        >
        {!openMessage ?
    <div className="notification-view">
            {(isLoading || isLoadingConns )? <LoadingSpinner className="h-[250px]" /> :
        combineMsgAndConns?.map((message, index) => message?.type === 'message' ?
          <MessageRow
            className="cursor-pointer"
            key={"msg-request-" + index}
            onClick={() => handleViewMessage(message)}
            profileImage={getProfileImage(message)}
            from={message.sender_name}
            sentAt={message.create_date}>
            <p>{getLastMessagePreview(message)}</p>
          </MessageRow>
          :
          <MessageRow
            key={"conn-" + index}
            profileImage={<DefaultProfileImage />}
            from={message.recruiterName}
            sentAt={message.requestDate}>
            <p>
              {message?.recruiterName} has sent you an invitation to connect.
              Would you like to share your information and connect?
            </p>
            <div className="flex gap-x-3 mt-2">
              <Button variant="outline" size="sm" className="h-7" loading={!accept && connecting && buttonLoading === index} loadingText="Rejecting..." onClick={() => handleAcceptOrRejectConnection(message, false, index)}>No</Button>
              <Button variant="default" size="sm" className="h-7" loading={accept && connecting && buttonLoading === index} loadingText="Accepting..." onClick={() => handleAcceptOrRejectConnection(message, true, index)}>Yes</Button>
              </div>
          </MessageRow>
            )}
            {combineMsgAndConns?.length < 1 && !isLoading ? <h2 className="font-[500] text-sm md:text-base">No notification found!</h2>:null}
    </div>
    :
    <div className="user-thread-view h-full flex  flex-col" key={viewMessages}>
      <div className="flex-grow overflow-y-auto" ref={messagesEndRef}>
              {
          viewMessages?.length < 1 ? <LoadingSpinner className="h-[250px]" /> : viewMessages?.map((message, index) =>
            <MessageRow
              key={index}
              profileImage={message?.sender_image ? (<img src={message?.sender_image} alt="Profile" className="w-full h-full object-cover" />
                ) : <DefaultProfileImage />}
              from={message?.sender_name}
              sentAt={message?.create_date}>
              <p>{message?.message_text}</p>
              </MessageRow>)
              }
      </div>
      <div className=" pt-2">
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
                    error={errors.message} // Assuming Textarea handles error display
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