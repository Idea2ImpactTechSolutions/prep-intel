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

interface initialState {
    email: string,
    first_name: string,
    last_name: string,
    school_name: string
}

export default function SchoolAdminRegisterPage() {

    const dispatch = useAppDispatch()
    const [addSchoolManager, {isLoading, isSuccess}] = useAddSchoolManagerMutation()
    const [authCode, setAuthCode] = useState("")

    const handleFormSubmit = async (values: initialState) => {
        addSchoolManager(values)
        .unwrap()
        .then((payload) => {
            if (payload.status === 200) {
                setAuthCode(payload?.data?.[0]?.auth_code)
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
                            loadingText="Create School"
                            disabled={isLoading}
                        >Create School</Button>
                    </div>
                   <div className={cn(
                    "hidden",
                    authCode && "block"
                   )}>
                    <p className="mt-4 text-blue-600 text-sm">{process?.env?.NEXT_PUBLIC_BASE_URL}/school/claim?auth_code={authCode}
                    </p>

                    <span className="text-sm mt-3">Use this link to claim account</span>
                   </div>
                </form>
            </div>
        </section>
    )
}