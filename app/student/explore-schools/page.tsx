"use client";
import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from 'next/navigation'

export default function Page() {
  const [schools, setSchools] = useState<any[]>([]);
  const searchParams = useSearchParams()

  const fetchSchoolData = async (states: String) => {
    //setIsLoading(true);
    try {
      const response = await fetch(
        `/api/manager/profile/ic-directory?states=${states}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setSchools(data);
      //setIsLoading(false);
    } catch (error) {
      console.error("There was a problem fetching school data:", error);
    }
  };

  useEffect(() => {
    if (searchParams) {
      const states = searchParams.get('states')

      if (states)
      {
        fetchSchoolData(states);
      }
    }
  },[]);

  return (
    <div className="container p-0 mt-6">
      <h1 className="text-2xl font-bold mb-8">Welcome [Student]</h1>

      <h2 className="text-xl font-bold mb-1 mt-4">Schools that match your profile interests</h2>
      <ul className="flex flex-wrap">
        {
          schools.slice(0, 5).map((school, index) => (
            <li key={index} className="flex rounded bg-slate-50 relative justify-center items-center text-sm w-[200px] h-[150px] p-6 m-1 border border-red" >
              {school.INSTNM}
              <div className="absolute right-3 bottom-3 text-slate-400">{school.STABBR}</div>
            </li>
          ))
        }
      </ul>

      <h2  className="text-xl font-bold mb-1 mt-4">Browse</h2>
      <ul className="flex flex-wrap ">
        {
          schools.map((school, index) => (
            <li key={index} className="flex rounded bg-slate-50 relative justify-center items-center text-sm w-[200px] h-[150px] p-6 m-1 border border-red" >
              {school.INSTNM}
              <div className="absolute right-3 bottom-3 text-slate-400">{school.STABBR}</div>
            </li>
          ))
        }
      </ul>

    </div>
  );
}