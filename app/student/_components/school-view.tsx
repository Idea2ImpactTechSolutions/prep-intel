"use client";
import { PageHeader, PageContent } from "@/components/common-page";
import { useGetSchoolProfileQuery } from "@/redux/services/school/managerApi";
import SchoolInformation from "@/components/school-information";
import LoadingSpinner from "@/components/loading-spinner";
import { GoChevronRight } from "react-icons/go";
import Link from "next/link";

interface PageProps {
  schoolId: string;
  headerTitle:string;
}

export default function SchoolView({schoolId, headerTitle}:PageProps) {
  const {data: {data: schoolData} = {}, isLoading } = useGetSchoolProfileQuery(schoolId);

  return (
    <>
        <PageHeader
            className="bg-white"
            title={
              <div className="flex items-center gap-2">
                <Link className="underline" href="?">{headerTitle}</Link> <GoChevronRight className="mt-1" />
                {schoolData?.name}
              </div>
            } />
        <div className="bg-gray-100 h-[90vh]">
        <PageContent>
          {
            isLoading ? <LoadingSpinner className="!h-[40rem]" /> : (
              <SchoolInformation schoolData={schoolData} />
            )
          }
        </PageContent>
        </div>
    </>
  );
}
