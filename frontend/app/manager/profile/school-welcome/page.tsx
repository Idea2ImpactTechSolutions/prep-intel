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
    <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">My School</h1>
        <div className="flex w-full justify-center rows bg-gray-100 p-6 mt-2 self-center rounded-md">
            <div className="flex flex-col items-center justify-center rows bg-gray-100 p-6 mt-20 self-center w-[800px] center">
                <Image
                    src="/images/school_welcome.png"
                    className="mb-4 mt-1"
                    width={260}
                    height={0}
                    alt="logo"
                />
                <h1 className="text-2xl font-bold mt-0 m-6">Welcome to the "My School" Tab!</h1>

                <div>
                    Creating your school's profile is the key to unlocking the potential of this platform. Not only does it allow
                    eager students to discover and learn about the unique offerings of your institution, but it also empowers
                    them to gauge their chances of acceptance and visualize their academic future with you. By curating a
                    compelling and informative profile, you're taking a significant step toward broadening your reach,
                    attracting the right talent, and streamlining the admissions process.
                </div>
                <button
                    type="submit"
                    className="flex items-center bg-primary hover:bg-primary-500 text-white font-bold py-3 mt-6 px-4 rounded mr-1"
                    disabled={isSubmitting}
                    onClick={() => router.push("/manager/profile/school-profile")}
                    >
                    <div className="leading-none inline-block -mt-1">Create Your School's Profile</div>
                </button>
            </div>
        </div>
    </div>
  );
}
