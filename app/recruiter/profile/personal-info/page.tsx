"use client";
import React from "react";
import { Formik, Field, ErrorMessage } from "formik";
import BottomBar from "../shared/bottom-bar";
import { useRouter } from "next/navigation";
import { FaUser } from "react-icons/fa";

const handleSubmit = async () => {
  // Placeholder
}

export default function Page() {
  const router = useRouter();
  // Placeholder
  let isSubmitting = false;

  const initialValues = {
    school_email: '',
  };

  return (
    <Formik
      onSubmit={handleSubmit}
      initialValues={initialValues}
    >
    <div className="container p-0 mt-6">
        <h1 className="text-2xl font-bold mb-4">Recruiter</h1>
        <div className="flex w-full justify-center rows bg-gray-100 p-6 mt-2 self-center rounded-tl-md rounded-tr-md pb-20">
            <div className="flex flex-col items-center justify-center rows bg-gray-150 p-6 mt-20 self-center w-[600px] center">

                <div className="border-solid w-full border-red-100">
                  <h1 className="text-2xl font-bold mb-8">Lets Get to Know You</h1>

                  <div className="flex items-center justify-items-center">
                    <div className="bg-red-200 border-2 border-dashed border-primary p-4 mr-4 rounded-full"><FaUser /></div>

                    <div className="text-sm text-primary font-bold">
                      Add a Profile Picture
                    </div>
                  </div>



                  <div className="w-full mt-5">
                  <label
                      htmlFor="school_email"
                      className="p-1 block text-sm font-medium text-gray-700"
                  >
                      First Name
                  </label>
                  <Field
                      name="school_email"
                      type="text"
                      placeholder=""
                      className="border-2 w-full p-2 rounded-md"
                  />
                  <ErrorMessage
                      name="school_email"
                      component="div"
                      className="text-red-500"
                  />
              </div>

              <div className="w-full mt-5">
                  <label
                      htmlFor="school_email"
                      className="p-1 block text-sm font-medium text-gray-700"
                  >
                      Last Name
                  </label>
                  <Field
                      name="school_email"
                      type="text"
                      placeholder=""
                      className="border-2 w-full p-2 rounded-md"
                  />
                  <ErrorMessage
                      name="school_email"
                      component="div"
                      className="text-red-500"
                  />
              </div>

              <div className="w-full mt-5">
                  <label
                      htmlFor="school_email"
                      className="p-1 block text-sm font-medium text-gray-700"
                  >
                      Phone Number
                  </label>
                  <Field
                      name="school_email"
                      type="text"
                      placeholder=""
                      className="border-2 w-full p-2 rounded-md"
                  />
                  <ErrorMessage
                      name="school_email"
                      component="div"
                      className="text-red-500"
                  />
              </div>

              </div>
            </div>
        </div>
        <BottomBar
            isBackDisabled={true}
            isSubmitting={isSubmitting}
            onBack={() => {}}
            onNext={() => router.push("/recruiter/profile/territory")}
          />
    </div>
    </Formik>
  );
}