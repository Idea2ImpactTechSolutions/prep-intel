"use client";
import CustomDatePicker from "@/components/custom-date-picker";
import CustomFileInput from "@/components/custom-file-input";
import CustomSelect from "@/components/custom-select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useLazyGetSchoolProfileQuery, useManagerCreateSchoolProfileMutation, useUploadSchoolImageMutation } from "@/redux/services/school/managerApi";
import { useAppSelector } from "@/redux/store";
import { Dictionary } from "@/types/dictionary";
import { STATE_CITY_DATA } from "@/utils/data";
import { formatRMDatePicker } from "@/utils/helpers/date-format";
import { Formik, Form, FieldArray, Field } from "formik";
import { ChevronLeft, ChevronRight, File, Image, ImagePlus, LucideLoader, MinusCircle, PlusSquare, Save, X } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import * as yup from "yup"
import { toast } from "sonner"

interface initialValues {
  school_id: string,
  school_image: string;
  school_details: {
    name: string,
    institution_type: string,
    tagline: string,
    founded_date: string,
    affiliations: string
  },
  school_address: {
    address_id: string,
    street_address: string,
    school_state: string,
    school_zip: string,
    contact_types: {
      contact_id: number,
      contact_type: string,
      phone: string,
      email: string
    }[],
  },
  school_social_medias: {
    social_media_id: number,
    social_media: string,
    url: string
  }[],
}

