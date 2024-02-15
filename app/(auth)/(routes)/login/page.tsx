"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import cookie from "js-cookie";
import { useFormik } from "formik";
import * as yup from "yup"
import { useLoginMutation } from "@/redux/services/auth/authApi";
import { useAppSelector } from "@/redux/store";
import { Dictionary } from "@/types/dictionary";

interface initialValues {
  email: string;
  password: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const { user }: { user: any } = useAppSelector((state) => state.auth)

  const [login, { isLoading, isSuccess }] = useLoginMutation()

  const handleRedirect = (role: string) => {
    switch (role) {
      case 'admin':
        router.push('/school/welcome');
        break;
      case 'recruiter':
        router.push('/recruiter/profile/welcome')
        break;
      case 'student':
        router.push('/student/explore')
        break;
    }
  }

  // handle login request
  const handleLogin = async (values: initialValues) => {
    login(values)
      .unwrap()
      .then((payload: Dictionary) => {
        if (payload && payload.token) {
          handleRedirect(payload.role)
        }
      })
  }

  // handle input change
  const { values, errors, handleSubmit, handleChange, touched, resetForm } = useFormik({
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

  useEffect(() => {
    const token = cookie.get('token') || null
    if (token && user?.token) {
      handleRedirect(user.role)
    }
  }, [])

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
            loading={isLoading}
            loadingText='Sign In'
            disabled={isLoading}
            type='submit'
          >
            Sign In
          </Button>
        </form>
      </div>
    </div>
  );
}
