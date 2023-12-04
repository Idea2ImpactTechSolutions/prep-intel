// contact_info.client.js
"use client";
import React, { useState, useEffect } from "react";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import * as Yup from "yup";

// Define the validation schema using Yup
const validationSchema = Yup.object().shape({
  school_details: Yup.object().shape({
    school_name: Yup.string().required("School name is required"),
    founded_date: Yup.string().required("Founded date is required"),
    institution_type: Yup.string().required("Institution type is required"),
    school_tagline: Yup.string().required("School tagline is required"),
    school_affliations: Yup.string().required("School affliations is required"),
  }),
  contact_info: Yup.object().shape({
    school_street_address: Yup.string().required(
      "School street address is required"
    ),
    school_state: Yup.string().required("School state is required"),
    school_zip: Yup.string().required("School zip code is required"),

    contact_types: Yup.array().of(
      Yup.object().shape({
        type: Yup.string().required("Contact type is required"),
        phone: Yup.string()
          .required("Phone Number is required")
          .matches(
            /^(?:\(\d{3}\)|\d{3}-)\d{3}-\d{4}$/,
            "Invalid phone number format"
          ),
        email: Yup.string()
          .email("Invalid email address")
          .required("Email is required"),
      })
    ),
  }),
  social_media: Yup.array().of(
    Yup.object().shape({
      platform: Yup.string().required("Social media platform is required"),
      url: Yup.string().url("Invalid URL").required("URL is required"),
    })
  ),
});

