import PageTitleContainer from "@/components/page-title";
import { Button } from "@/components/ui/button";
import { ArrowUpFromLine, ChevronLeft, Save } from "lucide-react";

export default function PreviewSchoolInformation() {
    return (
        <>
            <div className="">
                <div className="p-4 px-0 md:px-16 flex flex-col h-[calc(100vh_-_14rem)] overflow-y-scroll">
                    <PageTitleContainer
                        title={
                            <>
                                University of Saturn
                                <div className="flex flex-col text-xs font-normal">
                                    <span>“You’re going to love it out here”</span>
                                    <span className="italic">Founded 2046</span>
                                </div>
                            </>
                        }
                        titleClass="text-sm"
                        className="md:px-0"
                        rightContent={
                            <Button
                                variant={"outline"}
                                className="text-xs h-8 rounded-sm px-3"
                            >
                                Bookmark School
                            </Button>
                        }
                    />
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
                        >Save & Publish <ArrowUpFromLine className="w-3 h-3 ml-1" /></Button>
                    </div>
                </div>
            </div>
        </>
    )
}
