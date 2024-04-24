"use client"
import PageTitleContainer from "@/components/page-title"
import CreatePersonnel from "./_components/create-personnel"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { cn } from "@/lib/utils"
import { LucideChevronLeft } from "lucide-react"
import LoadingSpinner from "../../_components/loading-spinner"
import { useLazyGetPersonnelQuery } from "@/redux/services/school/managerApi"
import {TitlebarButton } from "@/components/ui/titlebar-button"
import InviteLink from "components/ui/invite-link";

type CURRENT_TAB_TYPES = 'VIEW_ADMIN' | 'CREATE_RECRUITER' | 'CREATE_ADMIN';

export default function AdminPage() {
    const [isFetchedProfile, setIsFetchedProfile] = useState<boolean>(false)
    const [currentView, setCurrentView] = useState<CURRENT_TAB_TYPES>("VIEW_ADMIN")
    const [admin, setAdmin] = useState<any[]>([]);
    const [getPersonnel, { isLoading, isFetching }] = useLazyGetPersonnelQuery()
    const pageParams = useParams();
    const schoolId = pageParams?.id as string;
    const [claimUrl, setClaimUrl] = useState("")

    const loadPersonnel = () => {
        getPersonnel({school_id: schoolId })
            .unwrap()
            .then((payload) => {
                setIsFetchedProfile(true)
                setAdmin(payload?.data)
            })
    }

    useEffect(() => {
        if (schoolId && !isFetchedProfile) {
            loadPersonnel()
        }
    }, [])

    if (isLoading || isFetching) {
        return <LoadingSpinner />
    }

    return (
        <section>
            <>
                <div className="border-b">
                    <PageTitleContainer
                        title={
                            <>
                                {currentView === "VIEW_ADMIN" && 'Admin'}
                                {(currentView === "CREATE_RECRUITER" || currentView === "CREATE_ADMIN") && (
                                    <div className="flex items-center cursor-pointer"
                                        onClick={() => setCurrentView('VIEW_ADMIN')}
                                    > <LucideChevronLeft width={20} height={20}/> <span> Admin </span> </div>
                                )}
                            </>
                        }
                        rightContent={
                            <div className={cn(
                                (currentView === "CREATE_RECRUITER" ||
                                 currentView === "CREATE_ADMIN")
                                && 'hidden'
                            )}>
                            <TitlebarButton
                                title="Create Admin"
                                onClick={() => setCurrentView("CREATE_ADMIN")} />

                            <TitlebarButton
                                title="Create Recruiter"
                                onClick={() => setCurrentView("CREATE_RECRUITER")} />
                            </div>
                        }
                    />
                </div>
                <div className={cn(
                    "p-4",
                    "pi-container",
                    currentView === "VIEW_ADMIN" ? "block" : 'hidden'
                )}>
                    <InviteLink claimUrl={claimUrl} />
                    <table className="table-auto simple">
                        <thead>
                            <tr>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Email Address</th>
                                <th>Role</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                admin.map((user, index) => (
                                    <tr key={index}>
                                        <td>{user['first_name']}</td>
                                        <td>{user['last_name']}</td>
                                        <td>{user['email']}</td>
                                        <td>{user['role']}</td>
                                        <td>{user['is_active']}</td>
                                    </tr>))
                            }
                        </tbody>
                    </table>
                </div>
                <section className={cn(
                    "hidden",
                    (currentView === "CREATE_RECRUITER" || currentView === "CREATE_ADMIN") && "block"
                )}>
                    <section className="pi-container">
                        <h2 className="font-bold md:text-lg text-sm mb-2">{currentView === "CREATE_RECRUITER"  ? "Create Recruiter" : "Create Admin"}</h2>
                        {(currentView === 'CREATE_RECRUITER' || currentView === 'CREATE_ADMIN') &&
                        <CreatePersonnel
                            role={(currentView === "CREATE_ADMIN") ? "admin" : "recruiter"}
                            schoolId={schoolId}
                            onCancel={()=> setCurrentView("VIEW_ADMIN")}
                            onSuccess={(claimUrl) => { setCurrentView("VIEW_ADMIN"); setClaimUrl(claimUrl); loadPersonnel() }}
                        />}
                    </section>
                </section>
            </>
        </section>
    )
}
