// AcademicInfo.client.js
"use client";
import React, { useEffect, useState } from "react";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import * as Yup from "yup";
// Define the validation schema using Yup
const validationSchema = Yup.object().shape({
  school_departments: Yup.array().of(
    Yup.object().shape({
      name: Yup.string().required("Department name is required"),
    })
  ),
  school_accreditations: Yup.array().of(
    Yup.object().shape({
      name: Yup.string().required("Accreditation is required"),
    })
  ),
  school_research_programs: Yup.array().of(
    Yup.object().shape({
      name: Yup.string().required("Research opportunity name is required"),
    })
  ),

  admissionRequirements: Yup.object().shape({
    min_act_score: Yup.number().when("act_required", {
      is: true,
      then: (schema) =>
        schema
          .required("ACT Score is required")
          .min(0, "ACT Score must be at least 0")
          .max(36, "ACT Score cannot exceed 36"),
      otherwise: (schema) => schema.notRequired(),
    }),
    min_sat_score: Yup.number().when("sat_required", {
      is: true,
      then: (schema) =>
        schema
          .required("SAT Score is required")
          .min(0, "SAT Score must be at least 0")
          .max(1600, "SAT Score cannot exceed 1600"),
      otherwise: (schema) => schema.notRequired(),
    }),
    gpa_requirement: Yup.number().when("diploma_required", {
      is: true,
      then: (schema) =>
        schema
          .required("GPA is required")
          .min(0, "GPA must be at least 0")
          .max(4, "GPA cannot exceed 4.0"),
      otherwise: (schema) => schema.notRequired(),
    }),
  }),

  financials: Yup.object().shape({
    inStateTuition: Yup.number().required("In-state tuition is required"),
    outOfStateTuition: Yup.number().required(
      "Out-of-state tuition is required"
    ),
    feesPerSemester: Yup.number().required("Fees per semester are required"),
    scholarshipInfoURL: Yup.string().required(
      "Scholarship Information URL is required"
    ),
    financialAidInfoURL: Yup.string().required(
      "Financial Aid Information URL is required"
    ),
  }),
  // You can add research opportunities and other sections similarly
});

