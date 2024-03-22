import CustomSelect from "@/components/custom-select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useCreateRecruiterMutation, useLazyGetAllAdminQuery } from "@/redux/services/school/managerApi";
import { Dictionary } from "@/types/dictionary";
import copy from "copy-to-clipboard";
import { useFormik } from "formik";
import { ArrowLeft, ChevronLeft, ChevronRight, Save, X } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { LuCopy, LuCopyCheck } from "react-icons/lu";
import { toast } from "sonner";
import * as yup from "yup"

interface CreateRecruiterProps {
    setCurrentProgress: (arg: any) => void;
    setAdmin: (arg: any) => void;
}

export default function CreateRecruiter({ setCurrentProgress, setAdmin }: CreateRecruiterProps) {
    const { data: userData }: any = useSession()
    const [createRecruiter, { isLoading: isCreatingRecruiter, isSuccess }] = useCreateRecruiterMutation()
    const [getAllAdmin] = useLazyGetAllAdminQuery()
    const [isCopied, setIsCopied] = useState(false)
    const [claimUrl, setClaimUrl] = useState("")

    function copyToClipboard() {
        copy(claimUrl);
        setIsCopied(true);
    }

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
                    const authCode = payload?.data?.school?.[0]?.auth_code;
                    const pageUrl = new URL(window.location.href);
                    setClaimUrl(`${pageUrl.origin}/users/claim?auth_code=${authCode}`);

                    toast.success(payload?.message)
                    // setCurrentProgress("VIEW_ADMIN")
                    // handleGetAllAdmin({ school_id: userData?.user?.schoolID })
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
            <div className={cn(
                "hidden",
                isSuccess && "block p-4 lg:px-16")}>

                <h3 className="text-xl font-bold">Invite Sent</h3>
                <div className="pb-28">
                    <pre className="max-h-[650px] absolute w-[800px] overflow-x-auto rounded-lg border bg-zinc-500 text-zinc-50 py-4 pl-4">
                        <div className="relative flex items-center rounded px-[0.2rem]  font-mono text-sm">

                            <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 absolute right-4 top-0 z-10 h-6 w-6 text-zinc-50 hover:bg-zinc-700 hover:text-zinc-50 ">

                                <LuCopy className={cn(
                                    "block",
                                    isCopied && "hidden",
                                    "cursor-pointer")}
                                    onClick={copyToClipboard} />

                                <LuCopyCheck

                                    className={cn(
                                        !isCopied && "hidden",
                                        isCopied && "block")} />
                            </button>

                            {claimUrl}
                        </div>
                    </pre>
                </div>

                <Button
                    variant="outline"
                    className="text-xs h-8 rounded-sm px-8"
                    type="button"
                    onClick={() => {
                        handleGetAllAdmin({ school_id: userData?.user?.schoolID })
                        resetForm()
                        setCurrentProgress("VIEW_ADMIN")
                    }}
                ><ArrowLeft  className="w-3 h-3 mr-1" /> Go back</Button>
            </div>

            <div className={cn(
                isSuccess && "hidden"
            )}>
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
                                    handleGetAllAdmin({ school_id: userData?.user?.schoolID })
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
