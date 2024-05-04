"use client"

import { useState, useEffect } from "react"
import SheetPanel from "@/components/custom-sheet"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSession } from "next-auth/react";
import { useLazyGetConnectionRequestsQuery } from "@/redux/services/student/studentApi";

const NavItems =()=>{
  const session = useSession()
  const studentId = session?.data?.user?.roleId
  const [getConnectionRequest, {data:connectionRequests, isLoading:loadingConnections} ] = useLazyGetConnectionRequestsQuery()
  const [updateConnection]

  const [open, setOpen] = useState(false)

  console.log(connectionRequests)

  useEffect(()=>{
    if(studentId){
      getConnectionRequest(studentId)
    }
  }, [studentId])

  return (
    <div className="">
      <div className="relative" onClick={()=>setOpen(true)}>
        <Bell className="w-4 h-4"/>
        <span className="w-1 h-1 rounded-full bg-red-500 absolute right-0 top-0.5"></span>
      </div>
      <SheetPanel
          show={open}
          title={`Notifications`}
          handleClose={() => setOpen(false)}
          width={580}
      >
          <div className="mt-8 pb-16 h-[90vh] overflow-y-auto lg:mx-5">
            <div className="mb-8">
              <div className="flex justify-between">
                <div className="flex flex-row">                
                  <span> <h2 className="font-semibold inline-block">Ralph Edwards</h2> has sent you an invitation to connect. Would you like to share your information and connect?</span>
                  <span>49m</span>
                </div>
              </div>
              <div className="flex gap-x-3 mt-2">
                <Button variant="outline" className="h-7">No</Button> 
                <Button className="h-7">Yes</Button>
              </div>
            </div>
            <div className="mb-8">
              <div className="flex justify-between">
                <div className="flex flex-row">                
                  <span> <h2 className="font-semibold inline-block">Ralph Edwards</h2> has sent you an invitation to connect. Would you like to share your information and connect?</span>
                  <span>49m</span>
                </div>
              </div>
              <div className="flex gap-x-3 mt-2">
                <Button variant="outline" className="h-7">No</Button> 
                <Button className="h-7">Yes</Button>
              </div>
            </div>
            <div className="mb-8">
              <div className="flex justify-between">
                <div className="flex flex-row">                
                  <span> <h2 className="font-semibold inline-block">Ralph Edwards</h2> has sent you an invitation to connect. Would you like to share your information and connect?</span>
                  <span>49m</span>
                </div>
              </div>
              <div className="flex gap-x-3 mt-2">
                <Button variant="outline" className="h-7">No</Button> 
                <Button className="h-7">Yes</Button>
              </div>
            </div>
            <div className="mb-8">
              <div className="flex flex-row justify-between">                
                <span> <h2 className="font-semibold inline-block">Ralph Edwards</h2> has sent you a message. Click to view? </span>
                <span>49m</span>
              </div>
            </div>
          </div>
      </SheetPanel>
    </div>
  )
}

export default NavItems