import CustomSelect from "@/components/custom-select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft, ChevronRight, Save } from "lucide-react";

export default function CreateRecruiter() {
    return (
        <>
            <div className="">
                <div className="p-4 md:px-16 flex flex-col h-[calc(100vh_-_14rem)] overflow-y-scroll">
                    <form>
                        <div className="flex-1">
                            <div>
                                <label htmlFor="school_details" className="text-sm font-bold">User Information</label>
                                <div className="grid grid-cols-1 gap-y-2 md:grid-cols-3 md:gap-x-8">
                                    <Input
                                        label="Full Name"
                                        labelClass="text-xs font-normal text-[#61646B]"
                                        className="w-full"
                                    />
                                    <Input
                                        label="Email Address"
                                        type="email"
                                        labelClass="text-xs font-normal text-[#61646B]"
                                        className="w-full"
                                    />
                                    <Input
                                        label="Phone Number"
                                        labelClass="text-xs font-normal text-[#61646B]"
                                        className="w-full"
                                    />
                                </div>
                            </div>
                            <div className="mt-4">
                                <div className="grid grid-cols-1 gap-y-2 md:grid-cols-3 md:gap-x-8">
                                    <CustomSelect
                                        label="Role Type"
                                        labelClass="text-xs font-normal text-[#61646B]"
                                        options={[]}
                                        selected=""
                                        setSelected={() => null}
                                        error={""}
                                    />
                                    <CustomSelect
                                        label="Permission Level"
                                        labelClass="text-xs font-normal text-[#61646B]"
                                        options={[]}
                                        selected=""
                                        setSelected={() => null}
                                        error={""}
                                    />
                                    <CustomSelect
                                        label="Department"
                                        labelClass="text-xs font-normal text-[#61646B]"
                                        options={[]}
                                        selected=""
                                        setSelected={() => null}
                                        error={""}
                                    />
                                </div>
                            </div>
                            <div className="mt-4">
                                <label htmlFor="school_details" className="text-sm font-bold">Temporary Information</label>
                                <div className="grid grid-cols-1 gap-y-2 md:grid-cols-2 md:gap-x-8">
                                    <Input
                                        label="Username"
                                        labelClass="text-xs font-normal text-[#61646B]"
                                        className="w-full"
                                    />
                                    <Input
                                        label="Password"
                                        type="password"
                                        labelClass="text-xs font-normal text-[#61646B]"
                                        className="w-full"
                                    />
                                </div>
                            </div>
                            <div className="mt-4">
                                <label htmlFor="school_details" className="text-sm font-bold">Invitation</label>
                                <div className="grid grid-cols-2 gap-y-2 md:grid-cols-1 md:gap-y-4">
                                    <Input
                                        label="Invitation Subject"
                                        labelClass="text-xs font-normal text-[#61646B]"
                                        className="w-full placeholder:text-xs placeholder:text-gray-400"
                                        placeholder="Please claim your account with Prep Intel"
                                    />
                                    <Textarea
                                        label="Invitation Message"
                                        labelClass="text-xs font-normal text-[#61646B]"
                                        className="w-full placeholder:text-xs placeholder:text-gray-400"
                                        placeholder="Prep Intel will help us have greater insight into interested students! I have created your account, all you have to do is claim it!"
                                        rows={3}
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
                        >Send Invitation <ChevronRight className="w-3 h-3 ml-1" /></Button>
                    </div>
                </div>
            </div>
        </>
    )
}
