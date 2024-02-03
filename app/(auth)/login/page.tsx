"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, FormEvent} from "react";
import cookie from "js-cookie";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [email, setEmail] = useState('recruiter@x');
  const [password, setPassword] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
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
          setLoginError(data.message);
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
        <form onSubmit={handleSubmit}>
          <div className='grid w-full max-w-sm items-center gap-1.5'>

            <label htmlFor='email' className="block">Email</label>
            <input
                className="border border-gray-300 bg-background px-3 py-2 mb-4"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                id='email'
            />

            <label htmlFor='password' className="block">Password</label>
            <input
              className="border border-gray-300 bg-background px-3 py-2 mb-4"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              id='password'
              type={`${showPassword ? "text" : "password"}`}
            />
            <span
              className='absolute right-2 top-9 cursor-pointer text-gray-500'
              onClick={() => setShowPassword(!showPassword)}
            >
              {/* {!showPassword ? (
                <EyeIcon className='w-4 h-4' />
              ) : (
                <EyeOffIcon className='w-4 h-4' />
              )} */}
            </span>
          </div>
          {/* <Link
            href='/forgot-password'
            className='text-primary font-semibold inline-block text-sm my-2'
          >
            Forgot Password?
          </Link> */}


          <input type="submit" value="Sign In" className='block my-3' />

          {loginError && <p style={{color: 'red'}}>{loginError}</p>}

        </form>
      </div>
    </div>
  );
}
