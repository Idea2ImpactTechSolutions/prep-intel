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


export default function MySchool() {
    const [currentProgress, setCurrentProgress] = useState('BASIC_INFORMATION')
    return (
        <>
            <EmptyStateContainer
                show={false}
                pageTitle="My School"
                title="Welcome to the “My School” Tab!"
                content=" Creating your school's profile is the key to unlocking the potential of this platform. Not only does it allow eager students to discover and learn about the unique offerings of your institution, but it also empowers them to gauge their chances of acceptance and visualize their academic future with you. By curating a compelling and informative profile, you're taking a significant step toward broadening your reach, attracting the right talent, and streamlining the admissions process."
                onClick={() => null}
            />
            <section className="hidde">
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
        </>
    )
}
