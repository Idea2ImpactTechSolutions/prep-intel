"use client"
import { CompletionPanel } from "@/components/completion-panel";
import PageTitleContainer from "@/components/page-title";
import { Button } from "@/components/ui/button";
import { setSchoolInformation } from "@/redux/features/school/managerSlice";
import { useLazyGetSchoolProfileQuery, usePublishSchoolProfileMutation } from "@/redux/services/school/managerApi";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { Dictionary } from "@/types/dictionary";
import moment from 'moment';
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import SchoolInformation from "../../../_components/school-information";
import BottomBar from "../../../_components/bottom-bar";
import LoadingSpinner from "../../../_components/loading-spinner";
import { useFormik } from "formik";
import { toast } from "sonner";

export default function SchoolPreview() {
    const [isFetchedProfile, setIsFetchedProfile] = useState<boolean>(false)
    const [getSchoolProfile, {isLoading: isLoadingGetProfile, isFetching: isFetchingSchoolProfile }] = useLazyGetSchoolProfileQuery()
    const { manager: { school_information: { school_data } } }: Dictionary = useAppSelector((state) => state.manager)

    const router = useRouter()
    const pageParams = useParams();
    const schoolId = pageParams?.id;

    const dispatch = useAppDispatch()
    const [publishSchoolProfileMutation, {isLoading: isPublishingSchool }] = usePublishSchoolProfileMutation()

    const handleGetSchoolInformation = async (schoolId) => {
        getSchoolProfile(schoolId)
            .unwrap()
            .then((payload) => {
                const { data } = payload
                setIsFetchedProfile(true)
                setFieldValue('school_id', data.id)
                dispatch(setSchoolInformation({ slug: 'school_data', data: data }))
            })
      }

    const handlePublishSchool = async (values: Dictionary) => {
        publishSchoolProfileMutation(values)
        .unwrap()
        .then((payload) => {
            if (payload.status === 201) {
                // dispatch(setSchoolInformation({ slug: 'school_data', data: {...payload.data.school, create_count: 1} }))
                handleGetSchoolInformation(school_data?.id)
                toast.success("School Published Successfully ")
                router.push(`/school/${schoolId}/my-school`);
              }
        })
    }

    const { handleSubmit, setFieldValue} = useFormik({
        initialValues: {
            publish_date: moment().format('YYYY-MM-DD'),
            school_id: school_data?.id || ""
        },
        onSubmit: handlePublishSchool
    })

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
                <form onSubmit={handleSubmit}>
                    <div className=" flex flex-col overflow-y-auto">
                        <div className="pi-container mx-auto">
                            <CompletionPanel percentCompleted={100} title={"3/3"}></CompletionPanel>
                            <h1 className="py-4 text-xl font-bold text-gray-800 mb-6 md:p-0">
                                Preview of Your School’s Profile
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
                          <SchoolInformation schoolData={school_data}/>
                        </div>
                    </div>
                    <BottomBar
                        onBack={() => router.push(`/school/${schoolId}/academic-info`)}
                        onSaveForLater={() => null}
                        isBackDisabled={false}
                        isSubmitting={isPublishingSchool}
                    />
                </form>
            </div>
        </>
    )
}
