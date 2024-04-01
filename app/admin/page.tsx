"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useAddSchoolManagerMutation } from "@/redux/services/admin/adminApi";
import { useFormik } from "formik";
import { useState } from "react";
import { toast } from "sonner";
import * as yup from "yup";
import { LuCopy } from "react-icons/lu";
import { LuCopyCheck } from "react-icons/lu";
import copy from 'copy-to-clipboard';

interface initialState {
    email: string,
    first_name: string,
    last_name: string,
    school_name: string
}

export default function SchoolAdminRegisterPage() {
    const [addSchoolManager, {isLoading, isSuccess}] = useAddSchoolManagerMutation()
    const [isCopied, setIsCopied] = useState(false)
    const [claimUrl, setClaimUrl] = useState("")

    function copyToClipboard() {
      copy(claimUrl);
      setIsCopied(true);
    }

    const handleFormSubmit = async (values: initialState) => {
        addSchoolManager(values)
        .unwrap()
        .then((payload) => {
            if (payload.status === 200) {
                const authCode = payload?.data?.[0]?.auth_code;
                const pageUrl = new URL(window.location.href);
                setClaimUrl(`${pageUrl.origin}/users/claim?auth_code=${authCode}`);

                toast.success(payload.message)
                resetForm()
            }
            // console.log(payload)
        })
    }

    const { values, errors, handleSubmit, handleChange, touched, resetForm } = useFormik({
        initialValues: {
            email: '',
            first_name: '',
            last_name: '',
            school_name: ''
        },
        validationSchema: yup.object().shape({
            email: yup.string().email().required('email is required'),
            first_name: yup.string().required('first name is required'),
            last_name: yup.string().required('last name is required'),
            school_name: yup.string().required('school name is required')
        }),
        onSubmit: handleFormSubmit
    })

    return (
    <div className="container p-0 pt-6">
        <h1 className="text-2xl font-bold mb-4">Site Admin</h1>
        <div className="flex w-full rows p-0 mt-2 self-center">
            <div className="md:w-[23rem] p-6 bg-gray-100 rounded-md">
                <h1 className="text-xl font-bold">School Setup</h1>
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
                        <div className="mt-6">
                            <Button
                                type="submit"
                                loading={isLoading}
                                disabled={isLoading}
                            >Send Invite</Button>
                        </div>
                    </form>
                </div>
            </div>

            <div className={cn(
                      "hidden",
                      "ml-10 p-6",
                      isSuccess && "block")}>
                <h3 className="text-xl font-bold">Invite Sent</h3>

                <pre className="max-h-[650px] absolute w-[800px] overflow-x-auto rounded-lg border bg-zinc-400 text-zinc-50 py-4 pl-4">
                  <div className="relative flex items-center rounded px-[0.2rem]  font-mono text-sm">

                  <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 absolute right-4 top-0 z-10 h-6 w-6 text-zinc-50 hover:bg-zinc-700 hover:text-zinc-50 ">

                    <LuCopy className={cn(
                      "block",
                      isCopied && "hidden",
                      "cursor-pointer")}
                        onClick={copyToClipboard}  />

                    <LuCopyCheck
                        className={cn(
                          !isCopied && "hidden",
                          isCopied && "block")} />
                  </button>

                  <a className="underline" href={ claimUrl }>{claimUrl}</a>
                  </div>
                </pre>

            </div>
        </div>

        <h1 className="text-2xl font-bold mb-4">Site Admin</h1>

    </div>
    )
}