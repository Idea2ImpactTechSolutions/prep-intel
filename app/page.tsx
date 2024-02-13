"use client"

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";

const links = `/manager/profile/academic-info
/manager/profile/dashboard
/manager/profile/recruits
/manager/profile/school-profile
/manager/profile/school-welcome
/manager/profile/welcome
/recruiter/connections
/recruiter/dashboard
/recruiter/profile/personal-info
/recruiter/profile/setup
/recruiter/profile/territory
/recruiter/profile/welcome
/recruiter/student-profile
/student/explore`.split('\n').map(p => p.trim())

export default function Home() {
  const router = useRouter()

  return (
    <main className='flex min-h-screen flex-col items-center justify-between p-24 font-sans'>
      <Image
        src="/images/logo/logo.png"
        width={100}
        height={100}
        alt="logo"
      />
      <h1 className="font-bold text-2xl text-center">Welcome to Prep Intel</h1>
      <h1 className="text-xl font-bold mt-8">Pages</h1>
      <ul>
          {
              links.map( url => (
              <li className="m-2"><Link
                  href={url}
                  className={`pb-1 ml-14 text-sm transition-all hover:border-b-[4px] hover:border-b-primary md:ml-12 md:text-[1rem] `}
              >{url}</Link></li>
              ))
          }
      </ul>
            
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
