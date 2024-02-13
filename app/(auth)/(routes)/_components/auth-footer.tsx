"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AuthFooter() {
  const pathname = usePathname();

  return (
    <div>
      {pathname === "/login" && (
        <p>
          Is this your first time here?{" "}
          <Link href='/register' className='text-primary font-semibold ml-2'>
            Create Your Account
          </Link>
        </p>
      )}
      {pathname === "/register" && (
        <p>
          Already have an account?{" "}
          <Link href='/login' className='text-primary font-semibold ml-2'>
            Sign In Here
          </Link>
        </p>
      )}
    </div>
  );
}
