"use client";
import React, {useState, useEffect } from "react";
import { useFormik } from "formik";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ImagePlus, Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import * as yup from "yup"
import { useLazyGetRecruiterQuery, useUpdateRecruiterPersonalInfoMutation, useUploadRecruiterProfileImageMutation } from "@/redux/services/recruiter/recruiterApi";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import LoadingSpinner from "@/components/loading-spinner";
import CustomFileInput from "@/components/custom-file-input";
import { cn } from "@/lib/utils";


interface InitialValues {
  phone:string,
  first_name:string,
  last_name:string,
  profile_img?:string
}

export default function Page() {
  const router = useRouter();
  const session = useSession()
  const recruiterId = session?.data?.user?.roleId

  const [getData, {data}] = useLazyGetRecruiterQuery()
  const [updateRecruiterPersonalInfo, { isLoading }] = useUpdateRecruiterPersonalInfoMutation();
  const [uploadRecruiterProfileImg, { isLoading:uploading }] = useUploadRecruiterProfileImageMutation();

  const [selectedImage, setSelectedImage] = useState<File>();

  const handleSubmitForm = async (values: InitialValues) => {
    updateRecruiterPersonalInfo({ ...values, id:recruiterId})
      .unwrap()
      .then((payload:any) => {
        if (payload.status === 200) {
          toast.success(payload.message);
          router.refresh();
        }
      });
  };

  const { values, errors, touched, handleChange, handleSubmit, handleBlur, setFieldValue} = useFormik({
    enableReinitialize: true,
    initialValues: {
      first_name: data?.data?.user?.first_name,
      last_name: data?.data?.user?.last_name,
      phone: data?.data?.user?.phone,
      profile_img: data?.data?.user?.profile_img
    },
    validationSchema: yup.object().shape({
      first_name: yup.string().required("first name is required."),
      last_name: yup.string().required("last name is required."),
      phone: yup.string().required("Phone number is required."),
    }),

    onSubmit:handleSubmitForm
  });

  const handleUploadRecruiterProfileImage = async (payload) => {
    uploadRecruiterProfileImg(payload)
      .unwrap()
      .then((payload) => {
        if (payload?.data?.profile_img) {
          setFieldValue("profile_img", payload.data.image_url )
        }
      })
  }

  useEffect(()=>{
    if(recruiterId){
      getData({id:recruiterId})
    }
  }, [recruiterId])

  useEffect(() => {
    if (selectedImage) {
      const payload = new FormData()
      payload.append('profile_img', selectedImage)
      handleUploadRecruiterProfileImage(payload)
    }
  }, [selectedImage])

  if(!data){
    return <LoadingSpinner/>
  }

  return (
    <div className="pi-container">
        <div className="w-full bg-white">
            <div className="w-full px-5 md:px-0 md:w-[65%] mx-auto">
              <h1 className="text-2xl md:text-3xl text-center font-bold mb-2">Let's Get to Know You</h1>
              <p className="text-sm md:text-lg text-gray-500 text-center">Please take a few minutes to fill in your profile so we can customize the opportunities for you.</p>

                <div className="mt-10 mb-5">
                  <h3 className="mb-3 font-semibold">Add Profile Picture</h3>
                  <div className="flex gap-x-4 items-center">
                    <CustomFileInput
                      handleFileChange={(file) => {
                        setSelectedImage(file)
                      }}
                      uploading={uploading}
                    >
                      <div id="imageInput" className={cn(
                        "border border-dashed border-gray-400 w-32 h-32 grid place-content-center rounded-full overflow-hidden"
                      )}
                      >
                        {selectedImage ? <img src={selectedImage && URL.createObjectURL(selectedImage)} alt="" />
                          :
                          values.profile_img ? <img src={values.profile_img} alt=""/> :
                          <ImagePlus className="w-10 h-10 text-gray-400" />
                        }
                      </div>
                    </CustomFileInput>
                    <Button
                      type="button"
                      variant="outline"
                      className="border-neutral-300 rounded-xl flex flex-row gap-x-2 text-black/80 hover:bg-[#FEBB0E]"
                      onClick={() => {
                        document.getElementById('imageInput')?.click();
                      }}
                    >
                      <Upload size={18} className="" />
                      <span className="font-[500]">Upload</span>
                    </Button>
                  </div>
                </div>
              <div className="flex gap-x-4 items-center">

                <div className='w-full mt-4'>
                  <form onSubmit={handleSubmit} className="w-full">
                    <div className="w-full flex flex-col md:flex-row justify-between gap-x-6">
                      <Input
                          type={"text"}
                          id='first_name'
                          label='First Name'
                          name='first_name'
                          value={values.first_name}
                          onChange={handleChange}
                          handleBlur={handleBlur}
                          touched={touched.first_name}
                          className="placeholder:text-gray-300"
                          placeholder="Enter your first name"
                          error={errors.first_name}
                      />
                      <Input
                          type={"text"}
                          id='last_name'
                          label='Last Name'
                          name='last_name'
                          value={values.last_name}
                          onChange={handleChange}
                          handleBlur={handleBlur}
                          className="placeholder:text-gray-300"
                          touched={touched.last_name}
                          placeholder="Enter your last name"
                          error={errors.last_name}
                      />                    
                    </div>

                    <Input
                      type="number"
                      id='phone'
                      label='Phone Number'
                      name='phone'
                      value={values.phone}
                      className="placeholder:text-gray-300"
                      onChange={handleChange}
                      handleBlur={handleBlur}
                      touched={touched.phone}
                      placeholder="Enter your phone number"
                      error={errors.phone}
                    />

                    <div className='my-4 mt-7 flex justify-end'>
                    <Button 
                        type='submit'
                        variant="orange" 
                        className='w-full sm:w-fit md:px-10 rounded-lg font-[500]'
                        loading={isLoading}
                        disabled={isLoading}
                        loadingText={"Saving..."}
                    >
                        Save
                    </Button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
        </div>
    </div>
  );
}