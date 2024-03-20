"use client"
import PageTitleContainer from "@/components/page-title";
import { Button } from "@/components/ui/button";
import { setSchoolInformation } from "@/redux/features/school/managerSlice";
import { useLazyGetSchoolProfileQuery } from "@/redux/services/school/managerApi";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { Dictionary } from "@/types/dictionary";
import moment from 'moment';
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import SchoolInformation from "../../../_components/school-information";
import LoadingSpinner from "../../../_components/loading-spinner";


// type PROGRESS_TYPE = 'BASIC_INFORMATION' | 'ACADEMIC_INFORMATION' | 'CAMPUS_INFORMATION' | 'EXTRA_CURRICULAR_INFORMATION' | 'NEWS_FEED_EVENT' | 'PREVIEW_INFORMATION'


export default function MySchool() {
    const [isFetchedProfile, setIsFetechProfile] = useState<boolean>(false)
    const [getSchoolProfile, {isLoading: isLoadingGetProfile, isFetching: isFetchingSchoolProfile, isSuccess:isSuccessGetProfile}] = useLazyGetSchoolProfileQuery()
    const { manager: { school_information: { school_data } } }: Dictionary = useAppSelector((state) => state.manager)

    const router = useRouter()
    const pageParams = useParams();
    const schoolId = pageParams?.id;

    const dispatch = useAppDispatch()

    const handleGetSchoolInformation = async (schoolId) => {
        getSchoolProfile(schoolId)
            .unwrap()
            .then((payload) => {
                const { data } = payload
                setIsFetechProfile(true)
                dispatch(setSchoolInformation({ slug: 'school_data', data: data }))
            })
      }

      useEffect(() => {
        if(schoolId){
          !isFetchedProfile && handleGetSchoolInformation(schoolId)
        }
    }, [])

    if (isLoadingGetProfile || isFetchingSchoolProfile) {
        return <LoadingSpinner />;
      }

    return (
        <>
            <div className="">
                <div className=" flex flex-col overflow-y-auto">
                    <div className="container mx-auto p-4 pt-6 px-0 md:px-11 ">
                        <h1 className="p-4 text-xl font-bold text-gray-800 mb-6 md:p-0">
                            My School
                        </h1>
                    </div>
                    <div className="border-t"> </div>
                    <PageTitleContainer
                        title={
                            <>
                                {school_data?.name || "University of Saturn"}
                                <div className="flex flex-col text-xs font-normal">
                                    <span className="capitalize">{school_data?.tagline || "You’re going to love it out here"}</span>
                                    <span className="italic">Founded {moment(school_data?.found_date).format('YYYY') || "2046"}</span>
                                </div>
                            </>
                        }
                        titleClass="text-sm"
                        className="md:px-16"
                        rightContent={
                            <Button
                                    variant={"outline"}
                                    className="text-xs h-8 rounded-sm px-3"
                                    onClick={() => router.push('/school/school-profile')}
                                >
                                    Edit School
                                </Button>
                        }
                    />
                    <SchoolInformation schoolData={school_data}/>
                </div>
            </div>
        </>
    )
}
