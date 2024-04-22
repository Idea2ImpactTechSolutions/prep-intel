"use client"
import OnboardingFooter from "@/app/student/_components/onboarding-footer";
import CustomDatePicker from "@/components/custom-date-picker";
import SectionContainer from "@/components/section-container";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useAddStudentVitalsMutation, useLazyGetStudentVitalsQuery } from "@/redux/services/student/studentApi";
import { formatRMDatePicker } from "@/utils/helpers/date-format";
import { useFormik } from "formik";
import { useSession } from "next-auth/react";
import { Space_Grotesk } from "next/font/google";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import * as yup from "yup";
import OnboardingTabs from "../../_components/onboarding-tabs";
import OnboardingTitle from "../../_components/onboarding-title";
import LoadingSpinner from "@/components/loading-spinner";
import { toast } from "sonner";
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"] });

export default function VitalsPage() {
  const { data } = useSession()
  const studentId = data?.user?.roleId

  const [studentData, setStudentData] = useState({
    first_name: "",
    last_name: "",
    birth_date: "",
    expected_graduation_year: "",
    state: "",
    city: "",
    high_school: "",
    guardian_first_name: "",
    guardian_last_name: "",
    guardian_email: "",
  })


  const [getStudentVitals, { isLoading, isFetching }] = useLazyGetStudentVitalsQuery()
  const [addStudentVitals, { isLoading: isAddingVitals }] = useAddStudentVitalsMutation()

  const handleGetStudentVitals = async (studentId) => {
    getStudentVitals(studentId)
      .unwrap()
      .then(data => {
        const { city, dob, first_name, graduation_year, guardian_email, guardian_first_name, guardian_last_name, high_school, last_name, state } = data.data
        setStudentData({ ...studentData, city, birth_date: dob, first_name, last_name, expected_graduation_year: graduation_year, state, guardian_email, guardian_first_name, guardian_last_name, high_school })
      })
  }

  const handleFormSubmit = async (values) => {
    addStudentVitals({data: {...values}, studentId: studentId})
    .unwrap()
    .then(data => {
      toast.success("Vitals added successfully")
      router.push("/student/onboarding/schools")
    })
  }

  const router = useRouter()

  const { values, errors, handleSubmit, handleChange, touched, setFieldValue } = useFormik({
    initialValues: studentData,
    validationSchema: yup.object().shape({
      first_name: yup.string().required('first name is required'),
      last_name: yup.string().required('last name is required'),
      birth_date: yup.string().required('date of birth is required'),
      expected_graduation_year: yup.string().min(4, "graduation year must be 4 digits").max(4, "graduation year must be 4 digits").required('graduation year is required'),
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

  if (isLoading || isFetching) {
    return <LoadingSpinner/>
  }

  return (
    <>
      <OnboardingTabs active_step="Vitals" />
      <div className="overflow-y-auto pb-32 h-[calc(100vh_-_10rem)]">
        <OnboardingTitle
          title="Complete Your Profile"
          subtitle="Please take a few minutes to fill in your profile so we can customize the opportunities for you."
        />
        <div className="mt-12">
          <form onSubmit={handleSubmit}>
            <div className="flex-1 px-6 md:px-12 lg:px-20">
              <SectionContainer
                title="About You"
                subTitle=""
                titleClass={cn(
                  spaceGrotesk.className,
                  "mb-0"
                )}
              >
                <div className="pt-3">
                  <div className="grid grid-cols-1 gap-x-4 md:grid-cols-2 md:gap-x-8 lg:grid-cols-">
                    <Input
                      label="First Name"
                      className="rounded-lg p-[1.4rem] placeholder:text-[#AAAAAA]'"
                      placeholder="Enter your first name"
                      name="first_name"
                      value={values.first_name}
                      onChange={handleChange}
                      touched={touched.first_name}
                      error={errors.first_name}
                    />
                    <Input
                      label="Last Name"
                      className="rounded-lg p-[1.4rem] placeholder:text-[#AAAAAA]"
                      placeholder="Enter your last name"
                      name="last_name"
                      value={values.last_name}
                      onChange={handleChange}
                      touched={touched.last_name}
                      error={errors.last_name}
                    />
                    <CustomDatePicker
                      label="Birth Date"
                      className=""
                      inputClass="rounded-lg p-[.8rem] placeholder:text-[#AAAAAA]"
                      handleChange={(selected) => {
                        setFieldValue('birth_date', formatRMDatePicker(selected))
                      }}
                      value={values.birth_date}
                      touched={touched.birth_date}
                      error={errors.birth_date}
                      labelClass="mt-3"
                    />
                    <Input
                      label="Expected Graduation Year"
                      className="rounded-lg p-[1.4rem] placeholder:text-[#AAAAAA]"
                      placeholder="2023"
                      type=""
                      name="expected_graduation_year"
                      value={values.expected_graduation_year}
                      onChange={(e) => {
                        if (!isNaN(Number(e.target.value))){
                            setFieldValue('expected_graduation_year', e.target.value)
                        }
                    }}
                      touched={touched.expected_graduation_year}
                      error={errors.expected_graduation_year}
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
                    <Input
                      label="State"
                      className="rounded-lg p-[1.4rem] placeholder:text-[#AAAAAA]"
                      placeholder="Enter your state"
                      name="state"
                      value={values.state}
                      onChange={handleChange}
                      touched={touched.state}
                      error={errors.state}
                      labelClass="mt-3"
                    />
                  </div>
                  <div className="mt-3">
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

              <SectionContainer
                title="About Your Gaurdian"
                subTitle=""
                titleClass={cn(
                  spaceGrotesk.className,
                  "mt-6"
                )}
              >
                <>
                  <div className="grid grid-cols-1 gap-x-4 md:grid-cols-2 md:gap-x-8 lg:grid-cols-">
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
                  </div>
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
                </>
              </SectionContainer>
            </div>
            <OnboardingFooter
              prevPageHandler={() => router.push('/register')}
              nextPageHandler={handleSubmit}
              loading={isAddingVitals}
            />
          </form>
        </div>
      </div>
    </>
  );
}
