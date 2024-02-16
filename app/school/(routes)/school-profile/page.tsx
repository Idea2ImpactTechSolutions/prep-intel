"use client";
import React, { useState, useEffect } from "react";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import BottomBar from "../shared/bottom-bar";
import LoadingSpinner from "../shared/loading-spinner";
import { CompletionPanel } from "@/components/completion-panel";
import { FormSection } from "@/components/form-section";

// Define the validation schema using Yup
const validationSchema = Yup.object().shape({
  school_details: Yup.object().shape({
    name: Yup.string().required("School name is required"),
    founded_date: Yup.string().required("Founded date is required"),
    institution_type: Yup.string().required("Institution type is required"),
    tagline: Yup.string().required("School tagline is required"),
    affliations: Yup.string().required("School affliations is required"),
  }),
  school_address: Yup.object().shape({
    school_street_address: Yup.string().required(
      "School street address is required"
    ),
    school_state: Yup.string().required("School state is required"),
    school_zip: Yup.string().required("School zip code is required"),

    contact_types: Yup.array().of(
      Yup.object().shape({
        // type: Yup.string().required("Contact type is required"),
        phone: Yup.string().required("Phone Number is required"),
        // .matches(
        //   /^(?:\(\d{3}\)|\d{3}-)\d{3}-\d{4}$/,
        //   "Invalid phone number format"
        // ),
        email: Yup.string()
          .email("Invalid email address")
          .required("Email is required"),
      })
    ),
  }),
  school_social_medias: Yup.array().of(
    Yup.object().shape({
      social_media: Yup.string().required("Social media platform is required"),
      // url: Yup.string().url("Invalid URL"),
    })
  ),
});

