"use client";
import React from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  // Placeholder
  let isSubmitting = false;

  return (
  <div className="flex flex-col items-center justify-center rows border-2 border-gray-150 p-14 mt-40 self-center rounded-md w-[600px] h-[400px] center">
    <h1 className="text-2xl font-bold mb-8">Hello Recruiter</h1>

      <div>
        You have been invited to join College Prep U as a registered
        recruiter. Follow the link to set up your account.
      </div>

      <button
        type="submit"
        className="flex items-center bg-primary hover:bg-primary-500 text-white font-bold py-3 mt-5 px-4 rounded mr-1 mt-14"
        disabled={isSubmitting}
        onClick={() => router.push("/recruiter/profile/setup")}
        >
          <div className="leading-none inline-block -mt-1">Create My Profile</div>
      </button>

    </div>
  );
}