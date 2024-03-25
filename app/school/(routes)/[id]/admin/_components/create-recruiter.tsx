import CustomSelect from "@/components/custom-select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCreateRecruiterMutation, useLazyGetAllAdminQuery } from "@/redux/services/school/managerApi";
import { Dictionary } from "@/types/dictionary";
import { useFormik } from "formik";
import { ChevronLeft, ChevronRight, Save, X } from "lucide-react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import * as yup from "yup"

interface CreateRecruiterProps {
    setCurrentProgress: (arg: any) => void;
    setAdmin: (arg: any) => void;
}

export default function CreateRecruiter({setCurrentProgress, setAdmin}: CreateRecruiterProps) {
    const { data: userData }: any = useSession()
    const [createRecruiter, { isLoading: isCreatingRecruiter }] = useCreateRecruiterMutation()
    const [getAllAdmin] = useLazyGetAllAdminQuery()

    const handleGetAllAdmin = async (payload) => {
        getAllAdmin(payload)
            .unwrap()
            .then((payload) => {
                setAdmin(payload?.data)
            })
    }

    const handleFormSubmit = async (values: Dictionary) => {
        let payload = { ...values, school_id: userData?.user?.schoolID }
        createRecruiter(payload)
            .unwrap()
            .then((payload) => {
                if (payload?.status === 201) {
                    toast.success(payload?.message)
                    setCurrentProgress("VIEW_ADMIN")
                    handleGetAllAdmin({ school_id: userData?.user?.schoolID })
                }
            })
    }

    const { values, errors, handleChange, touched, handleSubmit, resetForm } = useFormik({
        initialValues: {
            first_name: "",
            last_name: "",
            email: "",
            school_id: userData?.user?.schoolID || ""
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
            <div className="">
                <form onSubmit={handleSubmit}>
                    <div className="p-4 md:px-16 flex flex-col h-[calc(100vh_-_18rem)] overflow-y-scroll">
                        <div className="flex-1">
                            <div>
                                <label htmlFor="school_details" className="block mb-2 text-sm font-bold">User Information</label>
                                <div className="grid grid-cols-1 gap-y-2 md:grid-cols-2 md:gap-x-8">
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
                            <div className="mt-4 hidden">
                                <div className="grid grid-cols-1 gap-y-2 md:grid-cols- md:gap-x-8">
                                    <CustomSelect
                                        label="Role Type"
                                        labelClass="text-xs font-normal text-[#61646B]"
                                        options={[
                                            { label: 'admin', value: 'admin' },
                                            { label: 'recruiter', value: 'recruiter' }
                                        ]}
                                        selected=""
                                        setSelected={() => null}
                                        error={""}
                                    />
                                </div>
                            </div>
                            <div className="mt-4 hidden">
                                <label htmlFor="school_details" className="text-sm font-bold">Temporary Information</label>
                                <div className="grid grid-cols-1 gap-y-2 md:grid-cols-2 md:gap-x-8">
                                    <Input
                                        label="Username"
                                        labelClass="text-xs font-normal text-[#61646B]"
                                        className="w-full"
                                    />
                                    <Input
                                        label="Password"
                                        type="password"
                                        labelClass="text-xs font-normal text-[#61646B]"
                                        className="w-full"
                                    />
                                </div>
                            </div>
                            <div className="mt-4 hidden">
                                <label htmlFor="school_details" className="text-sm font-bold">Invitation</label>
                                <div className="grid grid-cols-2 gap-y-2 md:grid-cols-1 md:gap-y-4">
                                    <Input
                                        label="Invitation Subject"
                                        labelClass="text-xs font-normal text-[#61646B]"
                                        className="w-full placeholder:text-xs placeholder:text-gray-400"
                                        placeholder="Please claim your account with Prep Intel"
                                    />
                                    <Textarea
                                        label="Invitation Message"
                                        labelClass="text-xs font-normal text-[#61646B]"
                                        className="w-full placeholder:text-xs placeholder:text-gray-400"
                                        placeholder="Prep Intel will help us have greater insight into interested students! I have created your account, all you have to do is claim it!"
                                        rows={3}
                                    />
                                </div>
                            </div>
                        </div>

                    </div>
                    <div className="border-t-2 border-t-[#880505] bg-[#F0F4F7] p-4 flex justify-between items-center md:px-16">
                        <div className="flex gap-x-4 items-center">
                            <Button
                                variant="outline"
                                className="text-xs h-8 rounded-sm px-3"
                                type="button"
                                onClick={() => {
                                    resetForm()
                                    setCurrentProgress("VIEW_ADMIN")
                                }}
                            ><X className="w-3 h-3 mr-1" /> Discard</Button>
                        </div>
                        <div className="flex gap-x-4 items-center">
                            <Button
                                className="text-xs h-8 rounded-sm px-6"
                                type="submit"
                                loading={isCreatingRecruiter}
                                loadingText="Create User"
                                disabled={isCreatingRecruiter}
                            >Create User </Button>
                        </div>
                    </div>
                </form>
            </div>
        </>
    )
}
