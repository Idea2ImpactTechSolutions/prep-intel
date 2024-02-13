"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import cookie from "js-cookie";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  function handleLogin(e) {
    e.preventDefault();
    const form = document.querySelector("form");
    const email = form.elements['email'].value;
    const password = form.elements['password'].value;
  
    //call api
    fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    })
      .then((r) => {
        return r.json();
      })
      .then((data) => {
        if (data && data.error) {
          //setLoginError(data.message);
        }
        if (data && data.token) {
          //set cookie
          cookie.set('token', data.token, {expires: 2});
          cookie.set('role', data.role, {expires: 2});
  
          switch(data.role) {
            case 'admin':
              router.push('/manager/profile/welcome');
              break;
            case 'recruiter':
              router.push('/recruiter/profile/welcome')
              break;
            case 'student':
              router.push('/student/explore')
              break;
          }
        }
      });
  }
  
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
            onClick={handleLogin}
          >
            Sign In
          </Button>
        </form>
      </div>
    </div>
  );
}
