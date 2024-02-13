"use client"
import EmptyStateContainer from "@/components/empty-state"
import PageTitleContainer from "@/components/page-title"
import CreateRecruiter from "./_components/create-recruiter"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function page() {
    const [currentProgress, setCurrentProgress] = useState("")
    const router = useRouter()
    return (
        <section>
            <>
                <EmptyStateContainer
                    show={!currentProgress}
                    pageTitle="Admin"
                    title="Welcome to the “Admin” Tab!"
                    content="Welcome to the Admin panel! This space is dedicated to helping you manage user permissions, oversee recruiter activities, and fine-tune platform settings tailored for your institution. Before diving into these functionalities, ensure your school's profile is set up. A complete profile strengthens your institution's presence on the platform and empowers you to make informed administrative decisions."
                    onClick={() => router.push('/school/my-school')}
                />
                <section className="hidden">
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
