import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, ChevronRight, Save } from "lucide-react";

export default function NewsFeedEventForm() {
  return (
    <>
      <div className="">
        <div className="p-4 md:px-16 flex flex-col h-[calc(100vh_-_14rem)] overflow-y-scroll">
          <form>
            <div className="flex-1">
              <label htmlFor="school_details" className="text-sm font-bold">News Feed and Events</label>
              <span className="text-xs block my-3">This can be any RSS feed your school uses. </span>
              <div>
                <div className="flex flex-col gap-y-2 md:flex-row md:gap-x-8">
                  <Input
                    label="New Feed Title"
                    labelClass="text-xs font-normal text-[#61646B]"
                    className="w-full lg:w-[32rem]"
                  />
                  <div className="flex-1">
                    <Input
                      label="News Feed URL"
                      labelClass="text-xs font-normal text-[#61646B]"
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <label htmlFor="school_details" className="text-sm font-bold">School Call to Action Buttons</label>
                <div className="flex flex-col gap-y-2 md:flex-row md:gap-x-8">
                  <Input
                    label="Application Button CTA"
                    labelClass="text-xs font-normal text-[#61646B]"
                    className="w-full lg:w-[32rem]"
                  />
                  <div className="flex-1">
                    <Input
                      label="Application Portal URL"
                      labelClass="text-xs font-normal text-[#61646B]"
                      className="w-full"
                    />
                  </div>
                </div>
                <span className="text-xs block my-3 w-[24rem]">This button will be shown on the school page, and urge an interested student to apply. We suggest a CTA of Apply Now, but a custom message can be used. </span>
              </div>
              <div className="mt-4">
                <div className="flex flex-col gap-y-2 md:flex-row md:gap-x-8">
                  <Input
                    label="Inquiries Button CTA"
                    labelClass="text-xs font-normal text-[#61646B]"
                    className="w-full lg:w-[32rem]"
                  />
                  <div className="flex-1">
                    <Input
                      label="Interested Inquiries URL"
                      labelClass="text-xs font-normal text-[#61646B]"
                      className="w-full"
                    />
                  </div>
                </div>
                <span className="text-xs block my-3 w-[24rem]">This button will be shown on the school page, and links to a location where a student can submit an inquiry. We suggest a CTA of Learn More, but a custom message can be used. </span>
              </div>
            </div>
          </form>
        </div>
        <div className="border-t-2 border-t-[#880505] bg-[#F0F4F7] p-4 flex justify-between items-center md:px-16">
          <div className="flex gap-x-4 items-center">
            {/* <Button
                variant="outline"
                className="text-xs h-7 rounded-sm px-3"
              ><X className="w-3 h-3 mr-1" /> Discard</Button> */}
            <Button
              variant="outline"
              className="text-xs h-7 rounded-sm px-3"
            ><Save className="w-3 h-3 mr-1" /> Save for Later</Button>
          </div>
          <div className="flex gap-x-4 items-center">
            <Button
              variant="outline"
              className="text-xs h-7 rounded-sm px-6"
            ><ChevronLeft className="w-3 h-3 mr-1" /> Back</Button>
            <Button
              className="text-xs h-7 rounded-sm px-6"
            // onClick={() => setCurrentProgress('')}
            >Next <ChevronRight className="w-3 h-3 ml-1" /></Button>
          </div>
        </div>
      </div>
    </>
  )
}
