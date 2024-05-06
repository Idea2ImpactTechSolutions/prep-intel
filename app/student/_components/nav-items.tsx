"use client"

import SheetPanel from "@/components/custom-sheet"
import LoadingSpinner from "@/components/loading-spinner";
import { Button } from "@/components/ui/button"
import {  useUpdateConnectionRequestsMutation } from "@/redux/services/student/studentApi";

interface NavItemsProp {
  open:boolean,
  setOpen:(value:boolean)=>void
  loadingConnections: boolean,
  connectionRequests: any
}

const NavItems =({open, setOpen, loadingConnections, connectionRequests}:NavItemsProp)=>{
  // const [updateConnection, {isLoading}] = useUpdateConnectionRequestsMutation()

  return (
    <div className="">
      
      <SheetPanel
          show={open}
          title={`Notifications`}
          handleClose={() => setOpen(false)}
          width={580}
      >
          <div className="mt-8 pb-16 h-[90vh] overflow-y-auto lg:mx-5">
            {loadingConnections ? <LoadingSpinner className="h-[250px]" /> :
            connectionRequests?.map((connectionRequest, index:number)=><div className="mb-8">
              <div className="flex justify-between" key={"conn-request-"+index}>
                <div className="flex flex-row">                
                  <span> <h2 className="font-semibold inline-block">Ralph Edwards</h2> has sent you an invitation to connect. Would you like to share your information and connect?</span>
                  <span>49m</span>
                </div>
              </div>
              <div className="flex gap-x-3 mt-2">
                <Button variant="outline" className="h-7">No</Button> 
                <Button className="h-7">Yes</Button>
              </div>
            </div>)
            }
            
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