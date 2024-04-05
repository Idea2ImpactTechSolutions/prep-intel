"use client"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { Space_Grotesk } from "next/font/google";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup"
import { signIn, useSession } from "next-auth/react";
import ForgotPasswordPanel from './forgot-password';
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"] });

interface initialValues {
  email: string;
  password: string;
}

export default function LoginPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [forgotPassword, setForgotPassword] = useState(false);
    const [authCompleted, setAuthCompleted] = useState(false);
    const {data: session}: any = useSession()
    const searchParams = useSearchParams();
    const callbackUrl = searchParams?.get("callbackUrl");

    useEffect(() => {
        // If by chance we load session data, simply redirect to the default role page
        if (session?.user?.role && authCompleted) {
          switch (session.user.role) {
            case 'admin':
              router.push('/admin');
              break;
            case 'manager':
              let schoolId = session.user.schoolID;
              router.push(`school/${schoolId}/dashboard`);
              break;
            case 'recruiter':
              router.push('/recruiter/dashboard')
              break;
            case 'student':
              router.push('/student/explore')
              break;
          }
        }
      }, [session, authCompleted]);

      // handle login request
      const handleLogin = async (values: initialValues) => {
        try {
          setLoading(true)
          const res: any  = await signIn("credentials", {
            email: values.email,
            password: values.password,
            redirect: false
          });

          if (res?.status == 200) {
            if (callbackUrl) {
              setLoading(false);

              // Without some delay, router.push calls below fail, possibly due to session
              // or jwt not being ready
              window.setTimeout(function(){
                const url = new URL(callbackUrl);
                router.push(url.pathname);
              }, 1000);
            }
            else
            {
              // Trigger rerender, and session loaded consideration
              setAuthCompleted(true);
            }
          } else {
              setLoading(false)
              // TODO: What effect does throwing have here?
              throw new Error(res?.error)
          }
        } catch (error) {
          setLoading(false)
        }
      };

      // handle input change
      const { values, errors, handleSubmit, handleChange, touched } = useFormik({
        initialValues: {
          email: "",
          password: ""
        },
        validationSchema: yup.object().shape({
          email: yup.string().email().required('email field is required'),
          password: yup.string().required('password field is required')
        }),
        onSubmit: handleLogin
      })

    return (
        <section className="mt-32">
            <div className="mt-8">
                <h2 className={cn(
                    spaceGrotesk.className,
                    'text-[#141111] text-2xl font-bold md:text-3xl lg:text-4xl xl:text-5xl xl:leading-[3.2rem]'
                )}>Welcome Back!</h2>
                <p className="text-[#695959] text-xs md:text-sm md:mt-2">Enter your email address and password to join us.</p>
            </div>
            <div className="mt-5 lg:mt-10">
            <>
                {forgotPassword && (
                    <ForgotPasswordPanel
                        setForgotPassword={setForgotPassword}
                    />
                )}

                {!forgotPassword && (
                <form onSubmit={handleSubmit}>
                    <div>
                        <Input
                            label="E-mail"
                            labelClass="!font-black"
                            type='email'
                            id='email'
                            name="email"
                            value={values.email}
                            onChange={handleChange}
                            touched={touched.email}
                            error={errors.email}
                            className={cn('rounded-lg p-[1.4rem] placeholder:text-[#AAAAAA]')}
                            placeholder="Enter your e-mail"
                        />
                    </div>
                    <div className='relative w-full'>
                        <Input
                            label='Password'
                            labelClass="!font-black"
                            type={`${showPassword ? "text" : "password"}`}
                            id='password'
                            name="password"
                            value={values.password}
                            onChange={handleChange}
                            touched={touched.password}
                            error={errors.password}
                            className={cn('rounded-lg p-[1.4rem] placeholder:text-[#AAAAAA]')}
                            placeholder="Enter your password."
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
                    <div className="mt-5">
                        <Link
                            href='#'
                            onClick={() => setForgotPassword(true)}
                            className='text-primary font-semibold inline-block text-sm my-2'
                        >
                            Forgot Password?
                        </Link>
                        <Button
                            className="primary-bg rounded-lg w-full p-[1.5rem]"
                            loading={loading}
                            loadingText='Sign In'
                            disabled={loading}
                            type='submit'
                        >Sign In</Button>
                    </div>
                    <div className="text-center mt-2">
                        <span className="text-xs text-[#695959]">By signing up, you can confirm our <span className="text-sm">Terms of Use and Privacy Policy</span></span>
                        <span className="mt-4 block text-xs text-[#695959]">Do you already have an account? <Link href="/register" className="text-primary text-sm">Create Your Account</Link></span>
                    </div>
                </form>
                )}
            </>
            </div>
        </section>
    );
}
