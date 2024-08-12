"use client";
import CustomDatePicker from "@/components/custom-date-picker";
import CustomFileInput from "@/components/custom-file-input";
import CustomSelect from "@/components/custom-select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useLazyGetSchoolProfileQuery, useManagerCreateSchoolProfileMutation } from "@/redux/services/school/managerApi";
import { useUploadAssetMutation  } from "@/redux/services/assets/assetApi";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { Dictionary } from "@/types/dictionary";
import { statePaths } from "@/data/state-paths";
import { Formik, Form, FieldArray, Field } from "formik";
import { File, ImagePlus, MinusCircle, PlusSquare } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import * as yup from "yup"
import { toast } from "sonner"
import moment from 'moment';
import { CompletionPanel } from "@/components/completion-panel";
import FormFooter from "../../_components/form-footer";
import { setSchoolInformation } from "@/redux/features/school/managerSlice";
import LoadingSpinner from "@/components/loading-spinner";
import ProfilePublishedLabel from "@/components/profile-published-label";
import { PageContent } from "@/components/common-page";
import {
  SCHOOL_PROFILE_IMAGE,
  SCHOOL_BANNER_IMAGE,
} from "types/assetTypes";
import { cacheBust, buildAssetUrl } from "@/app/config/helpers";

interface initialValues {
  school_id: string,
  school_details: {
    name: string,
    institution_type: string,
    tagline: string,
    founded_date: string,
    intro_paragraph: string
  },
  school_address: {
    address_id: string,
    street_address: string,
    school_state: string,
    school_zip: string,
    city: string,
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

export default function Page() {
  const [isFetchedProfile, setIsFetchProfile] = useState<boolean>(false)
  const [selectedImage, setSelectedImage] = useState<File>()
  const [bannerImage, setBannerImage] = useState<File>()
  const [profileImageUrl, setProfileImageUrl] = useState('')
  const [bannerImageUrl, setBannerImageUrl] = useState('')
  const [getSchoolProfile, { isLoading: isLoadingGetProfile, isFetching: isFetchingSchoolProfile, isSuccess:isSuccessGetProfile}] = useLazyGetSchoolProfileQuery()
  const [uploadImage, { isLoading }] = useUploadAssetMutation()
  const [managerCreateSchoolProfile, { isLoading: isCreatingSchoolProfile }] = useManagerCreateSchoolProfileMutation()

  const dispatch = useAppDispatch()
  const router = useRouter()
  const pageParams = useParams();
  const schoolId = pageParams?.id;

  const { manager: { school_information: { school_data } } }: Dictionary = useAppSelector((state) => state.manager)
  const [initialSchoolData, setInitialSchoolData] = useState<initialValues>({
    school_id: school_data?.id || '',
    school_details: {
      name: school_data?.name || '',
      institution_type: school_data?.institution_type || '',
      tagline: school_data?.tagline || '',
      founded_date: school_data?.found_date || '',
      intro_paragraph: school_data?.intro_paragraph || ''
    },
    school_address: {
      address_id: school_data?.school_address?.id || '',
      street_address: school_data?.school_address?.street_address_1 || '',
      school_state: school_data?.school_address?.state || '',
      city: school_data?.school_address?.city || '',
      school_zip: school_data?.school_address?.postal || '',
      contact_types: school_data?.school_contacts?.map((contact: Dictionary) => {
        return {
          contact_id: contact?.id,
          contact_type: contact?.contact_type,
          phone: contact?.phone,
          email: contact?.email,
        }
      }) || [
          {
            contact_id: undefined,
            contact_type: '',
            phone: '',
            email: '',
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

  const handleUploadImage = async (payload) => {
    const category = payload.get('category');

    if (category === SCHOOL_PROFILE_IMAGE) {
      setProfileImageUrl('');
    } else {
      setBannerImageUrl('');
    }

  uploadImage(payload)
    .unwrap()
    .then((payload) => {
      if (payload?.data?.assetUrl) {
        const assetUrl = `${payload.data.assetUrl}?v=${(new Date()).getTime()}`;
        if (category === SCHOOL_PROFILE_IMAGE) {
          setProfileImageUrl(assetUrl);
        } else {
          setBannerImageUrl(assetUrl);
        }
      }
    });
  }

  const handleCreateSchoolProfile = async (payload: Dictionary) => {
    let schoolData = { ...payload }
    managerCreateSchoolProfile(schoolData)
      .unwrap()
      .then((payload) => {
        if (payload.status === 201) {
          setIsFetchProfile(false)

          dispatch(setSchoolInformation({ slug: 'school_data', data: {...payload.data.school, create_count: 1} }))
          toast.success("School Profile Submitted Successfully ")
          router.push(`/school/${schoolId}/academic-info`);
        }
      })
  }

  const handleGetSchoolInformation = async (schoolId) => {
    getSchoolProfile(schoolId)
        .unwrap()
        .then((payload) => {
            const { data } = payload
            setIsFetchProfile(true)
            dispatch(setSchoolInformation({ slug: 'school_data', data: data }))
        })
  }

  const schema = yup.object().shape({
    // school_image: yup.string().required('upload school image'),
    school_details: yup.object().shape({
      name: yup.string().required("school name is required"),
      founded_date: yup.string().required("founded date is required"),
      institution_type: yup.string().required("institution type is required"),
      tagline: yup.string().required("school tagline is required"),
      intro_paragraph: yup.string().required("school intro paragraph is required"),
    }),
    school_address: yup.object().shape({
      street_address: yup.string().required("street address is required"),
      school_state: yup.string().required("school state is required"),
      city: yup.string().required("school city is required"),
      school_zip: yup.string().required("school zip is required"),
      contact_types: yup.array().of(
        yup.object().shape({
          contact_type: yup.string().required("contact type is required"),
          phone: yup.string().required("phone number type is required"),
          email: yup.string().email('email must be valid').required("email is required"),
        })
      )
    }),
    school_social_medias: yup.array().of(
      yup.object().shape({
        social_media: yup.string().required("social media name is required"),
        url: yup.string().required("social media url is required"),
      })
    )
  })

  const handleFormSubmit = (values: initialValues) => {
    handleCreateSchoolProfile(values)
  }

  useEffect(() => {
    if (selectedImage) {
      const payload = new FormData()
      payload.append('file', selectedImage)
      payload.append('schoolId', school_data.id)
      payload.append('category', SCHOOL_PROFILE_IMAGE)

      handleUploadImage(payload)
    }
  }, [selectedImage])

  useEffect(() => {
    if (bannerImage) {
      const payload = new FormData()
      payload.append('file', bannerImage)
      payload.append('schoolId', school_data.id)
      payload.append('category', SCHOOL_BANNER_IMAGE)

      handleUploadImage(payload)
    }
  }, [bannerImage])

  useEffect(() => {
      if(schoolId){
        !isFetchedProfile && handleGetSchoolInformation(schoolId)
      }
  }, [])

  useEffect(() => {
    // TODO: Add these simple props to the data returned by the endpoint
    setBannerImageUrl(cacheBust(buildAssetUrl(school_data?.assets?.find(f => f.category === SCHOOL_BANNER_IMAGE)?.id)));
    setProfileImageUrl(cacheBust(buildAssetUrl(school_data?.assets?.find(f => f.category === SCHOOL_PROFILE_IMAGE)?.id)));

    setInitialSchoolData({
      school_id: school_data?.id || '',
      school_details: {
        name: school_data?.name || '',
        institution_type: school_data?.institution_type || '',
        tagline: school_data?.tagline || '',
        founded_date: school_data?.found_date || '',
        intro_paragraph: school_data?.intro_paragraph || ''
      },
      school_address: {
        address_id: school_data?.school_address?.id || '',
        street_address: school_data?.school_address?.street_address_1 || '',
        school_state: school_data?.school_address?.state || '',
        city: school_data?.school_address?.city || '',
        school_zip: school_data?.school_address?.postal || '',
        contact_types: school_data?.school_contacts?.length > 0 && school_data?.school_contacts?.map((contact: Dictionary) => {
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
      school_social_medias: school_data?.school_social_medias?.length > 0 && school_data?.school_social_medias?.map((media: Dictionary) => {
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
  },[isSuccessGetProfile, school_data,])

  if (isLoadingGetProfile || isFetchingSchoolProfile) {
    return <LoadingSpinner />;
  }

  return (
    <>
        <div className="pi-container mx-auto">
          {!school_data?.publish_date && <CompletionPanel percentCompleted={0} title={"0/3"}></CompletionPanel>}
          {school_data?.publish_date && <div className="float-right"><ProfilePublishedLabel/></div>}
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            Create Your School's Profile
          </h1>
        </div>
        <PageContent>
        <Formik
          initialValues={initialSchoolData}
          onSubmit={handleFormSubmit}
          validationSchema={schema}
          enableReinitialize={true}
        >
          {({ values, errors, touched, handleChange, setFieldValue }) => {
            return (
              <Form>
                <div className="pi-container flex flex-col">
                  <div className="flex-1">
                    <div className="flex flex-col gap-y-4 md:flex-row md:gap-x-8">
                      <div className="flex gap-x-8">
                        <div>
                          <label htmlFor="logo" className="text-sm font-bold">Upload Your Logo</label>
                          <CustomFileInput
                            handleFileChange={(file) => {
                              setSelectedImage(file)
                            }}
                            uploading={isLoading && Boolean(selectedImage)}
                          >
                            <div className={cn(
                              "border border-dashed border-gray-400 w-32 h-32 grid place-content-center rounded-[5px]",
                            )}
                            >
                              {profileImageUrl ? <img src={profileImageUrl} alt=""/> :
                                <ImagePlus className="w-10 h-10 text-gray-400" />
                              }
                            </div>
                          </CustomFileInput>

                          <div className="hidden">
                            <label htmlFor="logo" className="text-sm font-bold">Banner</label>
                            <CustomFileInput
                              handleFileChange={(file) => {setBannerImage(file)}}
                              uploading={isLoading && Boolean(bannerImage)}
                            >
                              <div className={cn(
                                "border border-dashed border-gray-400 w-32 h-32 grid place-content-center rounded-[5px]",
                              )}
                              >
                                { bannerImageUrl ? <img src={bannerImageUrl} alt=""/> :
                                  <ImagePlus className="w-10 h-10 text-gray-400" />
                                }
                              </div>
                            </CustomFileInput>
                          </div>
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
                            handleChange={(date) => setFieldValue('school_details.founded_date', date ? moment(date).format('YYYY-MM-DD') : "")}
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
                            selected={values.school_details.institution_type || school_data?.institution_type}
                            setSelected={(selected) => setFieldValue('school_details.institution_type', selected)}
                          />
                        </div>
                        <div className="mt-2">
                          <Textarea
                            label="Campus Introductory Paragraph"
                            labelClass="text-xs font-normal text-[#61646B]"
                            rows={3}
                            name="school_details.intro_paragraph"
                            value={values.school_details.intro_paragraph}
                            touched={touched.school_details?.intro_paragraph}
                            onChange={handleChange}
                            error={errors.school_details?.intro_paragraph}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mt-8">
                      <h3 className="text-sm font-bold mb-2">Contact Information</h3>
                      <div className="flex flex-col gap-y-4 gap-x-4 md:items-center md:flex-row">
                        <div className="flex-1 flex gap-4">
                          <div className="w-full">
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
                          <div className="w-full">
                          <Input
                            label="City"
                            labelClass="text-xs font-normal text-[#61646B]"
                            name="school_address.city"
                            value={values?.school_address.city}
                            touched={touched?.school_address?.city}
                            onChange={handleChange}
                            error={errors.school_address?.city}
                            className="w-full"
                          />
                          </div>
                        </div>
                        <div className="flex gap-x-4 items-center">
                          <div className="flex-1 md:w-[20rem]">
                            <CustomSelect
                              label="State"
                              labelClass="text-xs font-normal text-[#61646B]"
                              name="school_address.school_state"
                              touched={touched?.school_address?.school_state}
                              error={errors?.school_address?.school_state}
                              options={
                                statePaths.map((state) => (
                                  {
                                    label: state.name,
                                    value: state.id,
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
                                            error={errors?.school_address?.contact_types?.[index]?.contact_type}
                                            options={[
                                              { label: 'Admissions', value: 'Admissions' },
                                              { label: 'Financial Aid', value: 'Financial Aid' },
                                            ]}
                                            selected={values?.school_address?.contact_types[index]?.contact_type}
                                            setSelected={(selected) => {
                                              setFieldValue(`school_address.contact_types.${index}.contact_type`, selected)
                                            }}
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
                                            error={errors?.school_address?.contact_types?.[index]?.phone}
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
                                          error={errors?.school_address?.contact_types?.[index]?.email}
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

                    <div className="mt-4">
                      <FieldArray
                        name="school_social_medias"
                      >
                        {({ push, remove }: { push: any, remove: any }) => (
                          <>
                            {
                              values.school_social_medias.length > 0 &&
                              values.school_social_medias.map((item, index) => (
                                <div key={index} className="relative mb-2 flex flex-col gap-y-4 gap-x-4 md:flex-row md:items-start ">
                                  <div className="flex gap-x-4 md:flex-1">
                                    <Field
                                      as="select"
                                      name={`school_social_medias.${index}.social_media`}
                                    >
                                      {({
                                        field,
                                        form: { touched, errors },
                                        meta
                                      }) => (
                                        <div className="w-1/2 md:w-[16rem] lg:w-[26rem]">
                                          <CustomSelect
                                            label="School Social Media Platform"
                                            labelClass="text-xs font-normal text-[#61646B] mt-0"
                                            name={`school_social_medias.${index}.social_media`}
                                            touched={touched?.school_social_medias?.[index]?.social_media}
                                            error={errors?.school_social_medias?.[index]?.social_media}
                                            options={[
                                              { label: 'Facebook', value: 'Facebook' },
                                              { label: 'Twitter', value: 'Twitter' },
                                              { label: 'Instagram', value: 'Instagram' },
                                            ]}
                                            selected={values?.school_social_medias?.[index]?.social_media}
                                            setSelected={(selected) => {
                                              setFieldValue(`school_social_medias.${index}.social_media`, selected)
                                            }}
                                          />
                                        </div>
                                      )}
                                    </Field>
                                    <Field
                                      name={`school_social_medias.${index}.url`}
                                    >
                                      {({
                                        field,
                                        form: { touched, errors },
                                        meta
                                      }) => (
                                        <div className="flex-1">
                                          <Input
                                            label="Social Media Url"
                                            labelClass="text-xs font-normal text-[#61646B]"
                                            name={`school_social_medias.${index}.url`}
                                            value={values?.school_social_medias?.[index]?.url}
                                            onChange={(e) => setFieldValue(`school_social_medias.${index}.url`, e.target.value)}
                                            touched={touched?.school_social_medias?.[index]?.url}
                                            error={errors?.school_social_medias?.[index]?.url}
                                          />
                                        </div>
                                      )}
                                    </Field>
                                  </div>
                                  {values.school_social_medias.length > 1 && <span className="absolute -right-4 top-1 text-red-500 cursor-pointer"
                                    onClick={() => remove(index)}
                                  > <MinusCircle /> </span>}
                                </div>
                              ))
                            }
                            <Button
                              className="bg-[#F0F4F7] rounded-[8px] px-8 text-[#880505] font-normal gap-1 hover:bg-[#F0F4F7]/90 text-xs"
                              type="button"
                              onClick={() => push({
                                social_media: '',
                                url: '',
                              })}
                            > <PlusSquare width="15" height="15" /> Add Additional</Button>
                          </>

                        )}
                      </FieldArray>
                    </div>

                  </div>
                </div>
                <FormFooter
                    onBack={() => null}
                    onSaveForLater={() => null}
                    isBackDisabled={true}
                    isSubmitting={isCreatingSchoolProfile}
                  />
              </Form>
            )
          }
          }
        </Formik>
        </PageContent>
    </>
  );
}