export default function AcademicInfo() {
  const [isLoading, setIsLoading] = useState(true);
  const schoolId = "b14e03a9-656a-4726-9d38-6f09c912a543";
  const [initialValues, setInitialValues] = useState({
    school_departments: [{ name: "" }],
    school_accreditations: [{ name: "" }],
    school_research_programs: [{ name: "" }],
    admissionRequirements: {
      act_required: false,
      sat_required: false,
      diploma_required: false,
      min_act_score: 0,
      min_sat_score: 0,
      gpa_requirement: 0,
    },
    financials: {
      inStateTuition: 0,
      outOfStateTuition: 0,
      feesPerSemester: 0,
      scholarshipInfoURL: "",
      financialAidInfoURL: "",
    },
  });

  const setSchoolData = (data: {
    school_departments: { name: string }[];
    school_accreditations: { name: string }[];
    school_research_programs: { name: string }[];
    act_required: boolean;
    sat_required: boolean;
    diploma_required: boolean;
    min_act_score: number;
    min_sat_score: number;
    gpa_requirement: number;
    in_state_tuition: number;
    out_state_tuition: number;
    fees_per_semester: number;
    scholarship_url: string;
    financial_aid_url: string;
  }) => {
    setInitialValues({
      school_departments:
        data.school_departments.length > 0
          ? data.school_departments.map((department: { name: string }) => ({
              name: department.name ?? "",
            }))
          : [{ name: "" }],
      school_accreditations:
        data.school_accreditations.length > 0
          ? data.school_accreditations.map(
              (accreditation: { name: string }) => ({
                name: accreditation.name ?? "",
              })
            )
          : [{ name: "" }],
      school_research_programs:
        data.school_research_programs.length > 0
          ? data.school_research_programs.map(
              (opportunity: { name: string }) => ({
                name: opportunity.name ?? "",
              })
            )
          : [{ name: "" }],
      admissionRequirements: {
        act_required: data.act_required ?? "",
        sat_required: data.sat_required ?? "",
        diploma_required: data.diploma_required ?? "",
        min_act_score: data.min_act_score ?? "",
        min_sat_score: data.min_sat_score ?? "",
        gpa_requirement: data.gpa_requirement ?? "",
      },

      financials: {
        inStateTuition: data.in_state_tuition ?? "",
        outOfStateTuition: data.out_state_tuition ?? "",
        feesPerSemester: data.fees_per_semester ?? "",
        scholarshipInfoURL: data.scholarship_url ?? "",
        financialAidInfoURL: data.financial_aid_url ?? "",
      },
    });

    console.log("INITIAL_VALUES", initialValues);
  };

  useEffect(() => {
    const fetchSchoolData = async () => {
      setIsLoading(true);
      const schoolId = "b14e03a9-656a-4726-9d38-6f09c912a543";
      try {
        const response = await fetch(
          `/api/manager/profile/academic-info?schoolId=${schoolId}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setSchoolData(data);
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
    // TODO: Add loading spinner
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-5xl font-bold text-gray-800 mb-6">
        Create your School's Profile
      </h1>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, isSubmitting }) => (
          <Form>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">
              Academic Information
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* school_departments FieldArray */}
              <FieldArray name="school_departments">
                {({ insert, remove, push }) => (
                  <div>
                    {values.school_departments.length > 0 &&
                      values.school_departments.map((department, index) => (
                        <div key={index} className="mb-3 space-y-4">
                          <label
                            htmlFor={`school_departments.${index}.name`}
                            className="block text-sm font-medium text-gray-700"
                          >
                            Department or Program
                          </label>
                          <Field
                            name={`school_departments.${index}.name`}
                            placeholder="Department or Program"
                            type="text"
                            className="border-2 w-full p-2"
                          />
                          <ErrorMessage
                            name={`school_departments.${index}.name`}
                            component="div"
                            className="text-red-500"
                          />
                          <div className="flex items-center space-x-2">
                            <button
                              type="button"
                              className="flex-1 rounded-md bg-green-500 text-white px-3 py-1"
                              onClick={() => push({ name: "" })}
                            >
                              Add Additional
                            </button>
                            {values.school_departments.length > 1 && (
                              <button
                                type="button"
                                className="flex-1 rounded-md bg-red-500 text-white px-3 py-1"
                                onClick={() => remove(index)}
                              >
                                Remove
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </FieldArray>

              {/* Accreditations FieldArray */}
              <FieldArray name="school_accreditations">
                {({ insert, remove, push }) => (
                  <div>
                    {values.school_accreditations.length > 0 &&
                      values.school_accreditations.map(
                        (accreditation, index) => (
                          <div key={index} className="mb-3 space-y-4">
                            <label
                              htmlFor={`school_accreditations.${index}.name`}
                              className="block text-sm font-medium text-gray-700"
                            >
                              Accreditations
                            </label>
                            <Field
                              name={`school_accreditations.${index}.name`}
                              placeholder="Accreditations"
                              type="text"
                              className="border-2 w-full p-2"
                            />
                            <ErrorMessage
                              name={`school_accreditations.${index}.name`}
                              component="div"
                              className="text-red-500"
                            />
                            <div className="flex items-center space-x-2">
                              <button
                                type="button"
                                className="flex-1 rounded-md bg-green-500 text-white px-3 py-1"
                                onClick={() => push({ name: "" })}
                              >
                                Add Additional
                              </button>
                              {values.school_accreditations.length > 1 && (
                                <button
                                  type="button"
                                  className="flex-1 rounded-md bg-red-500 text-white px-3 py-1"
                                  onClick={() => remove(index)}
                                >
                                  Remove
                                </button>
                              )}
                            </div>
                          </div>
                        )
                      )}
                  </div>
                )}
              </FieldArray>
              <FieldArray name="school_research_programs">
                {({ insert, remove, push }) => (
                  <div>
                    {values.school_research_programs.length > 0 &&
                      values.school_research_programs.map(
                        (opportunity, index) => (
                          <div key={index} className="mb-3 space-y-4">
                            <label
                              htmlFor={`school_research_programs.${index}.name`}
                              className="block text-sm font-medium text-gray-700"
                            >
                              Research Opportunities
                            </label>
                            <Field
                              name={`school_research_programs.${index}.name`}
                              placeholder="Research Opportunities"
                              type="text"
                              className="border-2 w-full p-2"
                            />
                            <ErrorMessage
                              name={`school_research_programs.${index}.name`}
                              component="div"
                              className="text-red-500"
                            />
                            <div className="flex items-center space-x-2">
                              <button
                                type="button"
                                className="flex-1 rounded-md bg-green-500 text-white px-3 py-1"
                                onClick={() => push({ name: "" })}
                              >
                                Add Additional
                              </button>
                              {values.school_research_programs.length > 1 && (
                                <button
                                  type="button"
                                  className="flex-1 rounded-md bg-red-500 text-white px-3 py-1"
                                  onClick={() => remove(index)}
                                >
                                  Remove
                                </button>
                              )}
                            </div>
                          </div>
                        )
                      )}
                  </div>
                )}
              </FieldArray>
              {/* Add your Research Opportunities FieldArray here in a similar manner */}
            </div>
            <h2 className="text-xl font-semibold mb-4">
              Admission Requirements
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="inline-flex items-center">
                  <Field
                    type="checkbox"
                    name="admissionRequirements.act_required"
                    className="form-checkbox"
                  />
                  <span className="ml-2">ACT Required</span>
                </label>
                {values.admissionRequirements.act_required && (
                  <div className="mb-5 mt-5">
                    <label
                      htmlFor="admissionRequirements.min_act_score"
                      className="block text-sm font-medium text-gray-700"
                    >
                      ACT Score Requirement
                    </label>
                    <Field
                      name="admissionRequirements.min_act_score"
                      type="number"
                      placeholder="ACT Score Requirement"
                      className="border-2 w-full p-2 mt-2 rounded-md"
                    />
                    <ErrorMessage
                      name="admissionRequirements.min_act_score"
                      component="div"
                      className="text-red-500"
                    />
                  </div>
                )}
              </div>
              <div>
                <label className="inline-flex items-center">
                  <Field
                    type="checkbox"
                    name="admissionRequirements.sat_required"
                    className="form-checkbox"
                  />
                  <span className="ml-2">SAT Required</span>
                </label>
                {values.admissionRequirements.sat_required && (
                  <div className="mb-5 mt-5">
                    <label
                      htmlFor="admissionRequirements.min_sat_score"
                      className="block text-sm font-medium text-gray-700"
                    >
                      SAT Score Requirement
                    </label>
                    <Field
                      name="admissionRequirements.min_sat_score"
                      type="number"
                      placeholder="SAT Score Requirement"
                      className="border-2 w-full p-2 mt-2 rounded-md"
                    />
                    <ErrorMessage
                      name="admissionRequirements.min_sat_score"
                      component="div"
                      className="text-red-500"
                    />
                  </div>
                )}
              </div>
              <div>
                <label className="inline-flex items-center">
                  <Field
                    type="checkbox"
                    name="admissionRequirements.diploma_required"
                    className="form-checkbox"
                  />
                  <span className="ml-2">Diploma/GED Required</span>
                </label>
                {values.admissionRequirements.diploma_required && (
                  <div className="mb-5 mt-5">
                    <label
                      htmlFor="admissionRequirements.gpa_requirement"
                      className="block text-sm font-medium text-gray-700"
                    >
                      GPA Requirement
                    </label>
                    <Field
                      name="admissionRequirements.gpa_requirement"
                      type="number"
                      placeholder="GPA Requirement"
                      className="border-2 w-full p-2 mt-2 rounded-md"
                    />
                    <ErrorMessage
                      name="admissionRequirements.gpa_requirement"
                      component="div"
                      className="text-red-500"
                    />
                  </div>
                )}
              </div>
            </div>
            <h2 className="text-xl font-semibold mb-4">Financials</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="space-y-4">
                <label
                  htmlFor="financials.inStateTuition"
                  className="block text-sm font-medium text-gray-700"
                >
                  In-State Tuition
                </label>
                <Field
                  name="financials.inStateTuition"
                  type="number"
                  placeholder="In-State Tuition"
                  className="border-2 w-full p-2 rounded-md"
                />
                <ErrorMessage
                  name="financials.inStateTuition"
                  component="div"
                  className="text-red-500"
                />
              </div>
              <div className="space-y-4">
                <label
                  htmlFor="financials.outOfStateTuition"
                  className="block text-sm font-medium text-gray-700"
                >
                  Out-of-State Tuition
                </label>
                <Field
                  name="financials.outOfStateTuition"
                  type="number"
                  placeholder="Out-of-State Tuition"
                  className="border-2 w-full p-2 rounded-md"
                />
                <ErrorMessage
                  name="financials.outOfStateTuition"
                  component="div"
                  className="text-red-500"
                />
              </div>
              <div className="mb-2 mt-2 space-y-4">
                <label
                  htmlFor="financials.financialAidInfoURL"
                  className="block text-sm font-medium text-gray-700"
                >
                  Fees Per Semester
                </label>
                <Field
                  name="financials.feesPerSemester"
                  type="number"
                  placeholder="Fees Per Semester"
                  className="border-2 w-full p-2 rounded-md"
                />
                <ErrorMessage
                  name="financials.feesPerSemester"
                  component="div"
                  className="text-red-500"
                />
              </div>
              <div className="mb-2 mt-2 space-y-4">
                <label
                  htmlFor="financials.scholarshipInfoURL"
                  className="block text-sm font-medium text-gray-700"
                >
                  Scholarship Information URL
                </label>
                <div className="space-y-4">
                  <Field
                    name="financials.scholarshipInfoURL"
                    type="text"
                    placeholder="Scholarship Information URL"
                    className="border-2 w-full p-2 rounded-md"
                  />
                  <ErrorMessage
                    name="financials.scholarshipInfoURL"
                    component="div"
                    className="text-red-500"
                  />
                </div>
              </div>
              <div className="space-y-4">
                <label
                  htmlFor="financials.financialAidInfoURL"
                  className="block text-sm font-medium text-gray-700"
                >
                  Financial Information URL
                </label>
                <div className="space-y-4">
                  <Field
                    name="financials.financialAidInfoURL"
                    type="text"
                    placeholder="Financial Aid Information URL"
                    className="border-2 w-full p-2 rounded-md"
                  />
                  <ErrorMessage
                    name="financials.financialAidInfoURL"
                    component="div"
                    className="text-red-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-6">
              <button
                type="button"
                className="rounded-md bg-gray-200 text-black px-4 py-2"
              >
                Back
              </button>
              {isSubmitting ? (
                <button
                  disabled
                  type="button"
                  className="text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex items-center cursor-not-allowed opacity-25"
                >
                  <svg
                    aria-hidden="true"
                    role="status"
                    className="inline w-4 h-4 me-3 text-white animate-spin"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="#E5E7EB"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentColor"
                    />
                  </svg>
                  Loading...
                </button>
              ) : (
                <button
                  type="submit"
                  className="rounded-md bg-blue-500 text-white px-4 py-2"
                >
                  Next
                </button>
              )}
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