export default function Page () {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const school_id = "b14e03a9-656a-4726-9d38-6f09c912a543";
  const [initialValues, setInitialValues] = useState({
    school_details: {
      school_logo: "",
      name: "",
      founded_date: "",
      institution_type: "University",
      tagline: "",
      affliations: "",
    },

    school_address: {
      school_street_address: "",
      school_state: "",
      school_zip: "",
      contact_types: [
        {
          type: "",
          phone: "",
          email: "",
        },
      ],
    },
    school_social_medias: [{ social_media: "Facebook", url: "" }],
  });

  const handleBack = () => {
    // Logic for Back button
    console.log("Back button");
  };

  const handleSaveForLater = () => {
    // Logic for Save for Later button
    console.log("Save for Later");
  };

  const setSchoolData = (data) => {
    setInitialValues({
      school_details: {
        school_logo: data.school_logo ?? "",
        name: data.name ?? "",
        founded_date: data.found_date ?? "",
        institution_type: data.institution_type ?? "University",
        tagline: data.tagline ?? "",
        affliations: data.affliations ?? "",
      },

      school_address: {
        school_street_address: data.school_address.street_address_1 ?? "",
        school_state: data.school_address.state ?? "",
        school_zip: data.school_address.postal ?? "",
        contact_types:
          data.school_contacts.legnth > 0
            ? data.school_contacts.map((contact) => ({
                type: contact.type ?? "",
                phone: contact.phone ?? "",
                email: contact.email ?? "",
              }))
            : [
                {
                  type: "Admissions",
                  phone: "",
                  email: "",
                },
              ],
      },

      school_social_medias:
        data.school_social_medias.legnth > 0
          ? data.school_social_medias.map((social) => ({
              social_media: social.social_media ?? "",
              url: social.url ?? "",
            }))
          : [{ social_media: "Facebook", url: "" }],
    });
  };

  useEffect(() => {
    const fetchSchoolData = async () => {
      setIsLoading(true);
      const school_id = "b14e03a9-656a-4726-9d38-6f09c912a543";
      try {
        const response = await fetch(
          `/api/manager/profile/school-profile?school_id=${school_id}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        console.log("data", data);
        setSchoolData(data);
        setIsLoading(false);
      } catch (error) {
        console.error("There was a problem fetching school data:", error);
      }
    };

    if (school_id) {
      fetchSchoolData();
    }
  }, [school_id]);

  // Handle form submission
  const handleSubmit = async (values, { setSubmitting }) => {
    setSubmitting(true);
    try {
      // API call to submit form data
      values.school_id = "b14e03a9-656a-4726-9d38-6f09c912a543";
      console.log("values", values);
      const url = "/api/manager/profile/school-profile";
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
      router.push("academic-info");
    } catch (error) {
      console.error("Error submitting form:", error);
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
        <Form>
          <div className="container mx-auto p-6">
            <CompletionPanel percentCompleted={0} title={"0/5"}></CompletionPanel>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">
              Create Your School's Profile
            </h1>

            <div id="details-box"></div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-5">
              <div className="col-span-1">
                <FormSection title={"Upload Your Logo"} />
                <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor="school_details.school_logo"
                    className="flex flex-col items-center justify-center w-full border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                    style={{ height: "11rem" }}
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-10 h-10"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                        />
                      </svg>
                    </div>
                    <label>
                    <input
                      id="school_details.school_logo"
                      type="file"
                      className="hidden"
                    /></label>
                  </label>
                </div>
              </div>
              <div className="col-span-3">
                <FormSection title={"School Details"} />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="space-y-4">
                    <label
                      htmlFor="school_details.name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      School Name
                    </label>
                    <Field
                      name="school_details.name"
                      type="text"
                      placeholder="School Name"
                      className="border-2 w-full p-2 rounded-md"
                    />
                    <ErrorMessage
                      name="school_details.name"
                      component="div"
                      className="text-red-500"
                    />
                  </div>
                  <div className="space-y-4">
                    <label
                      htmlFor="school_details.founded_date"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Founded Date
                    </label>
                    <Field
                      name="school_details.founded_date"
                      type="text"
                      placeholder="Founded Date"
                      className="border-2 w-full p-2 rounded-md"
                    />
                    <ErrorMessage
                      name="school_details.founded_date"
                      component="div"
                      className="text-red-500"
                    />
                  </div>
                  <div className="space-y-4">
                    <label
                      htmlFor="school_details.institution_type"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Institution Type
                    </label>
                    <Field
                      name={`school_details.institution_type`}
                      as="select"
                      className="border-2 w-full p-2"
                    >
                      <option value="University">University</option>
                      <option value="Community College">
                        Community College
                      </option>
                    </Field>
                    <ErrorMessage
                      name="school_details.institution_type"
                      component="div"
                      className="text-red-500"
                    />
                  </div>
                  <div className="space-y-4">
                    <label
                      htmlFor="school_details.tagline"
                      className="block text-sm font-medium text-gray-700"
                    >
                      School Tagline
                    </label>
                    <Field
                      name="school_details.tagline"
                      type="text"
                      placeholder="School Tagline"
                      className="border-2 w-full p-2 rounded-md"
                    />
                    <ErrorMessage
                      name="school_details.tagline"
                      component="div"
                      className="text-red-500"
                    />
                  </div>
                  <div className="space-y-4">
                    <label
                      htmlFor="school_details.affliations"
                      className="block text-sm font-medium text-gray-700"
                    >
                      School Affiliations, Separated by Comma
                    </label>
                    <Field
                      name="school_details.affliations"
                      type="text"
                      placeholder="School Affiliations"
                      className="border-2 w-full p-2 rounded-md"
                    />
                    <ErrorMessage
                      name="school_details.affliations"
                      component="div"
                      className="text-red-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            <FormSection title={"Contact Information"} />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="space-y-4">
                <label
                  htmlFor="school_address.school_street_address"
                  className="block text-sm font-medium text-gray-700"
                >
                  School Street Address
                </label>
                <Field
                  name="school_address.school_street_address"
                  type="text"
                  placeholder="School Street Address"
                  className="border-2 w-full p-2 rounded-md"
                />
                <ErrorMessage
                  name="school_address.school_street_address"
                  component="div"
                  className="text-red-500"
                />
              </div>
              <div className="space-y-4">
                <label
                  htmlFor="school_address.school_state"
                  className="block text-sm font-medium text-gray-700"
                >
                  School State
                </label>
                <Field
                  name="school_address.school_state"
                  type="text"
                  placeholder="School State"
                  className="border-2 w-full p-2 rounded-md"
                />
                <ErrorMessage
                  name="school_address.school_state"
                  component="div"
                  className="text-red-500"
                />
              </div>
              <div className="space-y-4">
                <label
                  htmlFor="school_address.school_zip"
                  className="block text-sm font-medium text-gray-700"
                >
                  School Zip Code
                </label>
                <Field
                  name="school_address.school_zip"
                  type="text"
                  placeholder="School Zip Code"
                  className="border-2 w-full p-2 rounded-md"
                />
                <ErrorMessage
                  name="school_address.school_zip"
                  component="div"
                  className="text-red-500"
                />
              </div>
            </div>

            {/* Contact Information */}
            <FieldArray name="school_address.contact_types">
              {({ insert, remove, push }) => (
                <div>
                  {values.school_address.contact_types.length > 0 &&
                    values.school_address.contact_types.map(
                      (contact, index) => (
                        <div key={index} className="mb-3 space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <label
                                htmlFor={`school_address.contact_types.${index}.type`}
                                className="block text-sm font-medium text-gray-700"
                              >
                                Contact Type
                              </label>
                              <Field
                                name={`school_address.contact_types.${index}.type`}
                                as="select"
                                className="border-2 w-full p-2"
                              >
                                <option value="Admissions">Admissions</option>
                                <option value="Financial Aid">
                                  Financial Aid
                                </option>
                                {/* Add other contact types as needed */}
                              </Field>
                            </div>
                            <div>
                              <label
                                htmlFor={`school_address.contact_types.${index}.phone`}
                                className="block text-sm font-medium text-gray-700"
                              >
                                Phone Number
                              </label>
                              <Field
                                name={`school_address.contact_types.${index}.phone`}
                                placeholder="Phone Number"
                                type="text"
                                className="border-2 w-full p-2"
                              />
                              <ErrorMessage
                                name={`school_address.contact_types.${index}.phone`}
                                component="div"
                                className="text-red-500"
                              />
                            </div>
                            <div>
                              <label
                                htmlFor={`school_address.contact_types.${index}.email`}
                                className="block text-sm font-medium text-gray-700"
                              >
                                Email Address
                              </label>
                              <Field
                                name={`school_address.contact_types.${index}.email`}
                                placeholder="Email Address"
                                type="email"
                                className="border-2 w-full p-2"
                              />
                              <ErrorMessage
                                name={`school_address.contact_types.${index}.email`}
                                component="div"
                                className="text-red-500"
                              />
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <button
                              type="button"
                              className="flex-0 w-[50%] rounded-md bg-gray-200 text-primary px-3 py-1"
                              onClick={() =>
                                push({ type: "", phone: "", email: "" })
                              }
                            >
                              Add Additional
                            </button>
                            {values.school_address.contact_types.length > 1 && (
                              <button
                                type="button"
                                className="flex-1 rounded-md bg-gray-300 text-primary px-3 py-1"
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

            {/* Social Media Information FieldArray */}
            <FieldArray name="school_social_medias">
              {({ insert, remove, push }) => (
                <div>
                  {values.school_social_medias.length > 0 &&
                    values.school_social_medias.map((social, index) => (
                      <div key={index} className="mb-3 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label
                              htmlFor={`school_social_medias.${index}.social_media`}
                              className="block text-sm font-medium text-gray-700"
                            >
                              Social Media Platform
                            </label>
                            <Field
                              name={`school_social_medias.${index}.social_media`}
                              as="select"
                              className="border-2 w-full p-2"
                            >
                              <option value="Facebook">Facebook</option>
                              <option value="Instagram">Instagram</option>
                              {/* Add other platforms as needed */}
                            </Field>
                          </div>
                          <div>
                            <label
                              htmlFor={`school_social_medias.${index}.url`}
                              className="block text-sm font-medium text-gray-700"
                            >
                              URL
                            </label>
                            <Field
                              name={`school_social_medias.${index}.url`}
                              placeholder="URL"
                              type="text"
                              className="border-2 w-full p-2"
                            />
                            <ErrorMessage
                              name={`school_social_medias.${index}.url`}
                              component="div"
                              className="text-red-500"
                            />
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            type="button"
                            className="flex-0 w-[50%] rounded-md bg-gray-200 text-primary px-3 py-1"
                            onClick={() => push({ social_media: "", url: "" })}
                          >
                            Add Additional
                          </button>
                          {values.school_social_medias.length > 1 && (
                            <button
                              type="button"
                              className="flex-1 rounded-md bg-gray-300 text-primary px-3 py-1"
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
          </div>

          <BottomBar
            onBack={handleBack}
            onSaveForLater={handleSaveForLater}
            isBackDisabled={true}
            isSubmitting={isSubmitting}
          />
        </Form>
      )}
    </Formik>
  );
}
