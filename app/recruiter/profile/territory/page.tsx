"use client";
import UsMap from "@/components/UsMap";
import LoadingSpinner from "@/components/loading-spinner";
import { PageHeader, PageContent } from "@/components/common-page";
import { Button } from "@/components/ui/button";
import { useLazyGetRecruiterQuery, useSetTerritoriesMutation } from "@/redux/services/recruiter/recruiterApi";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Select from 'react-select';
import { toast } from "sonner";

const options = [
  { "value": "AL", "label": "Alabama" },
  { "value": "AK", "label": "Alaska" },
  { "value": "AZ", "label": "Arizona" },
  { "value": "AR", "label": "Arkansas" },
  { "value": "CA", "label": "California" },
  { "value": "CO", "label": "Colorado" },
  { "value": "CT", "label": "Connecticut" },
  { "value": "DE", "label": "Delaware" },
  { "value": "DC", "label": "District of Columbia" },
  { "value": "FL", "label": "Florida" },
  { "value": "GA", "label": "Georgia" },
  { "value": "HI", "label": "Hawaii" },
  { "value": "ID", "label": "Idaho" },
  { "value": "IL", "label": "Illinois" },
  { "value": "IN", "label": "Indiana" },
  { "value": "IA", "label": "Iowa" },
  { "value": "KS", "label": "Kansas" },
  { "value": "KY", "label": "Kentucky" },
  { "value": "LA", "label": "Louisiana" },
  { "value": "ME", "label": "Maine" },
  { "value": "MD", "label": "Maryland" },
  { "value": "MA", "label": "Massachusetts" },
  { "value": "MI", "label": "Michigan" },
  { "value": "MN", "label": "Minnesota" },
  { "value": "MS", "label": "Mississippi" },
  { "value": "MO", "label": "Missouri" },
  { "value": "MT", "label": "Montana" },
  { "value": "NE", "label": "Nebraska" },
  { "value": "NV", "label": "Nevada" },
  { "value": "NH", "label": "New Hampshire" },
  { "value": "NJ", "label": "New Jersey" },
  { "value": "NM", "label": "New Mexico" },
  { "value": "NY", "label": "New York" },
  { "value": "NC", "label": "North Carolina" },
  { "value": "ND", "label": "North Dakota" },
  { "value": "OH", "label": "Ohio" },
  { "value": "OK", "label": "Oklahoma" },
  { "value": "OR", "label": "Oregon" },
  { "value": "PA", "label": "Pennsylvania" },
  { "value": "RI", "label": "Rhode Island" },
  { "value": "SC", "label": "South Carolina" },
  { "value": "SD", "label": "South Dakota" },
  { "value": "TN", "label": "Tennessee" },
  { "value": "TX", "label": "Texas" },
  { "value": "UT", "label": "Utah" },
  { "value": "VT", "label": "Vermont" },
  { "value": "VA", "label": "Virginia" },
  { "value": "WA", "label": "Washington" },
  { "value": "WV", "label": "West Virginia" },
  { "value": "WI", "label": "Wisconsin" },
  { "value": "WY", "label": "Wyoming" },
];

export default function Page() {
  const [activeSelection, setActiveSelection] = useState<any[]>([]);
  const [activeStates, setActiveStates] = useState<string[]>([]);
  const [setTerritories, { isLoading: isSaving }] = useSetTerritoriesMutation();
  const [getRecruiter, { isLoading }] = useLazyGetRecruiterQuery();
  const router = useRouter()

  const session = useSession();
  const recruiterId = session?.data?.user?.roleId;

  async function handleSetTerritories() {
    const payload = {
      id: recruiterId,
      territories: activeStates
    }

    // Invoke mutation and store latest territory changes
    setTerritories(payload)
      .unwrap()
      .then((payload) => {
        if(payload?.status === 200){
          toast.success(payload.message)
          loadRecruiter()
          router.refresh()
        }
      }).catch((error:any) => {toast.error(error.message)})
  }

  async function loadRecruiter() {
    const recruiter = await getRecruiter({id: recruiterId});
    const territories = recruiter.data?.data?.territories;
    setActiveStates(territories || []);
  }

  // Onload
  useEffect(()=> {
    if(recruiterId){
      loadRecruiter();
    }
  },[recruiterId]);


  useEffect(()=> {
    const activeItems = options.filter(opt => activeStates.includes(opt.value));
    setActiveSelection(activeItems);
  },[activeStates]);

  function selectChanged(selected, e: any) {
    switch(e.action) {
      case "clear":
        setActiveStates([]);
        break;
      case 'remove-value':
        setActiveStates([...activeStates.filter(st => st !== e.removedValue.value)]);
        break;
      case 'select-option':
        setActiveStates([...activeStates, e.option.value]);
        break;
      }
  }

  return (
    <>
    <PageHeader title="My Territories" />
    <PageContent>
      <div>
        { isLoading ? <LoadingSpinner className="mt-5 h-full"/> : (<>
          <h2>States</h2>
          <div className="flex flex-col md:flex-row gap-y-3">
            <Select instanceId="state-select"
              options={options}
              isMulti
              value={activeSelection}
              isDisabled={isSaving}
              onChange={selectChanged}
              className="w-full md:w-[60%]" />

            <div className="flex-grow"></div>

            <Button
              type="button"
              variant="default"
              loading={isSaving}
              loadingText="Updating..."
              onClick={handleSetTerritories}
            >
              Save
            </Button>

          </div>
        </>)
        }
      </div>
      <div className="w-full min-h-[200px] p-2 md:px-10 lg:px-20">
        <UsMap activeStates={activeStates} setActiveStates={setActiveStates} ></UsMap>
      </div>
    </PageContent>
    </>
  );
}