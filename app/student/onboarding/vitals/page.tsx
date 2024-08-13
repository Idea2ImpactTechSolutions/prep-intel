"use client";
import OnboardingFooter from "@/app/student/_components/onboarding-footer";
import CustomDatePicker from "@/components/custom-date-picker";
import SectionContainer from "@/components/section-container";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useAddStudentVitalsMutation, useLazyGetStudentVitalsQuery } from "@/redux/services/student/studentApi";
import { useFormik } from "formik";
import { useSession } from "next-auth/react";
import { Space_Grotesk } from "next/font/google";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import * as yup from "yup";
import OnboardingTabs from "../../_components/onboarding-tabs";
import OnboardingTitle from "../../_components/onboarding-title";
import LoadingSpinner from "@/components/loading-spinner";
import { statePaths } from "@/data/state-paths";
import { toast } from "sonner";
import CustomSelect from "@/components/custom-select";
import AssetImage from "@/components/asset-image";
import { cacheBust, dateWithLocalOffset } from "@/app/config/helpers";
import { PageContent } from "@/components/common-page";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"] });

export default function VitalsPage() {
  const { data: session } = useSession();
  const router = useRouter()
  const studentId = session?.user.roleId;
  const profileComplete = session?.user.profileComplete;
  const userId = session?.user.id;
  const [getStudentVitals, { isLoading, isFetching }] = useLazyGetStudentVitalsQuery()
  const [addStudentVitals, { isLoading: isAddingVitals, isSuccess  }] = useAddStudentVitalsMutation()

  const [studentData, setStudentData] = useState({
    user: {
      first_name: "",
      last_name: "",
      profile_image: "",
    },
    asset_image: "",
    dob: "",
    graduation_year: "",
    state: "",
    city: "",
    gpa: "0",
    act_score: "0",
    sat_score: "0",
    high_school: "",
    guardian_first_name: "",
    guardian_last_name: "",
    guardian_email: "",
  })

  const handleGetStudentVitals = async (studentId) => {
    getStudentVitals(studentId)
      .unwrap()
      .then(data => {
        setStudentData({ ...studentData, ...data.data })
      })
  }

  const handleFormSubmit = async (values) => {
    addStudentVitals({ data: { ...values }, studentId: studentId })
      .unwrap()
      .then(data => {
        if (!profileComplete) {
          toast.success(data.message)
          router.push("/student/onboarding/schools")
        } else {
          router.push('/student/explore');
        }
      })
  }

  const { values, errors, handleSubmit, handleChange, touched, setFieldValue } = useFormik({
    initialValues: studentData,
    validationSchema: yup.object().shape({
      user: yup.object().shape({
        first_name: yup.string().required('first name is required'),
        last_name: yup.string().required('last name is required'),
      }),
      dob: yup.string().required('date of birth is required'),
      graduation_year: yup.string().min(4, "graduation year must be 4 digits").max(4, "graduation year must be 4 digits").required('graduation year is required'),
      state: yup.string().required('state is required'),
      city: yup.string().required('city is required'),
      high_school: yup.string().required('high school name is required'),
    }),
    onSubmit: handleFormSubmit,
    enableReinitialize: true,
  })

  useEffect(() => {
    if (studentId) {
      handleGetStudentVitals(studentId)
    }
  }, [studentId])

  // Update asset image url after upload, using cached value from update response
  function setAssetUrl(url) {
    setStudentData(
      {
        ...studentData,
        user: {
          ...studentData.user,
          profile_image: cacheBust(url),
        }
      });
  }

  if (isLoading || isFetching) {
    return <LoadingSpinner />
  }

  return (
    <>
      <OnboardingTabs active_step="Vitals" useSteppedWizard={!profileComplete} />
      <PageContent>
        <OnboardingTitle
          title="Complete Your Profile"
          subtitle="Please take a few minutes to fill in your profile so we can customize the opportunities for you."
          visible={!profileComplete}
        />
        <div className="">
          <form onSubmit={handleSubmit}>
            <div className="flex-1">
              <SectionContainer
                title="About You"
                subTitle=""
                titleClass={cn(
                  spaceGrotesk.className,
                  "mb-0"
                )}
              >
                <div className="pt-3">
                  <div className="grid grid-cols-[auto,1fr,1fr] gap-x-4 md:gap-x-8">
                    <div className="row-span-6">
                      <h3 className="mb-3 font-semibold">Profile Picture</h3>
                      <AssetImage
                        imageUrl={studentData.user.profile_image}
                        userId={userId as string}
                        assetCategory="student-profile-image"
                        toast={toast}
                        onAssetUploaded={setAssetUrl} />
                    </div>

                    <Input
                      label="First Name"
                      className="rounded-lg p-[1.4rem] placeholder:text-[#AAAAAA]'"
                      placeholder="Enter your first name"
                      name="user.first_name"
                      value={values.user.first_name}
                      onChange={handleChange}
                      touched={touched.user?.first_name}
                      error={errors.user?.first_name}
                    />
                    <Input
                      label="Last Name"
                      className="rounded-lg p-[1.4rem] placeholder:text-[#AAAAAA]"
                      placeholder="Enter your last name"
                      name="user.last_name"
                      value={values.user.last_name}
                      onChange={handleChange}
                      touched={touched.user?.last_name}
                      error={errors.user?.last_name}
                    />
                    <CustomDatePicker
                      label="Birth Date"
                      className=""
                      inputClass="rounded-lg p-[.8rem] placeholder:text-[#AAAAAA]"
                      handleChange={(date) => setFieldValue('dob', date.format('YYYY-MM-DD'))}
                      value={dateWithLocalOffset(values.dob)}
                      touched={touched.dob}
                      error={errors.dob}
                      labelClass="mt-3"
                    />
                    <Input
                      label="Expected Graduation Year"
                      className="rounded-lg p-[1.4rem] placeholder:text-[#AAAAAA]"
                      placeholder="2023"
                      type=""
                      name="graduation_year"
                      value={values.graduation_year}
                      onChange={(e) => {
                        if (!isNaN(Number(e.target.value))) {
                          setFieldValue('graduation_year', e.target.value)
                        }
                      }}
                      touched={touched.graduation_year}
                      error={errors.graduation_year}
                      labelClass="mt-3"
                    />
                    <Input
                      label="City"
                      className="rounded-lg p-[1.4rem] placeholder:text-[#AAAAAA]"
                      placeholder="Enter your city"
                      name="city"
                      value={values.city}
                      onChange={handleChange}
                      touched={touched.city}
                      error={errors.city}
                      labelClass="mt-3"
                    />
                    <CustomSelect
                      label="State"
                      labelClass="mt-3 text-xs font-normal text-[#61646B]"
                      name="state"
                      touched={touched?.state}
                      error={errors?.state}
                      options={
                        statePaths.map((state) => (
                          {
                            label: state.name,
                            value: state.id,
                          }
                        ))
                      }
                      selected={values?.state}
                      setSelected={(selected) => setFieldValue('state', selected)}
                    />
                    <Input
                      label="High School Name"
                      className="rounded-lg p-[1.4rem] placeholder:text-[#AAAAAA]'"
                      placeholder="Enter your hign school name"
                      name="high_school"
                      value={values.high_school}
                      onChange={handleChange}
                      touched={touched.high_school}
                      error={errors.high_school}
                    />
                  </div>
                </div>
              </SectionContainer>

              <SectionContainer title="Academic Details" titleClass={cn(spaceGrotesk.className,"mt-6")}>
                  <div className="grid grid-cols-1 gap-x-4 md:grid-cols-3 md:gap-x-8 lg:grid-cols-">
                    <Input
                      label="ACT Score"
                      className="mb-4 rounded-lg p-[1.4rem] placeholder:text-[#AAAAAA]"
                      placeholder="ACT Score"
                      name="act_score"
                      type="number"
                      value={values.act_score}
                      onChange={handleChange}
                      touched={touched.act_score}
                      error={errors.act_score}
                    />
                    <Input
                      label="SAT Score"
                      className="mb-4 rounded-lg p-[1.4rem] placeholder:text-[#AAAAAA]"
                      placeholder="SAT Score"
                      name="sat_score"
                      type="number"
                      value={values.sat_score}
                      onChange={handleChange}
                      touched={touched.sat_score}
                      error={errors.sat_score}
                    />
                    <Input
                      label="GPA"
                      className="mb-4 rounded-lg p-[1.4rem] placeholder:text-[#AAAAAA]"
                      placeholder="GPA"
                      name="gpa"
                      type="number"
                      value={values.gpa}
                      onChange={handleChange}
                      touched={touched.gpa}
                      error={errors.gpa}
                    />
                  </div>
              </SectionContainer>

              <SectionContainer title="About Your Guardian" titleClass={cn(spaceGrotesk.className,"mt-6")}>
                  <div className="grid grid-cols-1 gap-x-4 md:grid-cols-3 md:gap-x-8 lg:grid-cols-">
                    <Input
                      label="Guardian First name"
                      className="mb-4 rounded-lg p-[1.4rem] placeholder:text-[#AAAAAA]"
                      placeholder="Enter your guardian's first name"
                      name="guardian_first_name"
                      value={values.guardian_first_name}
                      onChange={handleChange}
                      touched={touched.guardian_first_name}
                      error={errors.guardian_first_name}
                    />
                    <Input
                      label="Guardian Last name"
                      className="mb-4 rounded-lg p-[1.4rem] placeholder:text-[#AAAAAA]"
                      placeholder="Enter your guardian's last name"
                      name="guardian_last_name"
                      value={values.guardian_last_name}
                      onChange={handleChange}
                      touched={touched.guardian_last_name}
                      error={errors.guardian_last_name}
                    />
                    <Input
                      label="Email Address"
                      className="mb-4 rounded-lg p-[1.4rem] placeholder:text-[#AAAAAA]"
                      placeholder="Enter your guardian's email"
                      type="email"
                      name="guardian_email"
                      value={values.guardian_email}
                      onChange={handleChange}
                      touched={touched.guardian_email}
                      error={errors.guardian_email}
                    />
                  </div>
              </SectionContainer>
            </div>

            <OnboardingFooter
              prevPageHandler={() => {}}
              nextPageHandler={handleSubmit}
              preventGoBack={true}
              useSteppedWizard={!profileComplete}
              loading={isAddingVitals || isSuccess}
            />
          </form>
        </div>
      </PageContent>
    </>
  );
}
