"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useAddSchoolManagerMutation } from "@/redux/services/admin/adminApi";
import { useAppDispatch } from "@/redux/store";
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
    const dispatch = useAppDispatch()
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
                setClaimUrl(`${pageUrl.origin}/school/claim?auth_code=${authCode}`);

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
        <section>
            <div className={cn(
                      "hidden",
                      isSuccess && "block")}>

                <h3 className="text-xl font-bold">Invite Sent</h3>

                <pre className="max-h-[650px] absolute w-[800px] overflow-x-auto rounded-lg border bg-zinc-500 text-zinc-50 py-4 pl-4">
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

                  { claimUrl }
                  </div>
                </pre>

            </div>

            <div className={cn(isSuccess && "hidden")}>
            <h1 className="text-xl font-bold">School Onboarding</h1>
            <p className="py-3 text-sm">Please fill the form below to get started creating your school profile. </p>
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

        </section>
    )
}