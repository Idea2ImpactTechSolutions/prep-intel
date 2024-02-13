"use client"
import EmptyStateContainer from '@/components/empty-state'
import { useRouter } from 'next/navigation'

export default function page() {
    const router = useRouter()
    return (
        <section>
            <>
                <EmptyStateContainer    
                    show
                    pageTitle='Recruits'
                    title="Welcome to the “Recruits” Tab!"
                    content="Welcome to the Recruits tab! This is your go-to place for tracking, managing, and communicating with prospective students who express interest in your institution. A well-constructed school profile not only enriches their understanding of your college or university but also enhances your recruiting efficiency. Set up your school's profile now and make the most out of this recruits system."
                    onClick={() => router.push('/school/my-school')}
                />
            </>
        </section>
    )
}
