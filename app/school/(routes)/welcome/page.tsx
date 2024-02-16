"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Input } from "@/components/ui/input";

export default function Page() {
  const router = useRouter();
  let isSubmitting = false;
  return (
    <div className="flex flex-col items-center mx-auto justify-center rows bg-gray-100 p-6 mt-40 self-center rounded-md w-[500px] center">
        <Image
            src="/images/logo/text-logo.png"
            className="mb-4 mt-1"
            width={260}
            height={0}
            alt="logo"
        />
        <h1 className="text-3xl font-bold">Welcome to Prep Intel!</h1>

        <h2 className="text-xl font-bold mt-4">By joining Prep Intel, you will gain access to:</h2>

        <ul className="w-full items-center mt-2">
            <li className="rounded-full text-center bg-gray-200 p-2 pr-4 pl-4 mb-1">Greater Transparency into Your Student Funnel</li>
            <li className="rounded-full text-center bg-gray-200 p-2 pr-4 pl-4 mb-1">Reports and Trends with Your School</li>
            <li className="rounded-full text-center bg-gray-200 p-2 pr-4 pl-4 mb-1">Increase Your Outreach to Prospects</li>
        </ul>

        <div className="w-full mt-5">
            <Input
                label="School Email Address"
                placeholder="Enter email address"
                className="w-full placeholder:text-gray-300 placeholder:font-light"
            />
        </div>

        <button
          type="submit"
          className="flex items-center bg-primary hover:bg-primary-500 text-white font-bold py-3 mt-5 px-4 rounded mr-1"
          disabled={isSubmitting}
          onClick={() => router.push("/school/school-welcome")}
          >
            <div className="leading-none inline-block -mt-1">Claim My Account</div>
        </button>
    </div>
  );
}
