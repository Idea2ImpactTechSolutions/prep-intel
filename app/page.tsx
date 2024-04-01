"use client"

import Image from "next/image";
export default function Home() {

  return (
    <main className='flex min-h-screen flex-col items-center justify-between p-24 font-sans'>

      <Image
        src="/images/logo/logo.png"
        width={100}
        height={100}
        alt="logo"
      />

      <h1 className="font-bold text-2xl text-center">Welcome to Prep Intel</h1>

      <div className="flex flex-wrap gap-4 justify-center">

      </div>
    </main>
  );
}
