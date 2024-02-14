"use client"

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";

// Collapse anonymous path steps
const regex = /\([^)]+\)\//g; 

const links = `/(auth)/(routes)/login
/(auth)/(routes)/register
/recruiter/connections
/recruiter/dashboard
/recruiter/profile/personal-info
/recruiter/profile/setup
/recruiter/profile/territory
/recruiter/profile/welcome
/recruiter/student-profile
/school/(routes)/academic-info
/school/(routes)/admin
/school/(routes)/claim
/school/(routes)/dashboard
/school/(routes)/my-school
/school/(routes)/recruits
/school/(routes)/school-profile
/school/(routes)/school-welcome
/school/(routes)/welcome
/school/_components/stepped-page.tsx
/student/explore
/student/explore-schools
/student/onboarding/(routes)/extracurricular
/student/onboarding/(routes)/majors
/student/onboarding/(routes)/schools
/student/onboarding/(routes)/transcripts
/student/onboarding/(routes)/vitals`.split('\n').map(p => p.trim().replace(regex, ""))

export default function Home() {
  const router = useRouter()

  return (
    <main className='flex min-h-screen flex-col items-center justify-between p-24 font-sans'>
      <ul className="absolute right-10 top-10">
          {
              links.map( url => (
              <li className="m-2"><Link
                  href={url}
                  className={`pb-1 ml-14 text-sm transition-all hover:border-b-[4px] hover:border-b-primary md:ml-12 md:text-[1rem] `}
              >{url}</Link></li>
              ))
          }
      </ul>

      <Image
        src="/images/logo/logo.png"
        width={100}
        height={100}
        alt="logo"
      />

      <h1 className="font-bold text-2xl text-center">Welcome to Prep Intel</h1>

      <div className="flex flex-wrap gap-4 justify-center">
        <Button
          onClick={() => router.push('/login')}
          type="button"
          variant="outline"
        >Student Portal</Button>
        <Button
          onClick={() => {
            new Promise((resolve) => {
              setTimeout(() => {
                toast.info("Coming soon!");
              },100)
            })
          }}
          type="button"
          variant="outline"
        >Recruiter Portal</Button>
        <Button
          onClick={() => router.push('/school/claim')}
          type="button"
          variant="outline"
        >Manager Portal</Button>
      </div>
    </main>
  );
}
