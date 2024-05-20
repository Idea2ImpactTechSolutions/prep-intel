"use client"
import OnboardingFooter from "@/app/student/_components/onboarding-footer";
import CustomCheckbox from "@/components/custom-checkbox";
import SectionContainer from "@/components/section-container";
import LoadingSpinner from "@/components/loading-spinner";

import { Input } from "@/components/ui/input";

import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { useAddStudentExtracurricularMutation, useLazyGetStudentExtracurricularQuery } from "@/redux/services/student/studentApi";
import { Button } from "@/components/ui/button";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import OnboardingTabs from "../../_components/onboarding-tabs";
import OnboardingTitle from "../../_components/onboarding-title";

import EXTRACURRICULAR_ACTIVITIES from "../../../../data/extracurricular.json";

const categories = [
  "Sports",
  "Arts",
  "Academic Clubs",
  "Community Service",
  "Cultural Clubs",
  "Technology",
  "Leadership",
  "Music and Performance",
  "Special Interest"
];

export default function ExtracurricularPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedExtracurriculars, setSelectedExtracurriculars] = useState<string[]>([]);
  const [customExtracurricular, setCustomExtracurricular] = useState([]);
  const [newExtracurricular, setNewExtracurricular] = useState("");
  const [pageUpdatedFlag, setPageUpdatedFlag] = useState(false); //used to track if activities are added or not. if not updated we dont call the backend
  const [addStudentExtracurriculars, { isLoading: isAddingStudentExtracurricular }] = useAddStudentExtracurricularMutation()
  const [getStudentExtracurriculars, { isLoading: isGettingStudentExtracurricular, isFetching: isFetchingStudentExtracurricular }] = useLazyGetStudentExtracurricularQuery()

  const { data } = useSession()
  const studentId = data?.user?.roleId

    // fetch student interested schools
    const handleGetStudenExtracurriculars = async (studentId) => {
      getStudentExtracurriculars(studentId)
        .unwrap()
        .then(body => {
          const existingExtracurriculars = body.data;
          setSelectedExtracurriculars([...selectedExtracurriculars, ...existingExtracurriculars])
        })
    }
  
    // submit student majors
    const handleSubmitExtracurriculars = async () => {
      if(pageUpdatedFlag == true){
        addStudentExtracurriculars({ data: selectedExtracurriculars, studentId: studentId })
        .unwrap()
        .then(data => {
          toast.success('Record submitted successfully')
          router.push('/student/onboarding/transcripts')
        })

      }else{
        router.push('/student/onboarding/transcripts')
      }
   
    }
  

  // handle school change
  const handleSelectExtracurricular = useCallback((activity) => {
    const index = selectedExtracurriculars.findIndex((s) => s === activity);
    if (index === -1) {
      // Add the item to the list
      setSelectedExtracurriculars([...selectedExtracurriculars, activity]);
    } else {
      // Remove the item from the list
      setSelectedExtracurriculars(selectedExtracurriculars.filter(m => m != activity));
    }
    setPageUpdatedFlag(true);
  }, [selectedExtracurriculars]);

    // handle custom extracurricular
    const handleAddCustomExtracurricular = useCallback((activity) => {
      if(activity.trim() !== ""){
        const index = selectedExtracurriculars.findIndex((s) => s === activity);
        if (index === -1 ) {
          // Add the item to the list
          setSelectedExtracurriculars([...selectedExtracurriculars, activity]);
          setCustomExtracurricular([]);
        }
        setPageUpdatedFlag(true);
      }
    
    }, [selectedExtracurriculars]);
  

  // Filter extracurricular activities based on search term and limit to 10 results
  const filteredActivities = EXTRACURRICULAR_ACTIVITIES.filter(extracurricular =>
    extracurricular.name.toLowerCase().includes(searchTerm.toLowerCase())
  ).slice(0, 10);

  // Function to get activities by category
  const getActivitiesByCategory = (category) => {
    return EXTRACURRICULAR_ACTIVITIES.filter(extracurricular => extracurricular.category === category).slice(0, 4);
  };
  useEffect(() => {
    if (studentId) {
      handleGetStudenExtracurriculars(studentId)
    }
  }, [studentId])

  if (isGettingStudentExtracurricular || isFetchingStudentExtracurricular) {
    return <LoadingSpinner />
  }

  return (
    <>
    <OnboardingTabs active_step="Extracurricular" />
    <div className="overflow-y-auto pb-32 h-[calc(100vh_-_10rem)]">
      <OnboardingTitle
          title="Choose your interested Extracurricular Activities"
          subtitle="How do you pass time?"
      />
      <div className="mt-10">
        <form>
          <div className="flex-1 px-6 md:px-12 lg:px-20">
          <SectionContainer
                title="What activities do you participate in?"
          >
                <>
              <Input
              label="Search Extracurricular Activities"
              placeholder="ex. ROTC"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mb-6"
            />
                  <SectionContainer title="Add Custom Extracurricular" className="mt-8">
          <div>
          
          {/* Custom Extracurricular input box */}
          <Input
            label="Custom Extracurricular"
            placeholder="Enter custom extracurricular"
            value={newExtracurricular}
            onChange={(e) => setNewExtracurricular(e.target.value)}
            className="mb-4"
          />

           {/* Custom Extracurricular button */}
          
        <Button className="bg-[#FEBB0E] border-[#FEBB0E] text-black "
          onClick={() =>handleAddCustomExtracurricular(newExtracurricular)}
            type="button"
            variant="outline"
          >
            Add Custom Extracurricular
        </Button>
          </div>
        </SectionContainer>
            <SectionContainer
              className="my-6"
              title="Selected Activities"
              titleClass="mb-1 md:text-sm"
              >
                <>
                {selectedExtracurriculars?.length ?
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-x-8">
                    {
                      selectedExtracurriculars.map((item) => (
                      <CustomCheckbox
                              key={item}
                              id={item}
                              label={item}
                              hasBorder
                              className="rounded-lg p-[1.4rem"
                              checked={true}
                              onClick={() => handleSelectExtracurricular(item)}
                            />
                          ))
                        }
                      </div> : <div className="border border-dashed rounded-sm p-6 text-sm text-center">
                        No Activities Selected
                      </div>}
                    </>
                  </SectionContainer>
        
             {/* Search bar section */}
            {searchTerm && (
            <SectionContainer title="Search Results">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-x-8">
                {filteredActivities.map(({ id, name }) => (
                <CustomCheckbox
                  key={name}
                  id={name}
                  label={name}
                  hasBorder
                  className="rounded-lg p-[1.4rem"
                  onClick={() => handleSelectExtracurricular(name)}
                  checked={selectedExtracurriculars.some((s) => s === name)}

                  />
                ))}
                </div>
                </SectionContainer>
              )}

               {/* Section that previews category and a few choices from each
                    Currently showing 4 for each category to keep page from getting 
                    real busy.   */}
              {categories.map((category) => (
              <SectionContainer key={category} title={category} className="mt-8">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-x-8">
                  {getActivitiesByCategory(category).map(({ id, name }) => (
                  <CustomCheckbox
                  key={name}
                  id={name}
                  label={name}
                  hasBorder
                  className="rounded-lg p-[1.4rem"
                  onClick={() => handleSelectExtracurricular(name)}
                  checked={selectedExtracurriculars.some((s) => s === name)}
                />
              ))}
            </div>
          </SectionContainer>
        ))}

        {customExtracurricular.length > 0 && (
          <SectionContainer title="Custom Activities" className="mt-8">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-x-8">
              {customExtracurricular.map(({ id, name }) => (
                <CustomCheckbox
                  key={name}
                  id={name}
                  label={name}
                  hasBorder
                  className="rounded-lg p-[1.4rem"
                  onClick={() => handleSelectExtracurricular(name)}
                  checked={true}

                />
              ))}
            </div>
          </SectionContainer>
        )}
  
        </>
        </SectionContainer>
      </div>
      <OnboardingFooter
        prevPageHandler={() => router.push('/student/onboarding/majors')}
        nextPageHandler={() => handleSubmitExtracurriculars()}
        preventGoBack={false}
        loading={isAddingStudentExtracurricular}
      />
    </form>
    </div>
    </div>
    </>
  )
}
