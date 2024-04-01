"use client";
import { useState, useEffect } from "react";
import { IoMdEye } from "react-icons/io";
import { FaEdit } from "react-icons/fa";
import PageTitleContainer from "@/components/page-title";
import { useParams } from "next/navigation";
import { useLazyGetRecruitsQuery } from "@/redux/services/school/managerApi";

export default function Page() {
  const [recruits, setRecruits] = useState<any[]>([]);
  const [getRecruits, { isLoading }] = useLazyGetRecruitsQuery();
  const pageParams = useParams();
  const schoolId = pageParams?.id;

  async function handleGetRecruits() {
    const recruits = await getRecruits({ school_id: schoolId });

    // TODO: Fix the endpoint to eliminate excess path steps
    setRecruits(recruits?.data.data);
  }

  useEffect(() => {
    if (schoolId) {
      handleGetRecruits();
    }
  }, []);

  return (
    <section>
      <PageTitleContainer title="Recruits" />
      <hr className="border-t border-gray-300 my-4" />

      <section className="p-4 items-center justify-between md:px-16 md:mt-4">
        <table className="table-auto">
          <thead>
            <tr>
              <th>Full Name</th>
              <th>Application Status</th>
              <th>Recruitment Source</th>
              <th>Application Date</th>
              <th>Recruiter Name</th>
              <th>Program of Interest</th>
              <th>Email Address</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && <div>Loading...</div>}

            {!isLoading && recruits?.length > 0 && recruits.map((user, index) => (
              <tr key={index}>
                <td>Full Name</td>
                <td>Application Status</td>
                <td>Recruitment Source</td>
                <td>Application Date</td>
                <td>{user.recruiter_id}</td>
                <td>{user.student.high_school}</td>
                <td>Email Address</td>
                <td>
                  <div className="flex ">
                    <IoMdEye className="mr-4" /> <FaEdit />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </section>
  );
}
