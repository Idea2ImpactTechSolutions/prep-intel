"use client";
import { useSession } from "next-auth/react";
import SharedComponent from "../_components/ShareComponent";
import LoadingSpinner from "@/components/loading-spinner";

export default function Page() {
  const session = useSession();
  const recruiterId = session?.data?.user?.roleId;
  const schoolId = session?.data?.user?.schoolID;

  if (!recruiterId || !schoolId) {
    return <LoadingSpinner />
  }

  return (
    <SharedComponent headerTitle={"Recruiter"} schoolId={schoolId} recruiterId={recruiterId} />
  );
}