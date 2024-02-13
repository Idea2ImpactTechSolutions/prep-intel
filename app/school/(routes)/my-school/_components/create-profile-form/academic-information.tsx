import CustomCheckbox from "@/components/custom-checkbox";
import CustomDatePicker from "@/components/custom-date-picker";
import CustomFileInput from "@/components/custom-file-input";
import CustomSelect from "@/components/custom-select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft, ChevronRight, ImagePlus, Save } from "lucide-react";


export default function AcademicInformationForm() {
  return (
    <>
      <div className="">
        <div className="p-4 md:px-16 flex flex-col h-[calc(100vh_-_14rem)] overflow-y-scroll">
          <form>
            <div className="flex-1">
              <div>
                <label htmlFor="school_details" className="text-sm font-bold">Academic Information</label>
                <div className="grid grid-cols-1 gap-y-2 md:grid-cols-3 md:gap-x-8">
                  <Input
                    label="Department or Program"
                    labelClass="text-xs font-normal text-[#61646B]"
                    className="w-full"
                  />
                  <Input
                    label="Accreditations"
                    labelClass="text-xs font-normal text-[#61646B]"
                    className="w-full"
                  />
                  <Input
                    label="Research Opportunities"
                    labelClass="text-xs font-normal text-[#61646B]"
                    className="w-full"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label htmlFor="school_details" className="text-sm font-bold">Admission Requirements</label>
                <div className="grid grid-cols-2 gap-x-2  md:flex md:gap-x-8">
                  <div className="mt-4 flex flex-col gap-y-1">
                    <CustomCheckbox
                      label="Act Required"
                      labelClass="text-xs font-normal text-[#61646B]"
                      key={2}
                    />
                    <Input
                      label="ACT Score Requirement"
                      labelClass="text-xs font-normal text-[#61646B]"
                      className="w-full"
                    />
                  </div>
                  <div className="mt-4 flex flex-col gap-y-1">
                    <CustomCheckbox
                      label="SAT Required"
                      labelClass="text-xs font-normal text-[#61646B]"
                      key={2}
                    />
                    <Input
                      label="SAT Score Requirement"
                      labelClass="text-xs font-normal text-[#61646B]"
                      className="w-full"
                    />
                  </div>
                  <div className="mt-4 flex flex-col gap-y-1">
                    <CustomCheckbox
                      label="SAT Required"
                      labelClass="text-xs font-normal text-[#61646B]"
                      key={2}
                    />
                    <Input
                      label="GPA Requirement"
                      labelClass="text-xs font-normal text-[#61646B]"
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <label htmlFor="school_details" className="text-sm font-bold">Financials</label>
                <div className="grid grid-cols-1 gap-y-2 md:grid-cols-3 md:gap-x-8">
                  <Input
                    label="In-State Tuition"
                    labelClass="text-xs font-normal text-[#61646B]"
                    className="w-full"
                  />
                  <Input
                    label="Out-of-State Tuition"
                    labelClass="text-xs font-normal text-[#61646B]"
                    className="w-full"
                  />
                  <Input
                    label="Fees Per Semester"
                    labelClass="text-xs font-normal text-[#61646B]"
                    className="w-full"
                  />
                </div>
              </div>
              <div className="mt-4">
                <div className="grid grid-cols-2 gap-x-2 md:gap-x-8">
                  <Input
                    label="Scholarship Information URL"
                    labelClass="text-xs font-normal text-[#61646B]"
                    className="w-full"
                  />
                  <Input
                    label="Financial Aid Information URL"
                    labelClass="text-xs font-normal text-[#61646B]"
                    className="w-full"
                  />
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
    </>
  )
}
