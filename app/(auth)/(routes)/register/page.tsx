"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Circle, EyeIcon, EyeOffIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter()

  return (
    <div>
      <div className=''>
        <h2 className='font-bold text-2xl text-gray-700 my-3'>
          Create Your Account
        </h2>
        <form>
          <div className='grid w-full max-w-sm items-center gap-1.5'>
            <Input
              type='email'
              id='email'
              label='Email Address'
              className='mb-4'
            />
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
            <div className='bg-accent p-4 mb-3'>
              <h3 className='font-medium text-sm text-primary'>
                Password Must Contain:
              </h3>
              <span className='flex items-center text-primary font-medium'>
                <Circle className='w-3 h-3 text-primary' />
                <span className='text-sm pl-1'>Requirement One</span>
              </span>
              <span className='flex items-center text-primary font-medium'>
                <Circle className='w-3 h-3  ' />
                <span className='text-sm pl-1'>Requirement Two</span>
              </span>
            </div>

            <Input
              type={`${showPassword ? "text" : "password"}`}
              id='confirm_password'
              label='Confirm Password'
            />
          </div>

          <Button
            className='block my-8'
            variant='default'
            type="button"
            // loading
            // loadingText='Submitting...'
            // disabled
            onClick={() => router.push('/student/onboarding/vitals')}
          >
            Create Account
          </Button>
        </form>
      </div>
    </div>
  );
}
