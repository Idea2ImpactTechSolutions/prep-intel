"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const schoolId = "b14e03a9-656a-4726-9d38-6f09c912a543";
  const isSubmitting = false;
  return (
    <div className="container p-6">
        <h1 className="text-2xl font-bold mb-4">My School</h1>
        <div className="flex w-full justify-center rows bg-gray-100 p-6 mt-2 self-center rounded-md">
            <div className="flex flex-col items-center justify-center rows bg-gray-100 p-6 mt-20 self-center w-[800px] center">
                <Image
                    src="/images/school_welcome.png"
                    className="mb-4 mt-1"
                    width={260}
                    height={0}
                    alt="logo"
                />
                <h1 className="text-2xl font-bold mt-0 m-6">Welcome to the "My School" Tab!</h1>

                <div>
                    Creating your school's profile is the key to unlocking the potential of this platform. Not only does it allow
                    eager students to discover and learn about the unique offerings of your institution, but it also empowers
                    them to gauge their chances of acceptance and visualize their academic future with you. By curating a
                    compelling and informative profile, you're taking a significant step toward broadening your reach,
                    attracting the right talent, and streamlining the admissions process.
                </div>
                <button
                    type="submit"
                    className="flex items-center bg-primary hover:bg-primary-500 text-white font-bold py-3 mt-6 px-4 rounded mr-1"
                    disabled={isSubmitting}
                    onClick={() => router.push("/manager/profile/school-profile")}
                    >
                    <div className="leading-none inline-block -mt-1">Create Your School's Profile</div>
                </button>
            </div>
        </div>
    </div>
  );
}
