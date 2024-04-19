"use client"
import OnboardingFooter from "@/app/student/_components/onboarding-footer";
import CustomDatePicker from "@/components/custom-date-picker";
import SectionContainer from "@/components/section-container";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import OnboardingTabs from "../../_components/onboarding-tabs";
import OnboardingTitle from "../../_components/onboarding-title";
import { Space_Grotesk } from "next/font/google";
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"] });

export default function VitalsPage() {

  const router = useRouter()

  return (
    <>
      <OnboardingTabs active_step="Vitals" />
      <div className="overflow-y-auto pb-32 h-[calc(100vh_-_10rem)]">
        <OnboardingTitle
          title="Complete Your Profile"
          subtitle="Please take a few minutes to fill in your profile so we can customize the opportunities for you."
        />
        <div className="mt-16">
          <form>
            <div className="flex-1 px-6 md:px-12 lg:px-20">
              <SectionContainer
                title="About You"
                subTitle=""
                titleClass={cn(
                  spaceGrotesk.className,
                  "mb-0"
                )}
              >
                <div className="pt-6">
                  <div className="grid grid-cols-1 gap-x-4 md:grid-cols-2 md:gap-x-8 lg:grid-cols-">
                    <Input
                      label="First Name"
                      className="mb-4 rounded-lg p-[1.4rem] placeholder:text-[#AAAAAA]' md:mb-6"
                      placeholder="Enter your first name"
                    />
                    <Input
                      label="Last Name"
                      className="mb-4 rounded-lg p-[1.4rem] placeholder:text-[#AAAAAA]' md:mb-6"
                      placeholder="Enter your last name"
                    />
                    <CustomDatePicker
                      label="Birth Date"
                      className="mb-4"
                      inputClass="rounded-lg p-[.8rem] placeholder:text-[#AAAAAA]' md:mb-6"
                      handleChange={() => null}
                    />
                    <Input
                      label="Expected Graduation Year"
                      className="mb-4 rounded-lg p-[1.4rem] placeholder:text-[#AAAAAA]' md:mb-6"
                      placeholder="2023"
                      type=""
                    />
                    <Input
                      label="City"
                      className="mb-4 rounded-lg p-[1.4rem] placeholder:text-[#AAAAAA]' md:mb-6"
                      placeholder="Enter your city"
                    />
                    <Input
                      label="State"
                      className="mb-4 rounded-lg p-[1.4rem] placeholder:text-[#AAAAAA]' md:mb-6"
                      placeholder="Enter your state"
                    />
                  </div>
                </div>
              </SectionContainer>

              <SectionContainer
                title="About Your Gaurdian"
                subTitle=""
                titleClass={cn(
                  spaceGrotesk.className,
                  "mb-0"
                )}
              >
                <>
                  <div className="pt-6 grid grid-cols-1 gap-x-4 md:grid-cols-2 md:gap-x-8 lg:grid-cols-">
                    <Input
                      label="Guardian First name"
                      className="mb-4 rounded-lg p-[1.4rem] placeholder:text-[#AAAAAA]' md:mb-6"
                      placeholder="Enter your guardian's first name"
                    />
                    <Input
                      label="Guardian Last name"
                      className="mb-4 rounded-lg p-[1.4rem] placeholder:text-[#AAAAAA]' md:mb-6"
                      placeholder="Enter your guardian's last name"
                    />
                  </div>
                    <Input
                      label="Email Address"
                      className="mb-4 rounded-lg p-[1.4rem] placeholder:text-[#AAAAAA]' md:mb-6"
                      placeholder="Enter your guardian's email"
                      type="email"
                    />
                </>
              </SectionContainer>
            </div>
            <OnboardingFooter
              prevPageHandler={() => router.push('/register')}
              nextPageHandler={() => router.push('/student/onboarding/schools')}
            />
          </form>
        </div>
      </div>
    </>
  );
}
