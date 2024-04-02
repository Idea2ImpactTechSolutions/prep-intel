"use client";
import { Dispatch, SetStateAction } from "react";
import { useFormik } from "formik";
import { useAddSiteAdminMutation } from "@/redux/services/admin/adminApi";
import * as yup from "yup";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface initialState {
  email: string,
  first_name: string,
  last_name: string,
}

interface PageProps {
  setClaimUrl: Dispatch<SetStateAction<string>>
}

export default function SchoolAdminForm({ setClaimUrl }: PageProps) {
  const [addSiteAdmin, { isLoading }] = useAddSiteAdminMutation();

  // CreateSchoolManager Form
  const { values, errors, handleSubmit, handleChange, touched, resetForm } =
    useFormik({
      initialValues: {
        email: "",
        first_name: "",
        last_name: "",
      },
      validationSchema: yup.object().shape({
        email: yup.string().email().required("email is required"),
        first_name: yup.string().required("first name is required"),
        last_name: yup.string().required("last name is required"),
      }),
      // handleCreateSchoolManager
      onSubmit: async (values: initialState) => {
        addSiteAdmin(values)
          .unwrap()
          .then((payload) => {
            if (payload.status === 201) {
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
      <h1 className="text-xl font-bold">Create Site Admin</h1>
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
          <div className="">
            <Input
              id=""
              name="email"
              value={values.email}
              onChange={handleChange}
              touched={touched.email}
              error={errors.email}
              placeholder="Enter Email"
            />
          </div>
          <div className="mt-6 flex justify-end">
            <Button type="submit" loading={isLoading} disabled={isLoading}>
              Create Site Admin
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
