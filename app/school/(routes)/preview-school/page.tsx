"use client"
import { CompletionPanel } from "@/components/completion-panel";
import PageTitleContainer from "@/components/page-title";
import { Button } from "@/components/ui/button";
import { setSchoolInformation } from "@/redux/features/school/managerSlice";
import { useLazyGetSchoolProfileQuery, usePublishSchoolProfileMutation } from "@/redux/services/school/managerApi";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { Dictionary } from "@/types/dictionary";
import moment from 'moment';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import SchoolInformation from "../../_components/school-information";
import BottomBar from "../shared/bottom-bar";
import LoadingSpinner from "../shared/loading-spinner";
import { useFormik } from "formik";
import { toast } from "sonner";

export default function SchoolPreview() {
    const [isFetchedProfile, setIsFetechProfile] = useState<boolean>(false)
    const [getSchoolProfile, {isLoading: isLoadingGetProfile, isFetching: isFetchingSchoolProfile, isSuccess:isSuccessGetProfile}] = useLazyGetSchoolProfileQuery()
    const { manager: { school_information: { school_data } } }: Dictionary = useAppSelector((state) => state.manager)

    const router = useRouter()

    const { data: userData }: any = useSession()
    const dispatch = useAppDispatch()
    const [publishSchoolProfileMutation, {isLoading: isPublishingSchool, isSuccess: isSuccessSchoolPublished}] = usePublishSchoolProfileMutation()

    const handleGetSchoolInformation = async (schoolId) => {
        getSchoolProfile(schoolId)
            .unwrap()
            .then((payload) => {
                const { data } = payload
                setIsFetechProfile(true)
                setFieldValue('school_id', data.id)
                dispatch(setSchoolInformation({ slug: 'school_data', data: data }))
            })
      }

    const handlePublishSchool = async (values: Dictionary) => {
        publishSchoolProfileMutation(values)
        .unwrap()
        .then((payload) => {
            console.log(payload)
            if (payload.status === 201) {
                // dispatch(setSchoolInformation({ slug: 'school_data', data: {...payload.data.school, create_count: 1} }))
                handleGetSchoolInformation(school_data?.id)
                toast.success("School Published Successfully ")
                router.push("/school/my-school");
              }
        })
        
    }

    const {values, errors, handleSubmit, setFieldValue} = useFormik({
        initialValues: {
            publish_date: moment().format('YYYY-MM-DD'),
            school_id: school_data?.id || ""
        },
        onSubmit: handlePublishSchool
    })

    

      useEffect(() => {
        if(userData && userData?.user){
          !isFetchedProfile && handleGetSchoolInformation(userData?.user?.schoolID)
        }
        
    }, [userData])

    if (isLoadingGetProfile || isFetchingSchoolProfile) {
        return <LoadingSpinner />;
      }

    return (
        <>
            <div className="">
                <form onSubmit={handleSubmit}>
                    <div className=" flex flex-col overflow-y-auto">
                        <div className="container mx-auto p-4 pt-6 px-0 md:px-11 ">
                            <CompletionPanel percentCompleted={100} title={"3/3"}></CompletionPanel>
                            <h1 className="p-4 text-xl font-bold text-gray-800 mb-6 md:p-0">
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
                    <BottomBar
                        onBack={() => router.push("/school/academic-info")}
                        onSaveForLater={() => null}
                        isBackDisabled={false}
                        isSubmitting={isPublishingSchool}
                    />
                </form>
            </div>
        </>
    )
}
