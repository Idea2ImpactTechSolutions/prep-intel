"use client"
import PageTitleContainer from "@/components/page-title";
import { useState } from "react";
import AcademicInformationForm from "./_components/create-profile-form/academic-information";
import BasicInformationForm from "./_components/create-profile-form/basic-information";
import CampusInformation from "./_components/create-profile-form/campus-information";
import ExtraCurricularsForm from "./_components/create-profile-form/extra-curriculars-information";
import NewsFeedEventForm from "./_components/create-profile-form/newsfeed-event-information";
import ProfileCreationProgress from "./_components/profile-creation-progress";
import EmptyStateContainer from "@/components/empty-state";
import PreviewSchoolInformation from "./_components/create-profile-form/preview-school-information";
import { Button } from "@/components/ui/button";
import BottomBar from "../shared/bottom-bar";
import { CompletionPanel } from "@/components/completion-panel";


type PROGRESS_TYPE = 'BASIC_INFORMATION' | 'ACADEMIC_INFORMATION' | 'CAMPUS_INFORMATION' | 'EXTRA_CURRICULAR_INFORMATION' | 'NEWS_FEED_EVENT' | 'PREVIEW_INFORMATION'


export default function MySchool() {
    const [currentProgress, setCurrentProgress] = useState<PROGRESS_TYPE>('BASIC_INFORMATION')

    return (
        <>
            <section className="hidden">
                <PageTitleContainer
                    title={`${currentProgress !== 'PREVIEW_INFORMATION' ? "Create Your School’s Profile" : "Preview of Your School’s Profile"}`}
                    titleClass="text-sm"
                    rightContent={
                        <ProfileCreationProgress
                            progressValue={currentProgress === 'PREVIEW_INFORMATION' ? 100 : 0}
                            step={currentProgress === 'PREVIEW_INFORMATION' ? 5 : 1}
                        />
                    }
                />
                <section className="">

                   {currentProgress === 'BASIC_INFORMATION' && <BasicInformationForm/>}
                   {currentProgress === 'ACADEMIC_INFORMATION' && <AcademicInformationForm/>}
                   {currentProgress === 'CAMPUS_INFORMATION' && <CampusInformation/>}
                   {currentProgress === 'EXTRA_CURRICULAR_INFORMATION' && <ExtraCurricularsForm/>}
                   {currentProgress === 'NEWS_FEED_EVENT' && <NewsFeedEventForm/>}
                   {currentProgress === 'PREVIEW_INFORMATION' && <PreviewSchoolInformation/>}

                </section>
            </section>


            <div className="">
                <div className=" flex flex-col h-[calc(100vh_-_14rem)] overflow-y-scroll">
                    <div className="container mx-auto p-4 pt-6 px-0 md:px-11 ">
                        <CompletionPanel percentCompleted={100} title={"5/5"}></CompletionPanel>
                        <h1 className="text-xl font-bold text-gray-800 mb-6">
                            Preview of Your School’s Profile
                        </h1>
                    </div>
                    <div className="border-t"> </div>
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
                            className="md:px-0 md:px-16"
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
                    <BottomBar
                        onBack={() => null}
                        onSaveForLater={() => null}
                        isBackDisabled={true}
                        isSubmitting={false}
                    />
            </div>
        </>
    )
}
