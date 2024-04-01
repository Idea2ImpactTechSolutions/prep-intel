"use client";
import { Dispatch, SetStateAction } from "react";
import { useFormik } from "formik";
import { useAddSchoolManagerMutation } from "@/redux/services/admin/adminApi";
import * as yup from "yup";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface initialState {
  email: string,
  first_name: string,
  last_name: string,
  school_name: string
}

interface PageProps {
  setClaimUrl: Dispatch<SetStateAction<string>>
}

export default function SchoolAdminForm({ setClaimUrl }: PageProps) {
  const [addSchoolManager, { isLoading }] =
    useAddSchoolManagerMutation();

  // CreateSchoolManager Form
  const { values, errors, handleSubmit, handleChange, touched, resetForm } =
    useFormik({
      initialValues: {
        email: "",
        first_name: "",
        last_name: "",
        school_name: "",
      },
      validationSchema: yup.object().shape({
        email: yup.string().email().required("email is required"),
        first_name: yup.string().required("first name is required"),
        last_name: yup.string().required("last name is required"),
        school_name: yup.string().required("school name is required"),
      }),
      // handleCreateSchoolManager
      onSubmit: async (values: initialState) => {
        addSchoolManager(values)
          .unwrap()
          .then((payload) => {
            if (payload.status === 200) {
              const authCode = payload?.data?.[0]?.auth_code;
              const pageUrl = new URL(window.location.href);
              setClaimUrl(
                `${pageUrl.origin}/users/claim?auth_code=${authCode}`
              );

              toast.success(payload.message);
              resetForm();
            }
          });
      },
    });

  return (
    <div className="md:w-[23rem] p-6 bg-gray-100 rounded-md">
      <h1 className="text-xl font-bold">Create School Manager</h1>
      <div className="mt-4">
        <form onSubmit={handleSubmit}>
          <div className="flex gap-3">
            <div>
              <Input
                id=""
                name="first_name"
                value={values.first_name}
                onChange={handleChange}
                touched={touched.first_name}
                error={errors.first_name}
                placeholder="Enter First Name"
              />
            </div>
            <div>
              <Input
                id=""
                name="last_name"
                value={values.last_name}
                onChange={handleChange}
                touched={touched.last_name}
                error={errors.last_name}
                placeholder="Enter Last Name"
              />
            </div>
          </div>
          <div>
            <Input
              id=""
              name="school_name"
              value={values.school_name}
              onChange={handleChange}
              touched={touched.school_name}
              error={errors.school_name}
              placeholder="Enter School Name"
            />
          </div>
          <div className="mt-6">
            <Input
              id=""
              name="email"
              value={values.email}
              onChange={handleChange}
              touched={touched.email}
              error={errors.email}
              placeholder="Enter School Email"
            />
          </div>
          <div className="mt-6 flex justify-end">
            <Button type="submit" loading={isLoading} disabled={isLoading}>
              Create Manager
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
