"use client";
import React, { useState } from "react";
import BottomBar from "../shared/bottom-bar";
import { useRouter } from "next/navigation";
import UsMap from "@/components/UsMap"

export default function Page() {
  const router = useRouter();
  const [activeStates, setActiveStates] = useState<string[]>([]);

  return (
    <div className="pi-container">
        <h1 className="text-2xl font-bold mb-4">Where Do You Recruit?</h1>
        <div className="ml-20 mb-20">
          <UsMap activeStates={activeStates} setActiveStates={setActiveStates} ></UsMap>
        </div>
        <BottomBar
            isBackDisabled={true}
            isSubmitting={() => {}}
            onBack={() => {}}
            onNext={() => router.push("/recruiter/dashboard")}
          />
    </div>
  );
}