"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";


//const links = `.replace(regex, ""))

export default function Home() {
  const router = useRouter();
  const [links, setLinks] = useState([]);

  useEffect(() => {
    //call api
    fetch('/api/pagelist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((r) => {
        return r.json();
      })
      .then(data => {
        setLinks(data);
      });
  }, []);

  return (
    <main className='flex min-h-screen flex-col items-center justify-between p-24 font-sans'>
      <ul className="absolute right-10 top-10">
          {
              links.map((url, index) => (
              <li key={index} className="m-2"><Link
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
