"use client";
import { Dispatch, SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useResetPasswordMutation } from "@/redux/services/user/userApi";
import { useFormik } from "formik";
import * as yup from "yup"

interface ComponentProps {
  setForgotPassword: Dispatch<SetStateAction<boolean>>
}

export default function ForgotPasswordPanel({setForgotPassword}: ComponentProps) {
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const handleSubmitForm = async (values) => {
    resetPassword(values)
      .unwrap()
      .then((payload) => {
        if (payload.status === 200) {
          setForgotPassword(false);
        }
      });
  };

  // handle input change
  const { values, errors, handleSubmit, handleChange, touched } = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: yup.object().shape({
      email: yup.string().email().required('email field is required'),
    }),
    onSubmit: handleSubmitForm
  })

  return (
    <div>
      <div className=''>
        <h2 className='font-bold text-2xl text-gray-700 my-5'>Reset your password</h2>
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
            <Button
              className='block my-3'
              loading={isLoading}
              disabled={isLoading}
              type='submit'
            >
              Reset password
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
