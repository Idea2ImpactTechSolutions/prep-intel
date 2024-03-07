"use client"
import React, { useEffect, useState } from 'react'
import Sidebar from '../_components/side-bar'
import { useLazyGetSchoolProfileQuery } from '@/redux/services/school/managerApi'
import { useSession } from 'next-auth/react'
import { useAppDispatch, useAppSelector } from '@/redux/store'
import { setSchoolInformation } from '@/redux/features/school/managerSlice'
import EmptyStateContainer from '@/components/empty-state'
import { usePathname, useRouter } from 'next/navigation'
import { LucideLoader2 } from 'lucide-react'
import LoadingSpinner from './shared/loading-spinner'
import { Dictionary } from '@/types/dictionary'

export default function RootLayout({ children }: { children: React.ReactNode }) {
    const [showSidebar, setShowSidebar] = useState<boolean>(true)
    const [isProfileCompleted, setIsProfileCompleted] = useState<boolean>(false)
    const [getSchoolProfile, { isLoading, isSuccess }] = useLazyGetSchoolProfileQuery()
    const { manager: { school_information: { school_data } } }: Dictionary = useAppSelector((state) => state.manager)

    const { data: userData }: any = useSession()
    const router = useRouter()
    const location = usePathname()
    const dispatch = useAppDispatch()

    const handleGetSchoolInformation = async (schoolId) => {
        getSchoolProfile(schoolId)
            .unwrap()
            .then((payload) => {
                const { data } = payload
                dispatch(setSchoolInformation({ slug: 'school_data', data: {...data[0]?.school, create_count: 0} }))
                !data[0]?.school?.publish_date ? setIsProfileCompleted(false) : setIsProfileCompleted(true)
            })
    }

    useEffect(() => {
        if (userData) {
            const { user } = userData
            handleGetSchoolInformation(user.schoolID)
        }
    }, [])
    // console.log(school_data?.create_count)
    return (
        <main className="overflow-y-hidden font-sans">
            <section className="">
                <Sidebar
                    showSidebar={showSidebar}
                    setShowSidebar={setShowSidebar}
                />
                <section>
                    {
                        isLoading ? 
                            <LoadingSpinner/>
                            : isProfileCompleted ? children :
                                (location === "/school/school-profile" || location === "/school/claim" || location === "/school/set-password" || (location ===
                                "/school/my-school" && school_data?.create_count === 2) ||
                                location === "/school/academic-info"
                                ) ?
                                    children
                                    :
                                    <EmptyStateContainer
                                        show={true}
                                        pageTitle="Complete Profile Setup"
                                        title="Welcome to the Dashboard Tab!"
                                        content="Welcome to the Dashboard panel! This space is dedicated to helping you manage user permissions, oversee recruiter activities, and fine-tune platform settings tailored for your institution. Before diving into these functionalities, ensure your school's profile is set up. A complete profile strengthens your institution's presence on the platform and empowers you to make informed administrative decisions."
                                        onClick={() => router.push('/school/school-profile')}
                                    />
                    }
                    {/* {children} */}
                </section>
            </section>
        </main>
    )
}
