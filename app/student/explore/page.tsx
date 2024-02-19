"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Select from 'react-select'
import UsMap from "@/components/UsMap"
import { Button } from "@/components/ui/button";

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
  const router = useRouter();
  const [activeSelection, setActiveSelection] = useState<any[]>([]);
  const [activeStates, setActiveStates] = useState<string[]>([]);

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
    <div className="container p-6 mt-6">
      <h1 className="text-2xl font-bold mb-4">Select the states you would like to explore</h1>

      <UsMap activeStates={activeStates} setActiveStates={setActiveStates} ></UsMap>

      <h2>Select State</h2>
      <div className="flex">

        <Select instanceId="state-select"
          options={options}
          isMulti
          value={activeSelection}
          onChange={selectChanged}
          className="w-[400px]" />

        <div className="flex-grow"></div>

        <Button
          type="button"
          variant="default"
          onClick={() => router.push(`/student/explore-schools?states=${activeSelection.map(s => s.value).join(',')}`)}
        >
          Next
        </Button>

      </div>
    </div>
  );
}