export default function contact_info() {
  const [isLoading, setIsLoading] = useState(true);
  const schoolId = "b14e03a9-656a-4726-9d38-6f09c912a543";
  const [initialValues, setInitialValues] = useState({
    school_details: {
      school_name: "",
      founded_date: "",
      institution_type: "",
      school_tagline: "",
      school_affliations: "",
    },

    contact_info: {
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
    social_media: [
      { platform: "Facebook", url: "" },
      { platform: "Instagram", url: "" },
    ],
  });

  // Fetch initial data
  useEffect(() => {
    // Fetch and set initial form values here
    setIsLoading(true);
    // Simulate fetching data
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  // Handle form submission
  const handleSubmit = async (values, { setSubmitting }) => {
    setSubmitting(true);
    try {
      // API call to submit form data
      console.log("Submitted values:", values);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-5xl font-bold text-gray-800 mb-6">
        Create Your School's Profile
      </h1>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, isSubmitting }) => (
          <Form>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="col-span-1">
                <h2 className="text-3xl font-bold text-gray-800 mb-3">
                  Upload Your Logo
                </h2>
                <div>Logo upload box here</div>
              </div>
              <div className="col-span-3">
                <h2 className="text-3xl font-bold text-gray-800 mb-3">
                  School Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="space-y-4">
                    <label
                      htmlFor="school_details.school_name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      School Name
                    </label>
                    <Field
                      name="school_details.school_name"
                      type="text"
                      placeholder="School Name"
                      className="border-2 w-full p-2 rounded-md"
                    />
                    <ErrorMessage
                      name="school_details.school_name"
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
                      name="school_details.institution_type"
                      type="text"
                      placeholder="Institution Type"
                      className="border-2 w-full p-2 rounded-md"
                    />
                    <ErrorMessage
                      name="school_details.institution_type"
                      component="div"
                      className="text-red-500"
                    />
                  </div>
                  <div className="space-y-4">
                    <label
                      htmlFor="school_details.school_tagline"
                      className="block text-sm font-medium text-gray-700"
                    >
                      School Tagline
                    </label>
                    <Field
                      name="school_details.school_tagline"
                      type="text"
                      placeholder="School Tagline"
                      className="border-2 w-full p-2 rounded-md"
                    />
                    <ErrorMessage
                      name="school_details.school_tagline"
                      component="div"
                      className="text-red-500"
                    />
                  </div>
                  <div className="space-y-4">
                    <label
                      htmlFor="school_details.school_affliations"
                      className="block text-sm font-medium text-gray-700"
                    >
                      School Affiliations, Separated by Comma
                    </label>
                    <Field
                      name="school_details.school_affliations"
                      type="text"
                      placeholder="School Affiliations"
                      className="border-2 w-full p-2 rounded-md"
                    />
                    <ErrorMessage
                      name="school_details.school_affliations"
                      component="div"
                      className="text-red-500"
                    />
                  </div>
                </div>
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-3">
              Contact Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="space-y-4">
                <label
                  htmlFor="contact_info.school_street_address"
                  className="block text-sm font-medium text-gray-700"
                >
                  School Street Address
                </label>
                <Field
                  name="contact_info.school_street_address"
                  type="text"
                  placeholder="School Street Address"
                  className="border-2 w-full p-2 rounded-md"
                />
                <ErrorMessage
                  name="contact_info.school_street_address"
                  component="div"
                  className="text-red-500"
                />
              </div>
              <div className="space-y-4">
                <label
                  htmlFor="contact_info.school_state"
                  className="block text-sm font-medium text-gray-700"
                >
                  School State
                </label>
                <Field
                  name="contact_info.school_state"
                  type="text"
                  placeholder="School State"
                  className="border-2 w-full p-2 rounded-md"
                />
                <ErrorMessage
                  name="contact_info.school_state"
                  component="div"
                  className="text-red-500"
                />
              </div>
              <div className="space-y-4">
                <label
                  htmlFor="contact_info.school_zip"
                  className="block text-sm font-medium text-gray-700"
                >
                  School Zip Code
                </label>
                <Field
                  name="contact_info.school_zip"
                  type="text"
                  placeholder="School Zip Code"
                  className="border-2 w-full p-2 rounded-md"
                />
                <ErrorMessage
                  name="contact_info.school_zip"
                  component="div"
                  className="text-red-500"
                />
              </div>
            </div>

            {/* Contact Information */}
            <FieldArray name="contact_info.contact_types">
              {({ insert, remove, push }) => (
                <div>
                  {values.contact_info.contact_types.length > 0 &&
                    values.contact_info.contact_types.map((contact, index) => (
                      <div key={index} className="mb-3 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label
                              htmlFor={`contact_info.contact_types.${index}.type`}
                              className="block text-sm font-medium text-gray-700"
                            >
                              Contact Type
                            </label>
                            <Field
                              name={`contact_info.contact_types.${index}.type`}
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
                              htmlFor={`contact_info.contact_types.${index}.phone`}
                              className="block text-sm font-medium text-gray-700"
                            >
                              Phone Number
                            </label>
                            <Field
                              name={`contact_info.contact_types.${index}.phone`}
                              placeholder="Phone Number"
                              type="text"
                              className="border-2 w-full p-2"
                            />
                            <ErrorMessage
                              name={`contact_info.contact_types.${index}.phone`}
                              component="div"
                              className="text-red-500"
                            />
                          </div>
                          <div>
                            <label
                              htmlFor={`contact_info.contact_types.${index}.email`}
                              className="block text-sm font-medium text-gray-700"
                            >
                              Email Address
                            </label>
                            <Field
                              name={`contact_info.contact_types.${index}.email`}
                              placeholder="Email Address"
                              type="email"
                              className="border-2 w-full p-2"
                            />
                            <ErrorMessage
                              name={`contact_info.contact_types.${index}.email`}
                              component="div"
                              className="text-red-500"
                            />
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <button
                            type="button"
                            className="flex-1 rounded-md bg-green-500 text-white px-3 py-1"
                            onClick={() =>
                              push({ type: "", phone: "", email: "" })
                            }
                          >
                            Add Additional
                          </button>
                          {values.contact_info.contact_types.length > 1 && (
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

            {/* Social Media Information FieldArray */}
            <FieldArray name="social_media">
              {({ insert, remove, push }) => (
                <div>
                  {values.social_media.length > 0 &&
                    values.social_media.map((social, index) => (
                      <div key={index} className="mb-3 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label
                              htmlFor={`social_media.${index}.platform`}
                              className="block text-sm font-medium text-gray-700"
                            >
                              Social Media Platform
                            </label>
                            <Field
                              name={`social_media.${index}.platform`}
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
                              htmlFor={`social_media.${index}.url`}
                              className="block text-sm font-medium text-gray-700"
                            >
                              URL
                            </label>
                            <Field
                              name={`social_media.${index}.url`}
                              placeholder="URL"
                              type="text"
                              className="border-2 w-full p-2"
                            />
                            <ErrorMessage
                              name={`social_media.${index}.url`}
                              component="div"
                              className="text-red-500"
                            />
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            type="button"
                            className="flex-1 rounded-md bg-green-500 text-white px-3 py-1"
                            onClick={() => push({ platform: "", url: "" })}
                          >
                            Add Additional
                          </button>
                          {values.social_media.length > 1 && (
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

            {/* Submit Button */}
            <button
              type="submit"
              className="rounded-md bg-blue-500 text-white px-4 py-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Please wait..." : "Submit"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
