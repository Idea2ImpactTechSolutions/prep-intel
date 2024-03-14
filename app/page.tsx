"use client"

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import PageList  from "@/components/page-list"
export default function Home() {
  const router = useRouter();

  return (
    <main className='flex min-h-screen flex-col items-center justify-between p-24 font-sans'>
      <PageList />

      <Image
        src="/images/logo/logo.png"
        width={100}
        height={100}
        alt="logo"
      />

      <h1 className="font-bold text-2xl text-center">Welcome to Prep Intel</h1>

      <div className="flex flex-wrap gap-4 justify-center">
        <Button
          onClick={() => router.push('/student/onboarding/vitals')}
          type="button"
          variant="outline"
        >Student Portal</Button>
        <Button
          onClick={() => router.push('/recruiter/profile/welcome')}
          type="button"
          variant="outline"
        >Recruiter Portal</Button>
        <Button
          onClick={() => router.push('/school/dashboard')}
          type="button"
          variant="outline"
        >Manager Portal</Button>
      </div>
    </main>
  );
}
