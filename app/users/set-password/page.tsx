"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Circle, EyeIcon, EyeOffIcon } from "lucide-react";
import { useFormik } from "formik";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import * as yup from "yup";
import { useAppSelector } from "@/redux/store";
import { Dictionary } from "@/types/dictionary";
import { useSession } from "next-auth/react";
import { useSetPasswordMutation } from "@/redux/services/user/userApi";

interface initialValue {
  password: string;
  confirm_password: string;
  // email: string;
}

export default function UserSetPasswordPage() {
  const session: any = useSession();
  const params = useSearchParams();
  const router = useRouter();

  const userId = session?.data?.user?.id; // the value stored in this variable is an email address
  const auth_code = params?.get("auth_code");
  const [showPassword, setShowPassword] = useState(false);

  const [userSetPassword, { isLoading }] = useSetPasswordMutation();

  const {
    user: { claim_info },
  }: Dictionary = useAppSelector((state) => state.user);

  const handleSubmitForm = async (values: initialValue) => {
    userSetPassword({ ...values, auth_code })
      .unwrap()
      .then((payload) => {
        if (payload.status === 200) {
          toast.success(payload.message);
          router.push("/login");
        }
      });
  };
  ause;

  const { values, errors, handleChange, handleSubmit, touched } = useFormik({
    initialValues: {
      password: "",
      confirm_password: "",
      // email: userId,
    },
    validationSchema: yup.object().shape({
      password: yup.string().required("Please enter a password."),
      confirm_password: yup
        .string()
        .oneOf([yup.ref("password")], "Passwords do not match.")
        .required("Please enter a password."),
    }),
    onSubmit: handleSubmitForm,
  });

  return (
    <main className='font-sans'>
      <div className='bg-[#F0F4F7] p-6 px-16 mt-20 m-6 rounded-[6px] sm:max-w-[28rem] sm:mx-auto'>
        <div className='pt-2 flex flex-col items-center justify-center'>
          <Image
            src='/images/logo/text-logo.png'
            width={150}
            height={150}
            alt='logo'
            className='md:hidden'
          />
          <Image
            src='/images/logo/text-logo.png'
            width={180}
            height={180}
            alt='logo'
            className='hidden md:block'
          />
          <h2 className='font-bold text-xl py-3 text-start'>Create Password</h2>
          <p className='text-sm font-medium'>
            Your Account has been created, proceed to set up a password for your
            account
          </p>
        </div>
        <div className='mt-4'>
          <form onSubmit={handleSubmit}>
            <div className='relative w-full'>
              <Input
                type={`${showPassword ? "text" : "password"}`}
                id='password'
                label='Password'
                name='password'
                value={values.password}
                onChange={handleChange}
                touched={touched}
                error={errors.password}
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

            <Input
              type={`${showPassword ? "text" : "password"}`}
              id='confirm_password'
              label='Confirm Password'
              name='confirm_password'
              value={values.confirm_password}
              onChange={handleChange}
              touched={touched}
              error={errors.confirm_password}
            />
            <div className='my-4 mt-7 flex justify-en'>
              <Button
                className='font-light h-9 w-full'
                type='submit'
                loading={isLoading}
                loadingText='Create Password'
                disabled={isLoading}
              >
                Create Password
              </Button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
