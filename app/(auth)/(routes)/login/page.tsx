"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";


export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);


  return (
    <div>
      <div className=''>
        <h2 className='font-bold text-2xl text-gray-700 my-5'>Log In</h2>
        <form>
          <div className='grid w-full max-w-sm items-center gap-1.5'>
            <Input type='' id='email' label='Email Address' className='mb-4' />
            <div className='relative w-full'>
              <Input
                type={`${showPassword ? "text" : "password"}`}
                id='password'
                label='Password'
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
            // loading
            // loadingText='Submitting...'
            // disabled
            type='button'
            onClick={() => router.push("/student/onboarding/vitals")}
          >
            Sign In
          </Button>
        </form>
      </div>
    </div>
  );
}
