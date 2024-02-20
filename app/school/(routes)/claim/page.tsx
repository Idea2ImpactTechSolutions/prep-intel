"use client"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { setManagerInfo } from "@/redux/features/school/managerSlice";
import { useSchoolManagerClaimAccountMutation } from "@/redux/services/school/managerApi";
import { useAppDispatch } from "@/redux/store";
import { useFormik } from "formik";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import * as yup from "yup";

const SERVICES = [
    {
        id: crypto.randomUUID().toString(),
        text: "Greater Transparency into Your Student Funnel"
    },
    {
        id: crypto.randomUUID().toString(),
        text: "Reports and Trends with Your School"
    },
    {
        id: crypto.randomUUID().toString(),
        text: "Increase Your Outreach to Prospects"
    },
]

interface initialValue {
    email: string
}

export default function Page() {
    const [schoolManagerClaimAccount, {isLoading}] = useSchoolManagerClaimAccountMutation()
    const router = useRouter()
    const searchParam = useSearchParams()
    const dispatch = useAppDispatch()

    const handleSubmitForm = async (values: initialValue) => {
        const auth_code = searchParam?.get('auth_code')
        const payload = {...values, auth_code}
        schoolManagerClaimAccount(payload)
        .unwrap()
        .then((payload)=>{
            if (payload.status === 200) {
                let claim_info = {school_email: values.email}
                dispatch(setManagerInfo({slug: 'claim_info', data: claim_info}))
                toast.success(payload.message)
                router.push('/school/set-password')
            }
        })
    }

    const {values, errors, handleChange, handleSubmit, touched} = useFormik({
        initialValues: {
            email: ''
        },
        validationSchema: yup.object().shape({
            email: yup.string().email().required('enter your school email address')
        }),
        onSubmit: handleSubmitForm
    })

    return (
        <main className="font-sans">
            <div className="bg-[#F0F4F7] p-6 mt-20 m-6 rounded-[6px] sm:max-w-[28rem] sm:mx-auto">
                <div className="pt-2 flex flex-col items-center justify-center text-center">
                    <Image
                        src="/images/logo/text-logo.png"
                        width={150}
                        height={150}
                        alt="logo"
                        className="md:hidden"
                    />
                    <Image
                        src="/images/logo/text-logo.png"
                        width={180}
                        height={180}
                        alt="logo"
                        className="hidden md:block"
                    />
                    <h2 className="font-bold text-2xl py-3">Welcome to Prep Intel!</h2>
                    <p className="text-sm font-medium">By joining Prep Intel, you will gain access to:</p>
                </div>
                <div className="mt-2 flex flex-col gap-y-1">
                    {
                        SERVICES.map(({ id, text }) => (
                            <p
                                key={id}
                                className="p-1.5 bg-[#DCE1E5] rounded-full font-light text-[13px] text-center"
                            >
                                {text}
                            </p>

                        ))
                    }
                </div>
                <div className="mt-4">
                    <form onSubmit={handleSubmit}>
                        <Input
                            label="School Email Address"
                            name="email"
                            value={values.email}
                            onChange={handleChange}
                            touched={touched.email}
                            error={errors.email}
                            placeholder="Enter email address"
                            className="w-full placeholder:text-gray-300 placeholder:font-light"
                        />
                        <div className="mt-4 flex justify-center">
                            <Button
                                className="font-light h-9"
                                type="submit"
                                loading={isLoading}
                                loadingText="Claim My Account"
                                disabled={isLoading}
                            >Claim My Account</Button>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    )
}
