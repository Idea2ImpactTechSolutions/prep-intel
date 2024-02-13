import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ChevronLeft, ChevronRight, ImagePlus, Save } from "lucide-react"
import { CAMPUS_AMENITIES, EXTRA_CURRICULARS } from "../../data"
import CustomCheckbox from "@/components/custom-checkbox"
import CustomFileInput from "@/components/custom-file-input"


export default function ExtraCurricularsForm() {
  return (
    <div className="">
      <div className="p-4 md:px-16 flex flex-col h-[calc(100vh_-_14rem) overflow-y-scroll">
        <form>
          <div className="flex-1 md:w-3/4">
            <div className="">
              <label htmlFor="school_details" className="text-sm font-bold">Extra-Curriculars</label>
              <div className="grid grid-cols-3 items-center gap-x-3  md:grid-cols-4 md:gap-x-8">
                {
                  EXTRA_CURRICULARS.ACADEMIC_PROFESSIONAL.map(({ id, name, isChecked }) => (
                    <div
                      id={id}
                      className="mt-4 flex flex-col gap-y-1">
                      <CustomCheckbox
                        label={name}
                        labelClass="text-xs font-normal text-[#61646B]"
                        key={2}
                      />
                    </div>
                  ))
                }
              </div>
            </div>
            <div className="mt-6">
              <label htmlFor="school_details" className="text-sm font-bold">Extra-Curriculars</label>
              <div className="grid grid-cols-3 items-center gap-x-3  md:grid-cols-4 md:gap-x-8">
                {
                  EXTRA_CURRICULARS.ARTS_PERFOMANCE.map(({ id, name, isChecked }) => (
                    <div
                      id={id}
                      className="mt-4 flex flex-col gap-y-1">
                      <CustomCheckbox
                        label={name}
                        labelClass="text-xs font-normal text-[#61646B]"
                        key={2}
                      />
                    </div>
                  ))
                }
              </div>
            </div>
            <div className="mt-6">
              <label htmlFor="school_details" className="text-sm font-bold">Extra-Curriculars</label>
              <div className="grid grid-cols-3 items-center gap-x-3  md:grid-cols-4 md:gap-x-8">
                {
                  EXTRA_CURRICULARS.ATHLETICS_PHYSICAL_ACTIVITIES.map(({ id, name, isChecked }) => (
                    <div
                      id={id}
                      className="mt-4 flex flex-col gap-y-1">
                      <CustomCheckbox
                        label={name}
                        labelClass="text-xs font-normal text-[#61646B]"
                        key={2}
                      />
                    </div>
                  ))
                }
              </div>
            </div>
            <div className="mt-6">
              <label htmlFor="school_details" className="text-sm font-bold">Extra-Curriculars</label>
              <div className="grid grid-cols-3 items-center gap-x-3  md:grid-cols-4 md:gap-x-8">
                {
                  EXTRA_CURRICULARS.SOCIAL_CULTURAL.map(({ id, name, isChecked }) => (
                    <div
                      id={id}
                      className="mt-4 flex flex-col gap-y-1">
                      <CustomCheckbox
                        label={name}
                        labelClass="text-xs font-normal text-[#61646B]"
                        key={2}
                      />
                    </div>
                  ))
                }
              </div>
            </div>
            <div className="mt-6">
              <label htmlFor="school_details" className="text-sm font-bold">Extra-Curriculars</label>
              <div className="grid grid-cols-3 items-center gap-x-3  md:grid-cols-4 md:gap-x-8">
                {
                  EXTRA_CURRICULARS.SERVICE_COMMUNITY.map(({ id, name, isChecked }) => (
                    <div
                      id={id}
                      className="mt-4 flex flex-col gap-y-1">
                      <CustomCheckbox
                        label={name}
                        labelClass="text-xs font-normal text-[#61646B]"
                        key={2}
                      />
                    </div>
                  ))
                }
              </div>
            </div>
            <div className="mt-6">
              <label htmlFor="school_details" className="text-sm font-bold">Extra-Curriculars</label>
              <div className="grid grid-cols-3 items-center gap-x-3  md:grid-cols-4 md:gap-x-8">
                {
                  EXTRA_CURRICULARS.SPECIAL_INTEREST_HOBBIES.map(({ id, name, isChecked }) => (
                    <div
                      id={id}
                      className="mt-4 flex flex-col gap-y-1">
                      <CustomCheckbox
                        label={name}
                        labelClass="text-xs font-normal text-[#61646B]"
                        key={2}
                      />
                    </div>
                  ))
                }
              </div>
            </div>
            <div className="mt-6">
              <label htmlFor="school_details" className="text-sm font-bold">Extra-Curriculars</label>
              <div className="grid grid-cols-3 items-center gap-x-3  md:grid-cols-4 md:gap-x-8">
                {
                  EXTRA_CURRICULARS.RELIGIOUS_FAITH_BASED.map(({ id, name, isChecked }) => (
                    <div
                      id={id}
                      className="mt-4 flex flex-col gap-y-1">
                      <CustomCheckbox
                        label={name}
                        labelClass="text-xs font-normal text-[#61646B]"
                        key={2}
                      />
                    </div>
                  ))
                }
              </div>
            </div>
            <div className="mt-6">
              <label htmlFor="school_details" className="text-sm font-bold">Extra-Curriculars</label>
              <div className="grid grid-cols-3 items-center gap-x-3  md:grid-cols-4 md:gap-x-8">
                {
                  EXTRA_CURRICULARS.LEADERSHIP_ADVOCACY.map(({ id, name, isChecked }) => (
                    <div
                      id={id}
                      className="mt-4 flex flex-col gap-y-1">
                      <CustomCheckbox
                        label={name}
                        labelClass="text-xs font-normal text-[#61646B]"
                        key={2}
                      />
                    </div>
                  ))
                }
              </div>
            </div>
            <div className="my-6">
              <label htmlFor="school_details" className="text-sm font-bold">Extra-Curriculars</label>
              <div className="grid grid-cols-3 items-center gap-x-3  md:grid-cols-4 md:gap-x-8">
                {
                  EXTRA_CURRICULARS.TECHNOLOGY_DIGITAL_MEDIA.map(({ id, name, isChecked }) => (
                    <div
                      id={id}
                      className="mt-4 flex flex-col gap-y-1">
                      <CustomCheckbox
                        label={name}
                        labelClass="text-xs font-normal text-[#61646B]"
                        key={2}
                      />
                    </div>
                  ))
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
