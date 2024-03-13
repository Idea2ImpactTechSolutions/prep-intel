"use client"
import EmptyStateContainer from "@/components/empty-state"
import PageTitleContainer from "@/components/page-title"
import CreateRecruiter from "./_components/create-recruiter"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Link, UserPlus } from "lucide-react"
import { SchoolRecruits }  from "@/app/ui/mock-data/Users"
import LoadingSpinner from "../shared/loading-spinner"
import { useSession } from "next-auth/react"
import { useLazyGetAllAdminQuery } from "@/redux/services/school/managerApi"

type CURRENT_TAB_TYPES = 'VIEW_ADMIN' | 'CREATE_RECRUITER'

export default function AdminPage() {
    const [filter, setFilter] = useState('');
    const [isFetchedProfile, setIsFetechProfile] = useState<boolean>(false)
    const [currentProgress, setCurrentProgress] = useState<CURRENT_TAB_TYPES>("VIEW_ADMIN")
    const [admin, setAdmin] = useState<any[]>([]);

    const { data: userData }: any = useSession()

    const [getAllAdmin, {isLoading, isFetching, isSuccess}] = useLazyGetAllAdminQuery()

    const router = useRouter()

    const handleGetAllAdmin = async (payload) => {
        getAllAdmin(payload)
        .unwrap()
        .then((payload) => {
            setIsFetechProfile(true)
            setAdmin(payload?.data?.[0]?.data)
        })
    }

    const onChangeHandler = (event) => {
        setFilter(event.target.value);
      };

      useEffect(() => {
        if(userData && userData?.user){
          !isFetchedProfile && handleGetAllAdmin({school_id: userData?.user?.schoolID})
        }
        
    }, [userData])

      if (isLoading || isFetching) {
        return <LoadingSpinner/>
      }

    return (
        <section>
            <>
                <div className="border-b">
                    <PageTitleContainer
                        title="Admin"
                        rightContent={
                            <div>
                                <span
                                    onClick={() => setCurrentProgress("CREATE_RECRUITER")}
                                    className="flex border border-primary text-primary text-xs p-2 px-4 rounded-md cursor-pointer"
                                ><UserPlus width={14} height={14} className="mr-1" /> <span className="font-bold">Create New User</span> </span>
                            </div>
                        }
                    />
                </div>
                <div className={cn(
                    "p-4 md:px-16",
                    currentProgress === "VIEW_ADMIN" ? "block" : 'hidden'
                )}>
                    <table className="table-auto">
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
                    currentProgress === "CREATE_RECRUITER" && "block"
                )}>
                    <PageTitleContainer
                        title="Create a New User"
                        titleClass="text-sm"
                        rightContent=""
                    />
                    <section className="">

                        {currentProgress === 'CREATE_RECRUITER' && <CreateRecruiter />}

                    </section>
                </section>
            </>
        </section>
    )
}
