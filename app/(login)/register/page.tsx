"use client"
import CheckPassed from "@/components/check-passed";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useRegisterMutation } from "@/redux/services/auth/authApi";
import { containSpecialChar } from "@/utils/helpers/containSpecialChar";
import { useFormik } from "formik";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { Space_Grotesk } from "next/font/google";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import * as yup from "yup"
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"] });

const SPECIAL_CHARS = ['#', '@', '/']

export default function RegisterPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("")
    const [register, {isLoading}] = useRegisterMutation()

    const router = useRouter()

    const handleSubmitForm = async (values) => {
        setError("")
        register(values)
        .unwrap()
        .then((payload) => {
            toast.success('Account Created Successfully')
            router.push('/login')
        })
        .catch((error) => {
            if (error.data) {
                setError(error.data.message)
            }
        })
    }

    const {values, errors, handleSubmit, touched, handleChange} = useFormik({
        initialValues: {
            email: '',
            password: '',
            confirm_password: ''
        },
        validationSchema: yup.object().shape({
            email: yup.string().email('Invalid email').required('Email is required'),
            password: yup.string().min(8, 'Password must be 8 of Character').required('Password is required'),
            confirm_password: yup.string().oneOf([yup.ref('password'), undefined], 'Passwords must match').required('Password confirmation is required'),
        }),
        onSubmit: handleSubmitForm
    })

    return (
        <>
            <div className="mt-8">
                <h2 className={cn(
                    spaceGrotesk.className,
                    'text-[#141111] text-2xl font-bold md:text-3xl lg:text-4xl xl:text-5xl xl:leading-[3.2rem]'
                )}>Find your dream Institution in Seconds</h2>
                <p className="text-[#695959] text-xs md:text-sm md:mt-2">Enter your email address and password to find matches.</p>
            </div>
            <div className="mt-5 lg:mt-10">
                <form onSubmit={handleSubmit}>
                    <div>
                        <Input
                            label="E-mail"
                            labelClass="!font-black"
                            className={cn('rounded-lg p-[1.4rem] placeholder:text-[#AAAAAA]')}
                            placeholder="Enter your e-mail"
                            name="email"
                            value={values.email}
                            onChange={handleChange}
                            touched={touched.email}
                            error={errors.email}
                        />
                    </div>
                    <div className='relative w-full'>
                        <Input
                            label='Password'
                            labelClass="!font-black"
                            type={`${showPassword ? "text" : "password"}`}
                            id='password'
                            className={cn('rounded-lg p-[1.4rem] placeholder:text-[#AAAAAA]')}
                            placeholder="********"
                            name="password"
                            value={values.password}
                            onChange={handleChange}
                            touched={touched.password}
                            error={errors.password}
                        />
                        <span
                            className='absolute right-4 top-9 cursor-pointer text-gray-500'
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {!showPassword ? (
                                <EyeIcon className='w-4 h-4 text-[#AAAAAA]' />
                            ) : (
                                <EyeOffIcon className='w-4 h-4 text-[#AAAAAA]' />
                            )}
                        </span>
                    </div>
                    <div className='my-3 flex flex-col gap-y-1'>
                        <span className='flex items-center text-[#757575]'>
                            <CheckPassed checked={values.password.length > 7 }/>
                            <span className='text-[.7rem] pl-1'>Password must be 8 of Character</span>
                        </span>
                        <span className='flex items-center text-[#757575]'>
                            <CheckPassed checked={containSpecialChar(values.password, SPECIAL_CHARS) === true ? true : false }/>
                            <span className='text-[.7rem] pl-1'>The password must have a unique character (# @ /)</span>
                        </span>
                    </div>
                    <div className='relative w-full'>
                        <Input
                            label='Confirm Password'
                            labelClass="!font-black"
                            type={`${showPassword ? "text" : "password"}`}
                            id='confirm_password'
                            className={cn('rounded-lg p-[1.4rem] placeholder:text-[#AAAAAA]')}
                            placeholder="Enter yourn password"
                            name="confirm_password"
                            value={values.confirm_password}
                            onChange={handleChange}
                            touched={touched.confirm_password}
                            error={errors.confirm_password}
                        />
                        <span
                            className='absolute right-4 top-9 cursor-pointer text-gray-500'
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {!showPassword ? (
                                <EyeIcon className='w-4 h-4 text-[#AAAAAA]' />
                            ) : (
                                <EyeOffIcon className='w-4 h-4 text-[#AAAAAA]' />
                            )}
                        </span>
                    </div>
                    <div className="text-red-500 text-sm">{error}</div>
                    <div className="mt-5">
                        <Button
                            className="primary-bg rounded-lg w-full p-[1.5rem]"
                            type="submit"
                            loading={isLoading}
                            disabled={isLoading || !containSpecialChar(values.password, SPECIAL_CHARS)}
                            loadingText="Create Account"
                        >Create Account</Button>
                    </div>
                    <div className="text-center mt-2">
                        <span className="text-xs text-[#695959]">By signing up, you can confirm our <span className="text-sm">Terms of Use and Privacy Policy</span></span>
                        <span className="mt-4 block text-xs text-[#695959]">Do you already have an account? <Link href="/login" className="text-primary text-sm">Sign in Here</Link></span>
                    </div>
                </form>
            </div>
        </>
    )
}