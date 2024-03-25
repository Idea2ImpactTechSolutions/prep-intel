import CustomCheckbox from "@/components/custom-checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, ChevronRight, ImagePlus, Save } from "lucide-react";
import { CAMPUS_AMENITIES } from "../../data";
import CustomFileInput from "@/components/custom-file-input";
import { Textarea } from "@/components/ui/textarea";

export default function CampusInformation() {
  return (
    <div className="">
      <div className="p-4 md:px-16 flex flex-col h-[calc(100vh_-_14rem)] overflow-y-scroll">
        <form>
          <div className="flex-1">
            <div>
              <label htmlFor="Campus_Introductory_Paragraph" className="text-sm font-bold">Campus Information</label>
              <Textarea
                label="Campus Introductory Paragraph"
                labelClass="text-xs font-normal text-[#61646B]"
                className="w-full"
              />
            </div>
            <div className="mt-4">
              <label htmlFor="school_details" className="text-sm font-bold">Campus Amenities</label>
              <div className="grid grid-cols-3 items-center gap-x-3  md:grid-cols-6 md:gap-x-8">
                {
                  CAMPUS_AMENITIES.map(({ id, name, isChecked }) => (
                    <div
                      id={id}
                      key={id}
                      className="mt-4 flex flex-col gap-y-1">
                      <CustomCheckbox
                        label={name}
                        labelClass="text-xs font-normal text-[#61646B]"
                        key={id}
                      />
                    </div>
                  ))
                }
              </div>
            </div>
            <div className="mt-6">
              <label htmlFor="school_details" className="text-sm font-bold block mb-2">Upload Campus Images (0/8)</label>
              <div className="grid grid-cols-3 gap-4 md:grid-cols-6 md:gap-x-8 md:gap-y-5">
                {
                  Array.from(({ length: 8 }), function (index) {
                    return (
                      // @ts-ignore
                      <CustomFileInput key={Date.now}>
                          <div className="border border-dashed border-gray-400 h-32 grid place-content-center rounded-[5px]">
                            <ImagePlus className="w-10 h-10 text-gray-400" />
                          </div>
                      </CustomFileInput>
                    )
                  })
                }
              </div>
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
  )
}
