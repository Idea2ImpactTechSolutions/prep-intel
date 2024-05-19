"use client"
import { useState } from "react";
import OnboardingFooter from "@/app/student/_components/onboarding-footer";
import CustomCheckbox from "@/components/custom-checkbox";
import SectionContainer from "@/components/section-container";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
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
  const [selectedActivities, setSelectedActivities] = useState({});
  const [customActivities, setCustomActivities] = useState([]);
  const [newActivity, setNewActivity] = useState("");

  const handleCheckboxClick = (id) => {
    setSelectedActivities((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleAddCustomActivity = () => {
    if (newActivity.trim() !== "") {
      const newCustomActivity = {
        id: `custom-${customActivities.length + 1}`,
        name: newActivity,
        category: "Custom",
        description: newActivity,
        checked: true,
        onClick: () => handleCheckboxClick(`custom-${customActivities.length + 1}`)
      };
      setCustomActivities((prev) => [...prev, newCustomActivity]);
      setSelectedActivities((prev) => ({
        ...prev,
        [`custom-${customActivities.length + 1}`]: true
      }));
      setNewActivity("");
    }
  };
  // Filter extracurricular activities based on search term and limit to 10 results
  const filteredActivities = EXTRACURRICULAR_ACTIVITIES.filter(activity =>
    activity.name.toLowerCase().includes(searchTerm.toLowerCase())
  ).slice(0, 10);

  // Function to get activities by category
  const getActivitiesByCategory = (category) => {
    return EXTRACURRICULAR_ACTIVITIES.filter(activity => activity.category === category).slice(0, 4);
  };

  return (
    <form>
      <div className="flex-1 px-6 md:px-12 lg:px-20">
        <Input
          label="Search Extracurricular Activities"
          placeholder="ex. Computer Science"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-6"
        />
        {searchTerm && (
          <SectionContainer title="Search Results">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-x-8">
              {filteredActivities.map(({ id, name, icon }) => (
                <CustomCheckbox
                  key={id}
                  id={id}
                  label={name}
                  icon={icon}
                  hasBorder
                  checked={selectedActivities[id] || false}
                  onClick={() => handleCheckboxClick(id)}
                />
              ))}
            </div>
          </SectionContainer>
        )}
        {categories.map((category) => (
          <SectionContainer key={category} title={category} className="mt-8">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-x-8">
              {getActivitiesByCategory(category).map(({ id, name, icon }) => (
                <CustomCheckbox
                  key={id}
                  id={id}
                  label={name}
                  icon={icon}
                  hasBorder
                  checked={selectedActivities[id] || false}
                  onClick={() => handleCheckboxClick(id)}
                />
              ))}
            </div>
          </SectionContainer>
        ))}
        {customActivities.length > 0 && (
          <SectionContainer title="Custom Activities" className="mt-8">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-x-8">
              {customActivities.map(({ id, name }) => (
                <CustomCheckbox
                  key={id}
                  id={id}
                  label={name}
                  hasBorder
                  checked={selectedActivities[id] || false}
                  onClick={() => handleCheckboxClick(id)}
                />
              ))}
            </div>
          </SectionContainer>
        )}
        <SectionContainer title="Add Custom Activity" className="mt-8">
          <div>
          <Input
            label="Custom Activity"
            placeholder="Enter custom activity"
            value={newActivity}
            onChange={(e) => setNewActivity(e.target.value)}
            className="mb-4"
          />
          <button type="button" onClick={handleAddCustomActivity}>
            Add Custom Activity
          </button>
          </div>
        </SectionContainer>
        {/* <SectionContainer title="Other" className="mt-8">
          <CustomCheckbox
            label="I am undecided on what school"
            id="undecided"
            hasBorder
            checked={selectedActivities["undecided"] || false}
            onClick={() => handleCheckboxClick("undecided")}
          />
        </SectionContainer> */}
      </div>
      <OnboardingFooter
        prevPageHandler={() => router.push('/student/onboarding/majors')}
        nextPageHandler={() => router.push('/student/onboarding/transcripts')}
        preventGoBack={false}
      />
    </form>
  );
}
