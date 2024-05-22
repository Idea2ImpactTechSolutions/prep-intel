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
import SchoolInformation from "@/components/school-information";
import LoadingSpinner from "@/components/loading-spinner";

export default function MySchool() {
    const [isFetchedProfile, setIsFetchedProfile] = useState<boolean>(false)
    const [getSchoolProfile, {isLoading: isLoadingGetProfile, isFetching: isFetchingSchoolProfile }] = useLazyGetSchoolProfileQuery()
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
                setIsFetchedProfile(true)
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
            <div>
                <div className="flex flex-col overflow-y-auto">
                    <PageTitleContainer
                        title={
                            <>
                                {school_data?.name}
                                { school_data?.found_date && <div className="flex flex-col text-xs font-normal">
                                    <span className="capitalize">{school_data?.tagline}</span>
                                    <span className="italic">Founded {moment(school_data?.found_date).format('YYYY')}</span>
                                </div> }
                            </>
                        }
                        titleClass="text-sm"
                        rightContent={
                          <Button
                              variant={"outline"}
                              className="text-xs h-8 rounded-sm px-3"
                              onClick={() => router.push(`/school/${schoolId}/school-profile`)}
                          >
                              Edit School
                          </Button>
                        }
                    />

                    <div className="pi-container">
                      <SchoolInformation schoolData={school_data} />
                    </div>
                </div>
            </div>
        </>
    )
}
