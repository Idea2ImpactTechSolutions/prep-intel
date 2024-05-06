"use client";
import PageTitleContainer from "@/components/page-title";
import { useGetSchoolProfileQuery } from "@/redux/services/school/managerApi";
import moment from "moment";
import { useParams } from "next/navigation";
import SchoolInformation from "@/components/school-information";
import LoadingSpinner from "@/components/loading-spinner";

export default function SchoolPage() {
  const pageParams = useParams();
  const schoolId = pageParams?.id;
  const { data: response, isLoading } = useGetSchoolProfileQuery(schoolId);
  const school_data = response?.data;

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <div>
        <div className="flex flex-col overflow-y-auto">
          <PageTitleContainer
            title={
              <>
                {school_data?.name}
                {school_data?.found_date && (
                  <div className="flex flex-col text-xs font-normal">
                    <span className="capitalize">{school_data?.tagline}</span>
                    <span className="italic">
                      Founded {moment(school_data?.found_date).format("YYYY")}
                    </span>
                  </div>
                )}
              </>
            }
            titleClass="text-sm"
          />
          <div className="border-t"> </div>

          <div className="pi-container pi-container">
            <SchoolInformation schoolData={school_data} />
          </div>
        </div>
      </div>
    </>
  );
}
