"use client";
import { PageHeading, PageContent } from "@/components/common-page";
import { useGetSchoolProfileQuery } from "@/redux/services/school/managerApi";
import SchoolInformation from "@/components/school-information";
import LoadingSpinner from "@/components/loading-spinner";
import { GoChevronRight } from "react-icons/go";
import Link from "next/link";

interface PageProps {
  goBack: () => void;
  schoolId: string;
}

export default function SchoolView({goBack, schoolId}:PageProps) {
  const { data: response, isLoading } = useGetSchoolProfileQuery(schoolId);
  const school_data = response?.data;

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <>
        <PageHeading
            title={
              <div className="flex items-center gap-4">
                <Link href="#" className="underline" onClick={() => { goBack(); return false;}}>Explore Schools</Link> <GoChevronRight className="mt-1" />
                {school_data?.name}
              </div>
            } />
        <PageContent>
          <SchoolInformation schoolData={school_data} />
        </PageContent>
    </>
  );
}
