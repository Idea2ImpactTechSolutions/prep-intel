import CustomDatePicker from "@/components/custom-date-picker";
import CustomFileInput from "@/components/custom-file-input";
import CustomSelect from "@/components/custom-select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft, ChevronRight, File, Image, ImagePlus, Save, X } from "lucide-react";


export default function BasicInformationForm() {
  return (
    <>
      <div className="">
        <div className="p-4 md:px-16 flex flex-col h-[calc(100vh_-_14rem)] overflow-y-scroll">
          <form>
            <div className="flex-1">
              <div className="flex flex-col gap-y-4 md:flex-row md:gap-x-8">
                <div className="flex gap-x-8">
                  <div>
                    <label htmlFor="logo" className="text-sm font-bold">Upload Your Logo</label>
                    <CustomFileInput
                      children={
                        <div className="border border-dashed border-gray-400 w-32 h-32 grid place-content-center rounded-[5px]">
                          <ImagePlus className="w-10 h-10 text-gray-400" />
                        </div>
                      }
                    />
                  </div>
                  <div className="flex-1">
                    <label htmlFor="school_details" className="text-sm font-bold">School Details</label>
                    <div className="flex flex-col gap-y-2">
                      <Input
                        label="School Name"
                        labelClass="text-xs font-normal text-[#61646B]"
                        className="w-full md:w-[22rem]"
                      />
                      <Textarea
                        label="School Tagline"
                        labelClass="text-xs font-normal text-[#61646B]"
                        rows={1}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="grid grid-cols-1 gap-y-3 gap-x-4 md:grid-cols-3 md:mt-5">
                    <CustomDatePicker
                      label="Founded Date"
                      labelClass="text-xs font-normal text-[#61646B]"
                    />
                    <CustomSelect
                      label="Institution Type"
                      labelClass="text-xs font-normal text-[#61646B]"
                      options={[]}
                      selected=""
                      setSelected={() => null}
                    />
                    <CustomSelect
                      label="School Primary Color"
                      labelClass="text-xs font-normal text-[#61646B]"
                      options={[]}
                      selected=""
                      setSelected={() => null}
                    />
                  </div>
                  <div className="mt-2">
                    <Textarea
                      label="School Affiliations, Separated by Comma"
                      labelClass="text-xs font-normal text-[#61646B]"
                      rows={1}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-sm font-bold">Contact Information</h3>
                <div className="flex flex-col gap-y-4 gap-x-4 md:items-center md:flex-row">
                  <div className="flex-1">
                    <Input
                      label="School Street Address"
                      labelClass="text-xs font-normal text-[#61646B]"
                    />
                  </div>
                  <div className="flex gap-x-4 items-center">
                    <div className="flex-1 md:w-[20rem]">
                      <CustomSelect
                        label="Institution Type"
                        labelClass="text-xs font-normal text-[#61646B]"
                        options={[]}
                        selected=""
                        setSelected={() => null}
                      />
                    </div>
                    <Input
                      label="Zip"
                      labelClass="text-xs font-normal text-[#61646B]"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex flex-col gap-y-4 gap-x-4 md:items-center md:flex-row">
                  <div className="flex gap-x-4 items-center md:flex-1">
                    <div className="w-1/2 md:w-[16rem]">
                      <CustomSelect
                        label="Contact Type"
                        labelClass="text-xs font-normal text-[#61646B]"
                        options={[]}
                        selected=""
                        setSelected={() => null}
                      />
                    </div>
                    <div className="flex-1">
                      <Input
                        label="Phone Number"
                        labelClass="text-xs font-normal text-[#61646B]"
                      />
                    </div>
                  </div>
                  <div className="md:w-[32rem]">
                    <Input
                      label="Email Address"
                      type="email"
                      labelClass="text-xs font-normal text-[#61646B]"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex flex-col gap-y-4 gap-x-4 md:items-center md:flex-row">
                  <div className="md:w-[20rem]">
                    <CustomSelect
                      label="School Social Media Platform"
                      labelClass="text-xs font-normal text-[#61646B]"
                      options={[]}
                      selected=""
                      setSelected={() => null}
                    />
                  </div>
                  <div className="md:flex-1">
                    <Input
                      label="Social Media URL"
                      labelClass="text-xs font-normal text-[#61646B]"
                    />
                  </div>
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
