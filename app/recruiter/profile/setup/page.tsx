"use client";
import React from "react";
import BottomBar from "../shared/bottom-bar";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";

export default function Page() {
  const router = useRouter();
  // Placeholder
  let isSubmitting = false;
    return (
    <div className="container p-0 pt-6">
        <h1 className="text-2xl font-bold mb-4">Recruiter</h1>
        <div className="flex w-full justify-center rows bg-gray-100 p-6 mt-2 self-center rounded-tl-md rounded-tr-md pb-20">
            <div className="flex flex-col items-center justify-center rows bg-gray-150 p-6 mt-20 self-center w-[800px] center">

                <div className="border-solid border-red-100">
                  <h1 className="text-2xl font-bold mb-8">You're Logging In from a Link.</h1>

                  <div>
                    Lets set up a password so your progress is saved to your account!
                  </div>

                    <div className="w-full mt-5">
                      <Input type='' id='email' label='Email Address' className='mb-4' />
                    </div>

                    <div className="w-full mt-5">
                      <Input type='' id='password' label='Email Address' className='mb-4' />
                    </div>
              </div>
            </div>
        </div>
        <BottomBar
            isBackDisabled={true}
            isSubmitting={isSubmitting}
            nextTitle="Claim My Account"
            onBack={() => console.log('Back Clicked')}
            onNext={() => router.push("/recruiter/profile/personal-info")}
          />
    </div>
  );
}