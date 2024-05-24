"use client"
import { PageHeader, PageContent } from "@/components/common-page";
import CreatePersonnel from "./_components/create-personnel"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { cn } from "@/lib/utils"
import { LucideChevronLeft } from "lucide-react"
import LoadingSpinner from "@/components/loading-spinner"
import { useLazyGetPersonnelQuery } from "@/redux/services/school/managerApi"
import {TitlebarButton } from "@/components/ui/titlebar-button"
import InviteLink from "components/ui/invite-link";
import DataTable from "components/ui/data-table";

type CURRENT_TAB_TYPES = 'VIEW_ADMIN' | 'CREATE_RECRUITER' | 'CREATE_ADMIN';

const PERSONNEL_COLUMNS = [
  {
    title: "First Name",
    field: "first_name"
  },
  {
    title: "Last Name",
    field: "last_name"
  },
  {
    title: "Email Address",
    field: "email"
  },
  {
    title: "Role",
    field: "role"
  },
  {
    title: "Status",
    field: "is_active"
  },
];

export default function AdminPage() {
    const [isFetchedProfile, setIsFetchedProfile] = useState<boolean>(false)
    const [currentView, setCurrentView] = useState<CURRENT_TAB_TYPES>("VIEW_ADMIN")
    const [personnel, setPersonnel] = useState<any[]>([]);
    const [getPersonnel, { isLoading, isFetching }] = useLazyGetPersonnelQuery()
    const pageParams = useParams();
    const schoolId = pageParams?.id as string;
    const [claimUrl, setClaimUrl] = useState("")

    const loadPersonnel = () => {
        getPersonnel({school_id: schoolId })
            .unwrap()
            .then((payload) => {
                setIsFetchedProfile(true)
                setPersonnel(payload?.data)
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
      <>
      <PageHeader
                title={
                    <>
                        {currentView === "VIEW_ADMIN" && 'Admin'}
                        {(currentView === "CREATE_RECRUITER" || currentView === "CREATE_ADMIN") && (
                            <div className="flex items-center cursor-pointer"
                                onClick={() => setCurrentView('VIEW_ADMIN')}
                            > <LucideChevronLeft width={20} height={20}/> <span> Admin </span> </div>
                        )}
                    </>
                }>
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
        </PageHeader>
        <PageContent>
            <div className={cn(
                currentView === "VIEW_ADMIN" ? "block" : 'hidden'
            )}>
                <InviteLink claimUrl={claimUrl} className="mb-4" />

                <DataTable title="Personnel"
                    columns={PERSONNEL_COLUMNS}
                    data={personnel}
                    isLoading={isLoading || isFetching} />
            </div>
            <section className={cn(
                "hidden",
                (currentView === "CREATE_RECRUITER" || currentView === "CREATE_ADMIN") && "block"
            )}>

                    <h2 className="font-bold md:text-lg text-sm mb-2">{currentView === "CREATE_RECRUITER"  ? "Create Recruiter" : "Create Admin"}</h2>
                    {(currentView === 'CREATE_RECRUITER' || currentView === 'CREATE_ADMIN') &&
                    <CreatePersonnel
                        role={(currentView === "CREATE_ADMIN") ? "admin" : "recruiter"}
                        schoolId={schoolId}
                        onCancel={()=> setCurrentView("VIEW_ADMIN")}
                        onSuccess={(claimUrl) => { setCurrentView("VIEW_ADMIN"); setClaimUrl(claimUrl); loadPersonnel() }}
                    />}
            </section>
      </PageContent>
      </>
    )
}
