// AcademicInfo.client.js
"use client";
import React, { useEffect, useState } from "react";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useRouter, usePathname, useParams } from "next/navigation";
import { CompletionPanel } from "@/components/completion-panel";
import { FormSection } from "@/components/form-section";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useAppDispatch } from "@/redux/store";
import { setSchoolInformation } from "@/redux/features/school/managerSlice";
import LoadingSpinner from "../../../_components/loading-spinner";
import BottomBar from "../../../_components/bottom-bar";

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
  application_url: Yup.string().required("Application url is required"),

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
  const router = useRouter();
  const pageParams = useParams();
  const schoolId = pageParams?.id;

  const [isFetchedAcademiInfo, setIsFetchedAcademiInfo] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState(true);

  const [initialValues, setInitialValues] = useState({
    school_departments: [{ name: "" }],
    school_accreditations: [{ name: "" }],
    school_research_programs: [{ name: "" }],
    application_url: "",
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

  const dispatch = useAppDispatch()

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
    application_url: string;
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
        act_required: data.act_required ?? false,
        sat_required: data.sat_required ?? false,
        diploma_required: data.diploma_required ?? false,
        min_act_score: data.min_act_score ?? "", // Shouldn't pass empty string. Remove from request payload if no value
        min_sat_score: data.min_sat_score ?? "",  //Shouldn't pass empty string. Remove from request payload if no value
        gpa_requirement: data.gpa_requirement ?? "", //Shouldn't pass empty string. Remove from request payload if no value
      },

      financials: {
        inStateTuition: data.in_state_tuition ?? "",
        outOfStateTuition: data.out_state_tuition ?? "",
        feesPerSemester: data.fees_per_semester ?? "",
        scholarshipInfoURL: data.scholarship_url ?? "",
        financialAidInfoURL: data.financial_aid_url ?? "",
      },
      application_url: data.application_url ?? "",
    });
  };

  useEffect(() => {

    const fetchSchoolData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/manager/profile/academic-info?schoolId=${schoolId}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const school = await response.json();
        dispatch(setSchoolInformation({ slug: 'school_data', data: school.data }))
        setSchoolData(school.data);
        setIsLoading(false);
        setIsFetchedAcademiInfo(true)
      } catch (error) {
        //console.error("There was a problem fetching school data:", error);
      }
    };

    if(schoolId){
      !isFetchedAcademiInfo && fetchSchoolData()
    }

  }, []);

  const handleBack = () => {
    // Logic for Back button
    router.push(`/school/${schoolId}/school-profile`);
  };

  const handleSaveForLater = () => {
    // Logic for Save for Later button
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    let admissionRequirements = values.admissionRequirements

    const filterProperties = ({ act_required, sat_required, diploma_required, ...rest }) => {
      if (!act_required) {
        delete rest.min_act_score;
      }
      if (!sat_required) {
        delete rest.min_sat_score;
      }
      if (!diploma_required) {
        delete rest.gpa_requirement;
      }
      return { act_required, sat_required, diploma_required, ...rest };
    };

    const filteredPayload = filterProperties(admissionRequirements);

    setSubmitting(true);
    try {
      let payload = {...values, admissionRequirements: filteredPayload, schoolId}
      // console.log("TEST VALUES", payload);
      const url = "/api/manager/profile/academic-info";
      // Send a POST request to the server
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(payload),
      });
      if (response.ok) {
        const responseData = await response.json();
          dispatch(setSchoolInformation({ slug: 'school_data', data: {...responseData.data.school, create_count: 2} }))
        toast.success("Academic Record Submitted Successfully")
        router.push(`/school/${schoolId}/preview-school`)
        // Handle success - you can redirect to another page or show a success message
      } else {
        throw new Error(`Error: ${response.status}`);
      }
    } catch (error) {
      //console.error("Error submitting form:", error);
      // Handle errors - show error message to the user, etc.
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ values, isSubmitting }) => (

        <Form className="flex-grow">

          <div className="container mx-auto p-6">
            <CompletionPanel percentCompleted={40} title={"2/3"}></CompletionPanel>
            <h1 className="text-2xl my-3 font-bold text-gray-800 mb-6">
              Create your School's Profile
            </h1>

            <FormSection title={"Academic Information"} />
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
                              className="flex-1 rounded-md bg-gray-300 text-white px-3 py-1"
                              onClick={() => push({ name: "" })}
                            >
                              Add Additional
                            </button>
                            {values.school_departments.length > 1 && (
                              <button
                                type="button"
                                className="flex-1 rounded-md bg-red-300 text-white px-3 py-1"
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
                                className="flex-1 rounded-md bg-gray-300 text-white px-3 py-1"
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
                                className="flex-1 rounded-md bg-gray-300 text-white px-3 py-1"
                                onClick={() => push({ name: "" })}
                              >
                                Add Additional
                              </button>
                              {values.school_research_programs.length > 1 && (
                                <button
                                  type="button"
                                  className="flex-1 rounded-md bg-red-300 text-white px-3 py-1"
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

            <FormSection title={"Admission Requirements"} />
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

            <FormSection title={"Financials"} />
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
              <div className="space-y-4">
                <label
                  htmlFor="application_url"
                  className="block text-sm font-medium text-gray-700"
                >
                  Application URL
                </label>
                <div className="space-y-4">
                  <Field
                    name="application_url"
                    type="text"
                    placeholder="Application URL"
                    className="border-2 w-full p-2 rounded-md"
                  />
                  <ErrorMessage
                    name="application_url"
                    component="div"
                    className="text-red-500"
                  />
                </div>
              </div>
            </div>
          </div>

          <BottomBar
            onBack={handleBack}
            onSaveForLater={handleSaveForLater}
            isBackDisabled={false}
            isSubmitting={isSubmitting}
          />
        </Form>
      )}
    </Formik>
  );
}