export default function BasicInformationForm() {
  const [selectedImage, setSelectedImage] = useState<File>()
  const [schoolImgUrl, setSchoolImgUrl] = useState('')
  const { data: userData }: any = useSession()
  const [getSchoolProfile] = useLazyGetSchoolProfileQuery()
  const [uploadSchoolImage, {isLoading, isSuccess}] = useUploadSchoolImageMutation()
  const [managerCreateSchoolProfile, {isLoading: isCreatingSchoolProfile, isSuccess: isSuccessCreateSchoolProfile}] = useManagerCreateSchoolProfileMutation()
  
  const { manager: { school_information: { school_data } } }: Dictionary = useAppSelector((state) => state.manager)
  const [initialSchoolData, setInitialSchoolData] = useState<initialValues>({
    school_id: school_data?.id || '',
    school_image: '',
    school_details: {
      name: school_data?.name || '',
      institution_type: school_data?.institution_type ||'',
      tagline: school_data?.tagline || '',
      founded_date: school_data?.found_date || '',
      affiliations: ''
    },
    school_address: {
      address_id: school_data?.school_address?.id || '',
      street_address: school_data?.school_address?.street_address_1 || '',
      school_state: school_data?.school_address?.state || '',
      school_zip: school_data?.school_address?.postal || '',
      contact_types: school_data?.school_contacts?.map((contact: Dictionary) => {
        return {
          contact_id: contact?.id,
          contact_type: contact?.contact_type,
          phone: contact?.phone,
          email: contact?.email
        }
      }) || [
        {
          contact_id: undefined,
          contact_type: '',
          phone: '',
          email: ''
        }
      ],
    },
    school_social_medias: school_data?.school_social_medias?.map((media: Dictionary) => {
      return {
        social_media_id: media?.id,
        social_media: media?.social_media,
        url: media?.url
      }
    }) || [
      {
        social_media_id: undefined,
        social_media: '',
        url: ''
      }
    ],
  })

  const router = useRouter()

  const handleUploadSchoolImage = async (payload) => {
    uploadSchoolImage(payload)
      .unwrap()
      .then((payload) => {
        if (payload?.data?.image_url) {
          setInitialSchoolData({...initialSchoolData, school_image: payload.data.image_url})
          setSchoolImgUrl(payload.data.image_url)
        }
      })
  }

  const handleCreateSchoolProfile = async (payload: Dictionary) => {
    let schoolData = {...payload}
    schoolData.school_image = schoolImgUrl
    managerCreateSchoolProfile(schoolData)
      .unwrap()
      .then((payload) => {
        if (payload.status === 201) {
          toast.success("School Profile Submitted Successfully ")
          router.push("/school/academic-info");
        }
      })
  }

  const schema = yup.object().shape({
    // school_image: yup.string().required('upload school image'),
    school_details: yup.object().shape({
      name: yup.string().required("school name is required"),
      founded_date: yup.string().required("founded date is required"),
      institution_type: yup.string().required("institution type is required"),
      tagline: yup.string().required("school tagline is required"),
      affiliations: yup.string().required("school affiliations is required"),
    }),
    school_address: yup.object().shape({
      street_address: yup.string().required("street address is required"),
      school_state: yup.string().required("school state is required"),
      school_zip: yup.string().required("school zip is required"),
      contact_types: yup.array().of(
        yup.object().shape({
          contact_type: yup.string().required("contact type is required"),
          phone: yup.string().required("phone number type is required"),
          email: yup.string().email('email must be valid').required("email is required"),
        })
      )
    })
  })

  const handleFormSubmit = (values: initialValues) => {
    let payload = {...values}
    payload = {...payload, school_image: schoolImgUrl}
    handleCreateSchoolProfile(payload)
  }

  useEffect(() => {
    if (selectedImage) {
      const payload = new FormData()
      payload.append('image', selectedImage)
      payload.append('school_id', school_data.id)
      payload.append('category', 'logo')
      handleUploadSchoolImage(payload)
    }
  },[selectedImage])

  return (
    <>
      <div className="">
        <Formik
          initialValues={initialSchoolData}
          onSubmit={handleFormSubmit}
          validationSchema={schema}
        >
          {({ values, errors, touched, handleChange, setFieldValue }) => {
            return (
              <Form>
                <div className="p-4 md:px-16 flex flex-col h-[calc(100vh_-_14rem)] overflow-y-scroll">
                  <div className="flex-1">
                    <div className="flex flex-col gap-y-4 md:flex-row md:gap-x-8">
                      <div className="flex gap-x-8">
                        <div>
                          <label htmlFor="logo" className="text-sm font-bold">Upload Your Logo</label>
                          <CustomFileInput
                            handleFileChange={(file) => {
                              setSelectedImage(file)
                            }}
                            uploading={isLoading}
                          >
                            <div className={cn(
                              "border border-dashed border-gray-400 w-32 h-32 grid place-content-center rounded-[5px]",
                              errors.school_image && touched.school_image && "border-red-500"
                            )}
                            >
                              {selectedImage ? <img src={selectedImage && URL.createObjectURL(selectedImage)} />
                                :
                                <ImagePlus className="w-10 h-10 text-gray-400" />
                              }
                            </div>
                          </CustomFileInput>
                        </div>
                        <div className="flex-1">
                          <label htmlFor="school_details" className="text-sm font-bold">School Details</label>
                          <div className="flex flex-col gap-y-">
                            <Input
                              label="School Name"
                              name="school_details.name"
                              value={values.school_details.name}
                              touched={touched.school_details?.name}
                              // onChange={handleChange}
                              error={errors.school_details?.name}
                              labelClass="text-xs font-normal text-[#61646B]"
                              className="w-full md:w-[22rem]"
                              readOnly
                            />
                            <Textarea
                              label="School Tagline"
                              labelClass="text-xs font-normal text-[#61646B]"
                              rows={1}
                              name="school_details.tagline"
                              value={values.school_details.tagline}
                              touched={touched.school_details?.tagline}
                              onChange={handleChange}
                              error={errors.school_details?.tagline}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="grid grid-cols-1 gap-y-3 gap-x-4 md:grid-cols-2 md:mt-5">
                          <CustomDatePicker
                            label="Founded Date"
                            labelClass="text-xs font-normal text-[#61646B]"
                            value={values?.school_details?.founded_date || ""}
                            handleChange={(date) => setFieldValue(`school_details.founded_date`, formatRMDatePicker(date))}
                            touched={touched?.school_details?.founded_date}
                            error={errors?.school_details?.founded_date}
                          />
                          <CustomSelect
                            label="Institution Type"
                            labelClass="text-xs font-normal text-[#61646B]"
                            name="school_details.institution_type"
                            touched={touched.school_details?.institution_type}
                            error={errors.school_details?.institution_type}
                            options={[
                              { label: 'University', value: 'University' },
                              { label: 'Community College', value: 'Community College' },
                            ]}
                            selected={school_data?.institution_type || values.school_details.institution_type}
                            setSelected={(selected) => setFieldValue('school_details.institution_type', selected)}
                          />
                        </div>
                        <div className="mt-2">
                          <Textarea
                            label="School Affiliations, Separated by Comma"
                            labelClass="text-xs font-normal text-[#61646B]"
                            rows={1}
                            name="school_details.affiliations"
                            value={values.school_details.affiliations}
                            touched={touched.school_details?.affiliations}
                            onChange={handleChange}
                            error={errors.school_details?.affiliations}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mt-8">
                      <h3 className="text-sm font-bold mb-2">Contact Information</h3>
                      <div className="flex flex-col gap-y-4 gap-x-4 md:items-center md:flex-row">
                        <div className="flex-1">
                          <Input
                            label="School Street Address"
                            labelClass="text-xs font-normal text-[#61646B]"
                            name="school_address.street_address"
                            value={values?.school_address.street_address}
                            touched={touched?.school_address?.street_address}
                            onChange={handleChange}
                            error={errors.school_address?.street_address}
                          />
                        </div>
                        <div className="flex gap-x-4 items-cente">
                          <div className="flex-1 md:w-[20rem]">
                            <CustomSelect
                              label="State"
                              labelClass="text-xs font-normal text-[#61646B]"
                              name="school_address.school_state"
                              touched={touched?.school_address?.school_state}
                              error={errors?.school_address?.school_state}
                              options={
                                STATE_CITY_DATA.map((state) => (
                                  {
                                    label: state.name,
                                    value: state.name,
                                  }
                                ))
                              }
                              selected={values?.school_address?.school_state}
                              setSelected={(selected) => setFieldValue('school_address.school_state', selected)}
                            />
                          </div>
                          <Input
                            label="Zip"
                            name="school_address.school_zip"
                            value={values.school_address.school_zip}
                            touched={touched.school_address?.school_zip}
                            error={errors?.school_address?.school_zip}
                            onChange={handleChange}
                            labelClass="text-xs font-normal text-[#61646B]"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mt-4">
                      <FieldArray
                        name="school_address.contact_types"
                      >
                        {({ push, remove }: { push: any, remove: any }) => (
                          <>
                            {
                              values.school_address.contact_types.length > 0 &&
                              values.school_address.contact_types.map((item, index) => (
                                <div key={index} className="relative mb-2 flex flex-col gap-y-4 gap-x-4 md:flex-row md:items-start ">
                                  <div className="flex gap-x-4 md:flex-1">
                                    <Field
                                      as="select"
                                      name={`school_address.contact_types.${index}.contact_type`}
                                    >
                                      {({
                                        field,
                                        form: { touched, errors },
                                        meta
                                      }) => (
                                        <div className="w-1/2 md:w-[16rem]">
                                          <CustomSelect
                                            label="Contact Type"
                                            labelClass="text-xs font-normal text-[#61646B] mt-0"
                                            name={`school_address.contact_types.${index}.contact_type`}
                                            touched={touched?.school_address?.contact_types[index]?.contact_type}
                                            error={errors?.school_address?.contact_types[index]?.contact_type}
                                            options={[
                                              { label: 'Admissions', value: 'Admissions' },
                                              { label: 'Financial Aid', value: 'Financial Aid' },
                                            ]}
                                            selected={values?.school_address?.contact_types[index]?.contact_type}
                                            setSelected={(selected) => setFieldValue(`school_address.contact_types.${index}.contact_type`, selected)}
                                          />
                                        </div>
                                      )}
                                    </Field>
                                    <Field
                                      name={`school_address.contact_types.${index}.phone`}
                                    >
                                      {({
                                        field,
                                        form: { touched, errors },
                                        meta
                                      }) => (
                                        <div className="flex-1">
                                          <Input
                                            label="Phone Number"
                                            labelClass="text-xs font-normal text-[#61646B]"
                                            name={`school_address.contact_types.${index}.phone`}
                                            value={values?.school_address?.contact_types[index]?.phone}
                                            onChange={(e) => setFieldValue(`school_address.contact_types.${index}.phone`, e.target.value)}
                                            touched={touched?.school_address?.contact_types[index]?.phone}
                                            error={errors?.school_address?.contact_types[index]?.phone}
                                          />
                                        </div>
                                      )}
                                    </Field>
                                  </div>
                                  <Field
                                    name={`school_address.contact_types.${index}.phone`}
                                  >
                                    {({
                                      field,
                                      form: { touched, errors },
                                      meta
                                    }) => (
                                      <div className="md:w-[32rem]">
                                        <Input
                                          label="Email Address"
                                          type="email"
                                          labelClass="text-xs font-normal text-[#61646B]"
                                          name={`school_address.contact_types.${index}.email`}
                                          value={values?.school_address?.contact_types[index]?.email}
                                          onChange={(e) => setFieldValue(`school_address.contact_types.${index}.email`, e.target.value)}
                                          touched={touched?.school_address?.contact_types[index]?.email}
                                          error={errors?.school_address?.contact_types[index]?.email}
                                        />
                                      </div>
                                    )}
                                  </Field>
                                  {values.school_address.contact_types.length > 1 && <span className="absolute -right-4 top-1 text-red-500 cursor-pointer"
                                    onClick={() => remove(index)}
                                  > <MinusCircle /> </span>}
                                </div>
                              ))
                            }
                            <Button
                              className="bg-[#F0F4F7] rounded-[8px] px-8 text-[#880505] font-normal gap-1 hover:bg-[#F0F4F7]/90 text-xs"
                              type="button"
                              onClick={() => push({
                                contact_type: '',
                                phone: '',
                                email: ''
                              })}
                            > <PlusSquare width="15" height="15" /> Add Additional</Button>
                          </>

                        )}
                      </FieldArray>

                    </div>
                  </div>
                </div>
                <div className="border-t-2 border-t-[#880505] bg-[#F0F4F7] p-4 flex justify-between items-center md:px-16">
                  <div className="flex gap-x-4 items-center">
                    <Button
                      variant="outline"
                      className="text-xs h-7 rounded-sm px-3"
                      type="button"
                    ><Save className="w-3 h-3 mr-1" /> Save for Later</Button>
                  </div>
                  <div className="flex gap-x-4 items-center">
                    <Button
                      variant="outline"
                      className="text-xs h-7 rounded-sm px-6"
                      type="button"
                      // onClick={() => router.push('/school/dashboard')}
                      disabled
                    ><ChevronLeft className="w-3 h-3 mr-1" /> Back</Button>
                    <Button
                      className="text-xs h-7 rounded-sm px-6"
                      type="submit"
                      loading={isCreatingSchoolProfile}
                      disabled={isCreatingSchoolProfile || isLoading}
                      // onClick={() => handleCreateSchoolProfile(values)}
                    >Next <ChevronRight className="w-3 h-3 ml-1" /></Button>
                  </div>
                </div>
              </Form>
            )
          }
          }
        </Formik>
      </div>
    </>
  )
}