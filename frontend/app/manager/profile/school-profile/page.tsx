// ContactInfo.client.js
"use client";
import React, { useState, useEffect } from "react";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import * as Yup from "yup";

// Define the validation schema using Yup
const validationSchema = Yup.object().shape({
  contactInfo: Yup.array().of(
    Yup.object().shape({
      type: Yup.string().required("Contact type is required"),
      phone: Yup.string().matches(
        /^(?:\(\d{3}\)|\d{3}-)\d{3}-\d{4}$/,
        "Invalid phone number format"
      ),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
    })
  ),
  socialMedia: Yup.array().of(
    Yup.object().shape({
      platform: Yup.string().required("Social media platform is required"),
      url: Yup.string().url("Invalid URL").required("URL is required"),
    })
  ),
});

export default function ContactInfo() {
  const [isLoading, setIsLoading] = useState(false);

  // Initial values for form fields
  const initialValues = {
    contactInfo: [
      { type: "Admissions", phone: "", email: "" },
      { type: "Financial Aid", phone: "", email: "" },
    ],
    socialMedia: [
      { platform: "Facebook", url: "" },
      { platform: "Instagram", url: "" },
    ],
  };

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
            {/* Contact Information */}
            <FieldArray name="contactInfo">
              {({ insert, remove, push }) => (
                <div>
                  {values.contactInfo.length > 0 &&
                    values.contactInfo.map((contact, index) => (
                      <div key={index} className="mb-3 space-y-4">
                        <label
                          htmlFor={`contactInfo.${index}.type`}
                          className="block text-sm font-medium text-gray-700"
                        >
                          Contact Type
                        </label>
                        <Field
                          name={`contactInfo.${index}.type`}
                          as="select"
                          className="border-2 w-full p-2"
                        >
                          <option value="Admissions">Admissions</option>
                          <option value="Financial Aid">Financial Aid</option>
                          {/* Add other contact types as needed */}
                        </Field>
                        <label
                          htmlFor={`contactInfo.${index}.phone`}
                          className="block text-sm font-medium text-gray-700"
                        >
                          Phone Number
                        </label>
                        <Field
                          name={`contactInfo.${index}.phone`}
                          placeholder="Phone Number"
                          type="text"
                          className="border-2 w-full p-2"
                        />
                        <ErrorMessage
                          name={`contactInfo.${index}.phone`}
                          component="div"
                          className="text-red-500"
                        />
                        <label
                          htmlFor={`contactInfo.${index}.email`}
                          className="block text-sm font-medium text-gray-700"
                        >
                          Email Address
                        </label>
                        <Field
                          name={`contactInfo.${index}.email`}
                          placeholder="Email Address"
                          type="email"
                          className="border-2 w-full p-2"
                        />
                        <ErrorMessage
                          name={`contactInfo.${index}.email`}
                          component="div"
                          className="text-red-500"
                        />
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
                          {values.contactInfo.length > 1 && (
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
            <FieldArray name="socialMedia">
              {({ insert, remove, push }) => (
                <div>
                  {values.socialMedia.length > 0 &&
                    values.socialMedia.map((social, index) => (
                      <div key={index} className="mb-3 space-y-4">
                        <label
                          htmlFor={`socialMedia.${index}.platform`}
                          className="block text-sm font-medium text-gray-700"
                        >
                          Social Media Platform
                        </label>
                        <Field
                          name={`socialMedia.${index}.platform`}
                          as="select"
                          className="border-2 w-full p-2"
                        >
                          <option value="Facebook">Facebook</option>
                          <option value="Instagram">Instagram</option>
                          {/* Add other platforms as needed */}
                        </Field>
                        <label
                          htmlFor={`socialMedia.${index}.url`}
                          className="block text-sm font-medium text-gray-700"
                        >
                          URL
                        </label>
                        <Field
                          name={`socialMedia.${index}.url`}
                          placeholder="URL"
                          type="text"
                          className="border-2 w-full p-2"
                        />
                        <ErrorMessage
                          name={`socialMedia.${index}.url`}
                          component="div"
                          className="text-red-500"
                        />
                        <div className="flex items-center space-x-2">
                          <button
                            type="button"
                            className="flex-1 rounded-md bg-green-500 text-white px-3 py-1"
                            onClick={() => push({ platform: "", url: "" })}
                          >
                            Add Additional
                          </button>
                          {values.socialMedia.length > 1 && (
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
