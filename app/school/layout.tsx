"use client"
import React, { useEffect, useState } from 'react'
import { Navbar, TabLink} from "components/ui/nav-bar"
import { useLazyGetSchoolProfileQuery } from '@/redux/services/school/managerApi'
import { useAppDispatch, useAppSelector } from '@/redux/store'
import { setSchoolInformation } from '@/redux/features/school/managerSlice'
import EmptyStateContainer from '@/components/empty-state'
import { usePathname, useRouter, useParams } from 'next/navigation'
import LoadingSpinner from './_components/loading-spinner'
import { Dictionary } from '@/types/dictionary'
import { GraduationCap, LayoutGrid, Lock, UserPlus } from "lucide-react"

const TABS = [
  {
      title: 'Dashboard',
      url: (schoolId) => `/school/${schoolId}/dashboard`,
      icon: <LayoutGrid className="w-4 h-4" />
  },
  {
      title: 'Recruits',
      url: (schoolId) => `/school/${schoolId}/recruits`,
      icon: <UserPlus className="w-4 h-4" />
  },
  {
      title: 'My School',
      url: (schoolId) => `/school/${schoolId}/my-school`,
      icon: <GraduationCap className="w-4 h-4" />
  },
  {
      title: 'Admin',
      url: (schoolId) => `/school/${schoolId}/admin`,
      icon: <Lock className="w-4 h-4" />
  },
] as TabLink[];

export default function RootLayout({ children }: { children: React.ReactNode }) {
    const [allowFullView, setAllowFullView] = useState(false);
    const [getSchoolProfile, { isLoading }] = useLazyGetSchoolProfileQuery()
    const { manager: { school_information: { school_data } } }: Dictionary = useAppSelector((state) => state.manager)

    const router = useRouter()
    const pageParams = useParams();
    const schoolId = pageParams?.id;
    const location = usePathname()
    const dispatch = useAppDispatch()
    const allowedPaths = ["/admin", "/my-school", "/school-profile", "/academic-info", "/preview-school", "/recruits"]

    const handleGetSchoolInformation = async (schoolId) => {
        getSchoolProfile(schoolId)
            .unwrap()
            .then((payload) => {
                const { data } = payload
                dispatch(setSchoolInformation({ slug: 'school_data', data: {...data, create_count: 0} }))
            })
    }

    useEffect(() => {
        handleGetSchoolInformation(schoolId);
    }, [schoolId])

    useEffect(() => {
        const isAllowedPath = allowedPaths.some(p => location?.endsWith(p));
        const isSchoolPublished = Boolean(school_data?.publish_date);

        setAllowFullView(isAllowedPath || isSchoolPublished);
    }, [school_data])

    return (
        <main className="-sans">
            <section className="">
                <Navbar tabs={TABS} />
                <section>
                    {
                        isLoading ?
                            <LoadingSpinner/>
                            : allowFullView ? children :
                                    <EmptyStateContainer
                                        show={true}
                                        pageTitle="Complete Profile Setup"
                                        title="Welcome to the Dashboard Tab!"
                                        content="Welcome to the Dashboard panel! This space is dedicated to helping you manage user permissions, oversee recruiter activities, and fine-tune platform settings tailored for your institution. Before diving into these functionalities, ensure your school's profile is set up. A complete profile strengthens your institution's presence on the platform and empowers you to make informed administrative decisions."
                                        onClick={() => router.push(`/school/${schoolId}/school-profile`)}
                                    />
                    }
                </section>
            </section>
        </main>
    )
}
