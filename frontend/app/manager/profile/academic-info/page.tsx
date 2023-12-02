// AcademicInfo.client.js
"use client";
import React, { useEffect, useState } from "react";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import * as Yup from "yup";
// Define the validation schema using Yup
const validationSchema = Yup.object().shape({
  departments: Yup.array().of(
    Yup.object().shape({
      name: Yup.string().required("Department name is required"),
    })
  ),
  accreditations: Yup.array().of(
    Yup.object().shape({
      name: Yup.string().required("Accreditation is required"),
    })
  ),
  researchOpportunities: Yup.array().of(
    Yup.object().shape({
      name: Yup.string().required("Research opportunity name is required"),
    })
  ),

  admissionRequirements: Yup.object().shape({
    actScore: Yup.number().when("actRequired", {
      is: true,
      then: (schema) =>
        schema
          .required("ACT Score is required")
          .min(0, "ACT Score must be at least 0")
          .max(36, "ACT Score cannot exceed 36"),
      otherwise: (schema) => schema.notRequired(),
    }),
    satScore: Yup.number().when("satRequired", {
      is: true,
      then: (schema) =>
        schema
          .required("SAT Score is required")
          .min(0, "SAT Score must be at least 0")
          .max(1600, "SAT Score cannot exceed 1600"),
      otherwise: (schema) => schema.notRequired(),
    }),
    gpa: Yup.number().when("diplomaRequired", {
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
    // scholarshipInfoURL: Yup.string()
    //   .required("Scholarship Information URL is required")
    //   .url("Enter a valid URL"),
    // financialAidInfoURL: Yup.string().url("Enter a valid URL"),
  }),
  // You can add research opportunities and other sections similarly
});

export default function AcademicInfo() {
  const [isLoading, setIsLoading] = useState(false);
  const schoolId = "b14e03a9-656a-4726-9d38-6f09c912a543";
  const initialValues = {
    departments: [{ name: "" }],
    accreditations: [{ name: "" }],
    researchOpportunities: [{ name: "" }],
    admissionRequirements: {
      actRequired: false,
      satRequired: false,
      diplomaRequired: false,
      actScore: "",
      satScore: "",
      gpa: "",
    },
    financials: {
      inStateTuition: "",
      outOfStateTuition: "",
      feesPerSemester: "",
      scholarshipInfoURL: "",
      financialAidInfoURL: "",
    },
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
        console.log("data", data);
        //setSchoolData(data);
      } catch (error) {
        console.error("There was a problem fetching school data:", error);
      }
      setIsLoading(false);
    };

    if (schoolId) {
      fetchSchoolData();
    }
  }, [schoolId]);

  const handleSubmit = async (values, { setSubmitting }) => {
    setSubmitting(true);
    //TODO FOR JOEY
    //Pass the school id down, rn it will be static:
    //b14e03a9-656a-4726-9d38-6f09c912a543
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
              {/* Departments FieldArray */}
              <FieldArray name="departments">
                {({ insert, remove, push }) => (
                  <div>
                    {values.departments.length > 0 &&
                      values.departments.map((department, index) => (
                        <div key={index} className="mb-3 space-y-4">
                          <label
                            htmlFor={`departments.${index}.name`}
                            className="block text-sm font-medium text-gray-700"
                          >
                            Department or Program
                          </label>
                          <Field
                            name={`departments.${index}.name`}
                            placeholder="Department or Program"
                            type="text"
                            className="border-2 w-full p-2"
                          />
                          <ErrorMessage
                            name={`departments.${index}.name`}
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
                            {values.departments.length > 1 && (
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
              <FieldArray name="accreditations">
                {({ insert, remove, push }) => (
                  <div>
                    {values.accreditations.length > 0 &&
                      values.accreditations.map((accreditation, index) => (
                        <div key={index} className="mb-3 space-y-4">
                          <label
                            htmlFor={`accreditations.${index}.name`}
                            className="block text-sm font-medium text-gray-700"
                          >
                            Accreditations
                          </label>
                          <Field
                            name={`accreditations.${index}.name`}
                            placeholder="Accreditations"
                            type="text"
                            className="border-2 w-full p-2"
                          />
                          <ErrorMessage
                            name={`accreditations.${index}.name`}
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
                            {values.accreditations.length > 1 && (
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
              <FieldArray name="researchOpportunities">
                {({ insert, remove, push }) => (
                  <div>
                    {values.researchOpportunities.length > 0 &&
                      values.researchOpportunities.map((opportunity, index) => (
                        <div key={index} className="mb-3 space-y-4">
                          <label
                            htmlFor={`researchOpportunities.${index}.name`}
                            className="block text-sm font-medium text-gray-700"
                          >
                            Research Opportunities
                          </label>
                          <Field
                            name={`researchOpportunities.${index}.name`}
                            placeholder="Research Opportunities"
                            type="text"
                            className="border-2 w-full p-2"
                          />
                          <ErrorMessage
                            name={`researchOpportunities.${index}.name`}
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
                            {values.researchOpportunities.length > 1 && (
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
                    name="admissionRequirements.actRequired"
                    className="form-checkbox"
                  />
                  <span className="ml-2">ACT Required</span>
                </label>
                {values.admissionRequirements.actRequired && (
                  <div className="mb-5 mt-5">
                    <label
                      htmlFor="admissionRequirements.actScore"
                      className="block text-sm font-medium text-gray-700"
                    >
                      ACT Score Requirement
                    </label>
                    <Field
                      name="admissionRequirements.actScore"
                      type="number"
                      placeholder="ACT Score Requirement"
                      className="border-2 w-full p-2 mt-2 rounded-md"
                    />
                    <ErrorMessage
                      name="admissionRequirements.actScore"
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
                    name="admissionRequirements.satRequired"
                    className="form-checkbox"
                  />
                  <span className="ml-2">SAT Required</span>
                </label>
                {values.admissionRequirements.satRequired && (
                  <div className="mb-5 mt-5">
                    <label
                      htmlFor="admissionRequirements.satScore"
                      className="block text-sm font-medium text-gray-700"
                    >
                      SAT Score Requirement
                    </label>
                    <Field
                      name="admissionRequirements.satScore"
                      type="number"
                      placeholder="SAT Score Requirement"
                      className="border-2 w-full p-2 mt-2 rounded-md"
                    />
                    <ErrorMessage
                      name="admissionRequirements.satScore"
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
                    name="admissionRequirements.diplomaRequired"
                    className="form-checkbox"
                  />
                  <span className="ml-2">Diploma/GED Required</span>
                </label>
                {values.admissionRequirements.diplomaRequired && (
                  <div className="mb-5 mt-5">
                    <label
                      htmlFor="admissionRequirements.gpa"
                      className="block text-sm font-medium text-gray-700"
                    >
                      GPA Requirement
                    </label>
                    <Field
                      name="admissionRequirements.gpa"
                      type="number"
                      placeholder="GPA Requirement"
                      className="border-2 w-full p-2 mt-2 rounded-md"
                    />
                    <ErrorMessage
                      name="admissionRequirements.gpa"
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
                    name="financials.schoolarshipInfoURL"
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
                    name="financials.financeAidInfoURL"
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
              {/* <button
                type="submit"
                // onClick={handleSubmit}
                className="rounded-md bg-blue-500 text-white px-4 py-2"
                // disabled={isSubmitting}
              >
                {isSubmitting ? "Please wait..." : "Next"}
              </button> */}
              <button
                type="submit"
                className="rounded-md bg-blue-500 text-white px-4 py-2"
              >
                {isSubmitting ? "Please wait..." : "Next"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
