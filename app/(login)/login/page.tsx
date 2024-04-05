"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup"
import { signIn, useSession } from "next-auth/react";

interface initialValues {
  email: string;
  password: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authCompleted, setAuthCompleted] = useState(false);
  const {data: session}: any = useSession()
  const searchParams = useSearchParams();
  const callbackUrl = searchParams?.get("callbackUrl");

  useEffect(() => {
    // If by chance we load session data, simply redirect to the default role page
    if (session?.user?.role && authCompleted) {
      switch (session.user.role) {
        case 'admin':
          router.push('/admin/school');
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
    <div>
      <div className=''>
        <h2 className='font-bold text-2xl text-gray-700 my-5'>Log In</h2>
        <form onSubmit={handleSubmit}>
          <div className='grid w-full max-w-sm items-center gap-1.5'>
            <Input
              type='email'
              id='email'
              name="email"
              value={values.email}
              onChange={handleChange}
              touched={touched.email}
              error={errors.email}
              label='Email Address' />
            <div className='relative w-full'>
              <Input
                type={`${showPassword ? "text" : "password"}`}
                id='password'
                label='Password'
                name="password"
                value={values.password}
                onChange={handleChange}
                touched={touched.password}
                error={errors.password}
                className=''
              />
              <span
                className='absolute right-2 top-9 cursor-pointer text-gray-500'
                onClick={() => setShowPassword(!showPassword)}
              >
                {!showPassword ? (
                  <EyeIcon className='w-4 h-4' />
                ) : (
                  <EyeOffIcon className='w-4 h-4' />
                )}
              </span>
            </div>
          </div>
          <Link
            href='/forgot-password'
            className='text-primary font-semibold inline-block text-sm my-2'
          >
            Forgot Password?
          </Link>

          <Button
            className='block my-3'
            loading={loading}
            loadingText='Sign In'
            disabled={loading}
            type='submit'
          >
            Sign In
          </Button>
        </form>
      </div>
    </div>
  );
}
