"use client";

import DataTable from "components/ui/data-table";
import { useLazyExploreRecruitsQuery } from "@/redux/services/recruiter/recruiterApi";
import { useEffect, useState } from "react";
import LoadingSpinner from "@/components/loading-spinner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useFormik } from "formik";
import * as yup from "yup";


interface PageProps {
  recruiterId: string;
  className: string;
  onStudentSelected?: (id: string) => void;
}

export default function DiscoverPanel({ recruiterId, className, onStudentSelected }: PageProps) {
  const [getRecruits, { isLoading, isFetching, isSuccess }] = useLazyExploreRecruitsQuery();
  const [candidates, setCandidates] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(13);

  const handleStudentSelected = (row) => {
    if (onStudentSelected) {
      onStudentSelected(row.studentId);
    }
  }

  const COLUMNS = [
    {
      title: "ACT",
      field: "studentActScore",
    },
    {
      title: "SAT",
      field: "studentSatScore",
    },
    {
      title: "GPA",
      field: "studentGpa",
    },
    {
      title: "Graduation Year",
      field: "studentGradYear",
    },
    {
      title: "High School",
      field: "studentHighSchool",
    },
    {
      title: "Action",
      render: (row) => (
        <span
          className="border border-primary p-1.5 px-4 rounded-sm text-primary cursor-pointer text-sm hover:bg-primary hover:text-white"
          onClick={() => handleStudentSelected(row)}>
          View
        </span>
      ),
    },
  ];

  async function refreshCandidates(value) {
    const response: any = await getRecruits({
      ...values,
      schoolId: 112075,
      page: currentPage,
    }).unwrap();

    if (response.status !== 200) {
      // TODO: How do we imagine handling this case?
      setTotalPages(0);
      setCandidates([]);
      return;
    }

    setTotalPages(response.data.totalPages);
    setCandidates(response.data.students);
  }

  // handle input change
  const { values, errors, handleSubmit, handleChange, touched } = useFormik({
    initialValues: {
      minAct: "30",
      minSat: "1500",
      minGpa: "3.7",
      states: "CA,NV",
    },
    validationSchema: yup.object().shape({
      states: yup.string().required("states field is required"),
    }),
    onSubmit: refreshCandidates,
  });

  // Onload
  useEffect(() => {
    if (isSuccess) {
      refreshCandidates(values);
    }
  }, [currentPage]);

  return (
    <div className={className}>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-5 w-full max-w-lg items-center gap-4">
          <Input
            id="minAct"
            name="minAct"
            value={values.minAct}
            onChange={handleChange}
            touched={touched.minAct}
            error={errors.minAct}
            label="ACT"
          />

          <Input
            id="minSat"
            name="minSat"
            value={values.minSat}
            onChange={handleChange}
            touched={touched.minSat}
            error={errors.minSat}
            label="SAT"
          />

          <Input
            id="minGpa"
            name="minGpa"
            value={values.minGpa}
            onChange={handleChange}
            touched={touched.minGpa}
            error={errors.minGpa}
            label="GPA"
          />

          <Input
            type="states"
            id="states"
            name="states"
            value={values.states}
            onChange={handleChange}
            touched={touched.states}
            error={errors.states}
            label="States"
          />

          <Button
            className="bloc mt-3 px-16"
            disabled={isLoading || isFetching}
            loadingText="Discover"
            type="submit"
          >
            Discover
          </Button>
        </div>
      </form>

      <div className="mt-5">
        {isLoading || isFetching ? (
          <LoadingSpinner className="my-40 h-full" />
        ) : (
          <DataTable
            title="Discover Candidates"
            columns={COLUMNS}
            data={candidates}
            page={currentPage}
            totalPages={totalPages}
            nextPage={() => setCurrentPage(currentPage + 1)}
            prevPage={() => setCurrentPage(currentPage - 1)}
            isLoading={false}
          />
        )}
      </div>
    </div>
  )
}