"use client";
import React, { useEffect, useState } from "react";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import { useRouter } from "next/navigation";
import LoadingSpinner from "../shared/loading-spinner";
import Image from "next/image";

export default function AcademicInfo() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const schoolId = "b14e03a9-656a-4726-9d38-6f09c912a543";

  useEffect(() => {

    const fetchSchoolData = async () => {
      // dummy request to mock actual request
      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/manager/profile/academic-info?schoolId=${schoolId}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setIsLoading(false);
      } catch (error) {
        console.error("There was a problem fetching school data:", error);
      }
    };

    if (schoolId) {
      fetchSchoolData();
    }
  }, [schoolId]);

  const handleSubmit = async (values, { setSubmitting }) => {
    setSubmitting(true);
    try {
      values.schoolId = "b14e03a9-656a-4726-9d38-6f09c912a543";
      console.log("TEST VALUES", values);
      const url = "/api/manager/profile/academic-info";
      // Send a POST request to the server
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(values), // Convert form values to JSON
      });
      if (response.ok) {
        const responseData = await response.json();
        // Handle success - you can redirect to another page or show a success message
      } else {
        throw new Error(`Error: ${response.status}`);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      // Handle errors - show error message to the user, etc.
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  let isSubmitting = false;
  return (
    <Formik
      onSubmit={handleSubmit}
    >
    <div className="flex flex-col items-center justify-center rows bg-gray-100 p-6 mt-40 self-center rounded-md w-[500px] center">
        <Image
            src="/images/logo/text-logo.png"
            className="mb-4 mt-1"
            width={260}
            height={0}
            alt="logo"
        />
        <h1 className="text-3xl font-bold">Welcome to Prep Intel!</h1>

        <h2 className="text-xl font-bold mt-4">By joining Prep Intel, you will gain access to:</h2>

        <ul className="w-full items-center mt-2">
            <li className="rounded-full text-center bg-gray-200 p-2 pr-4 pl-4 mb-1">Greater Transparency into Your Student Funnel</li>
            <li className="rounded-full text-center bg-gray-200 p-2 pr-4 pl-4 mb-1">Reports and Trends with Your School</li>
            <li className="rounded-full text-center bg-gray-200 p-2 pr-4 pl-4 mb-1">Increase Your Outreach to Prospects</li>
        </ul>

        <div className="w-full mt-5">
            <label
                htmlFor="school_email"
                className="p-1 block text-sm font-medium text-gray-700"
            >
                School Email Address
            </label>
            <Field
                name="school_email"
                type="text"
                placeholder="School State"
                className="border-2 w-full p-2 rounded-md"
            />
            <ErrorMessage
                name="school_email"
                component="div"
                className="text-red-500"
            />
        </div>

        <button
          type="submit"
          className="flex items-center bg-primary hover:bg-primary-500 text-white font-bold py-3 mt-5 px-4 rounded mr-1"
          disabled={isSubmitting}
          onClick={() => router.push("/manager/profile/school-welcome")}
          >
            <div className="leading-none inline-block -mt-1">Claim My Account</div>
        </button>
    </div>
    </Formik>
  );
}
