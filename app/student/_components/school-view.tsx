"use client";
import PageTitleContainer from "@/components/page-title";
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
      <div>
        <div className="flex flex-col overflow-y-auto">
          <PageTitleContainer
            title={
              <div className="flex items-center gap-4">
                <Link href="#" className="underline" onClick={() => { goBack(); return false;}}>Explore Schools</Link> <GoChevronRight className="mt-1" />
                {school_data?.name}
              </div>
            }
            titleClass="text-sm"
          />
          <div className="pi-container pi-container">
            <SchoolInformation schoolData={school_data} />
          </div>
        </div>
      </div>
  );
}
