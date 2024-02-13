"use client"
import EmptyStateContainer from "@/components/empty-state";
import { useRouter } from "next/navigation";


export default function page() {
    const router = useRouter();
    return (
        <section>
            <>
                <EmptyStateContainer
                    show={true}
                    pageTitle="My Dashboard"
                    title="Welcome to the “Dashboard” Tab!"
                    content="Welcome to your Dashboard! This is where you'll get a comprehensive, real-time overview of your school's recruitment activities, from application trends to enrollment metrics. To unlock the full potential of this dashboard and ensure prospective students get a holistic view of your institution, it's essential to create your school's profile. Begin crafting your school's story today and tap into a wealth of insights that this dashboard has to offer."
                    onClick={() => router.push('/school/my-school')}
                />
            </>
        </section>
    )
}
