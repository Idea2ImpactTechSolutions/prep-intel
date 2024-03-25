"use client";
import { useState, useEffect } from "react";
import { SchoolRecruits }  from "@/app/ui/mock-data/Users"
import { IoMdEye } from "react-icons/io";
import { FaEdit } from "react-icons/fa";
import PageTitleContainer from "@/components/page-title";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation"

export default function Page() {
  const [filter, setFilter] = useState('');
  const [recruits, setRecruits] = useState<any[]>([]);
  const pageParams = useParams();
  const schoolId = pageParams?.id;

  const onChangeHandler = (event) => {
    setFilter(event.target.value);
  };

  useEffect(() => {
    // TODO: Use schoolId to query for data matching the given id
    const lowerFilter= filter.toLowerCase();
    setRecruits(SchoolRecruits.filter(r => r['Full Name'].toLowerCase().includes(lowerFilter)))
  }, [filter, pageParams]);

  return (
  	<section>
  	<PageTitleContainer title="Recruits" />
  	<hr className="border-t border-gray-300 my-4" />

     <section className="p-4 items-center justify-between md:px-16 md:mt-4">
        <div className="w-full mt-5 flex items-end">
          <div className="w-[40%]">
          <Input
            label="Filter"
            labelClass="text-xs font-normal text-[#61646B]"
            type="text"
            className="w-full"
            onChange={onChangeHandler}
            />
          </div>
          <div className="flex-grow"></div>

          <Button
              className="text-xs bg-primary hover:bg-primary-500 text-white font-bold"
            >Filter</Button>



        </div>

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
          {
            recruits.map((user, index) => (
              <tr key={index}>
                <td>{user['Full Name']}</td>
                <td>{user['Application Status']}</td>
                <td>{user['Recruitment Source']}</td>
                <td>{user['Application Date']}</td>
                <td>{user['Recruiter Name']}</td>
                <td>{user['Program of Interest']}</td>
                <td>{user['Email Address']}</td>
                <td ><div className="flex "><IoMdEye className="mr-4" /> <FaEdit /></div></td>
              </tr>))
          }
          </tbody>
        </table>
    </section>
    </section>
  );
}