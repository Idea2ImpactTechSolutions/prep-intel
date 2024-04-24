import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCreateRecruiterMutation, useCreateManagerMutation } from "@/redux/services/school/managerApi";
import { Dictionary } from "@/types/dictionary";
import { useFormik } from "formik";
import { X } from "lucide-react";
import { toast } from "sonner";
import * as yup from "yup"

interface CreatePersonnelProps {
    onCancel: () => void;
    onSuccess: (claimUrl:string) => void;
    schoolId: string;
    role: string;
}

export default function CreatePersonnel({ onCancel, onSuccess, schoolId, role }: CreatePersonnelProps) {
    const [createRecruiter, { isLoading: isCreatingRecruiter }] = useCreateRecruiterMutation()
    const [createManager, { isLoading: isCreatingManager }] = useCreateManagerMutation()

    const handleFormSubmit = (values: Dictionary) => {
        const generator = role === "admin" ? createManager : createRecruiter;
        generator(values)
            .unwrap()
            .then((payload) => {
                if (payload?.status === 201) {
                    const authCode = payload?.data?.school?.[0]?.auth_code;
                    const pageUrl = new URL(window.location.href);

                    toast.success(payload?.message)
                    resetForm()
                    onSuccess(`${pageUrl.origin}/users/claim?auth_code=${authCode}`);
                }
            })
    }

    const { values, errors, handleChange, touched, handleSubmit, resetForm } = useFormik({
        initialValues: {
            first_name: "",
            last_name: "",
            email: "",
            school_id: schoolId
        },
        validationSchema: yup.object().shape({
            first_name: yup.string().required('first name is required'),
            last_name: yup.string().required('last name is required'),
            email: yup.string().email("enter a valid email address").required('email name is required'),
            school_id: yup.string().required('first name is required')
        }),
        onSubmit: handleFormSubmit
    })
    return (
        <>
            <div>
                <form onSubmit={handleSubmit}>
                    <div className="flex flex-col md:w-[36rem] p-6 bg-gray-100 rounded-md">
                        <div className="flex-1">
                            <div>
                                <label htmlFor="school_details" className="block mb-2 text-sm font-bold">User Information</label>
                                <div className="grid grid-cols-1 gap-y-2 md:grid-cols-2 md:gap-x-4">
                                    <Input
                                        label="First Name"
                                        labelClass="text-xs font-normal text-[#61646B]"
                                        className="w-full"
                                        name="first_name"
                                        value={values.first_name}
                                        onChange={handleChange}
                                        touched={touched.first_name}
                                        error={errors.first_name}
                                    />
                                    <Input
                                        label="Last Name"
                                        labelClass="text-xs font-normal text-[#61646B]"
                                        className="w-full"
                                        name="last_name"
                                        value={values.last_name}
                                        onChange={handleChange}
                                        touched={touched.last_name}
                                        error={errors.last_name}
                                    />
                                </div>
                                <div className="w-full">
                                    <Input
                                        label="Email Address"
                                        type="email"
                                        labelClass="text-xs font-normal text-[#61646B]"
                                        className="w-full"
                                        name="email"
                                        value={values.email}
                                        onChange={handleChange}
                                        touched={touched.email}
                                        error={errors.email}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="pt-2 flex justify-between items-center">
                        <div className="flex gap-x-4 items-center">
                            <Button
                                variant="outline"
                                className="text-xs h-8 rounded-sm px-3"
                                type="button"
                                onClick={() => {
                                    resetForm();
                                    onCancel();
                                }}
                            ><X className="w-3 h-3 mr-1" /> Discard</Button>
                        </div>
                        <div className="flex gap-x-4 items-center">
                            <Button
                                className="text-xs h-8 rounded-sm px-6"
                                type="submit"
                                loading={isCreatingRecruiter || isCreatingManager}
                                loadingText="Create User"
                                disabled={isCreatingRecruiter || isCreatingManager}
                            >Create User </Button>
                        </div>
                    </div>

                    </div>
                </form>
            </div>
        </>
    )
}
