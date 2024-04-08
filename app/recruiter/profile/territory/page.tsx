"use client";
import React, { useEffect, useState } from "react";
import Select from 'react-select'
import UsMap from "@/components/UsMap"
import { Button } from "@/components/ui/button";
import { useSetTerritoriesMutation, useLazyGetRecruiterQuery } from "@/redux/services/recruiter/recruiterApi";
import LoadingSpinner from "@/components/loading-spinner";
import { useSession } from "next-auth/react";

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

  const session = useSession();

  const recruiterId = session?.data?.user?.roleId || "57e2c5c8-a963-4713-a4d8-e832e79b48e4";

  async function handleSetTerritories() {
    const payload = {
      id: recruiterId,
      territories: activeStates
    }

    // Invoke mutation and store latest territory changes
    setTerritories(payload)
      .unwrap()
      .then((payload) => {
        // Reload to confirm
        loadRecruiter()
      })
  }

  async function loadRecruiter() {
    const recruiter = await getRecruiter({id: recruiterId});
    const territories = recruiter.data?.data?.territories;
    setActiveStates(territories);
  }

  // Onload
  useEffect(()=> {
    loadRecruiter();
  },[]);


  useEffect(()=> {
    const activeItems = options.filter(opt => activeStates.includes(opt.value));
    setActiveSelection(activeItems);
  },[activeStates]);

  function selectChanged(selected, e: any) {
    switch(e.action) {
      case 'remove-value':
        setActiveStates([...activeStates.filter(st => st !== e.removedValue.value)]);
        break;
      case 'select-option':
        setActiveStates([...activeStates, e.option.value]);
        break;
      }
  }

  return (
    <div className="pi-container mt-6">
      <h1 className="text-2xl font-bold mb-4">My Territories</h1>

      <UsMap activeStates={activeStates} setActiveStates={setActiveStates} ></UsMap>
      { isLoading && <LoadingSpinner />}
      { !isLoading &&
      <>
        <h2>Select State</h2>
        <div className="flex">
          <Select instanceId="state-select"
            options={options}
            isMulti
            value={activeSelection}
            isDisabled={isSaving}
            onChange={selectChanged}
            className="w-[400px]" />

          <div className="flex-grow"></div>

          <Button
            type="button"
            variant="default"
            onClick={handleSetTerritories}
          >
            Save
          </Button>

        </div>
      </>
      }
    </div>
  );
}