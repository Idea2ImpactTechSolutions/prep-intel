"use client";
import UsMap from "@/components/UsMap";
import { Button } from "@/components/ui/button";
import { useLazyGetSchoolDataQuery } from "@/redux/services/student/studentApi";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";
import ReactPaginate from 'react-paginate';
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

  const [getSchoolData,{isLoading, isFetching}] = useLazyGetSchoolDataQuery();

  const [activeSelection, setActiveSelection] = useState<any[]>([]);
  const [activeStates, setActiveStates] = useState<string[]>([]);
  const [schools, setSchools] = useState<any[]>([]);
  const [itemOffset, setItemOffset] = useState(0);
  const itemsPerPage = 30
  const {data: session}: any = useSession()

  const endOffset = itemOffset + itemsPerPage;
  const currentSchools = useMemo(()=>(schools?.slice(itemOffset, endOffset)), [schools]);
  const pageCount = Math.ceil(schools?.length / itemsPerPage);


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

  const fetchSchoolData = async (states: string) => {
    setSchools([]);
    try {
      const response = await getSchoolData(states).unwrap()
      setSchools(response);
    } catch (error) {
      toast.error("There was a problem fetching school data:");
    }
  };

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % schools?.length;
    setItemOffset(newOffset);
  };

  useEffect(()=> {
    const activeItems = options.filter(opt => activeStates.includes(opt.value));
    setActiveSelection(activeItems);
  },[activeStates]);

  return (
    <div className="pi-container mt-6">
      <h1 className="text-lg md:text-2xl font-bold mb-4">Select the states you would like to explore</h1>
      <div className="w-full overflow-x-auto">
        <div className="w-full">
          <UsMap activeStates={activeStates} setActiveStates={setActiveStates} ></UsMap>
        </div>
      </div>

      <div className="w-full md:w-fit flex flex-col md:flex-row items-end gap-2">
        <div className="w-full space-y-2">
          <h2>Select State</h2>
          <Select instanceId="state-select"
            options={options}
            isMulti
            value={activeSelection}
            onChange={selectChanged}
            className="w-full md:w-[400px]" 
          />
        </div>

        <Button
          type="button"
          variant="default"
          loading={isLoading ||isFetching}
          onClick={() => fetchSchoolData(activeSelection.map(s => s.value).join(','))}
        >
          Search
        </Button>

      </div>

      <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-3 mt-5">
        {
          currentSchools?.length ? currentSchools.map((school, index) => (
            <li key={index} className="flex rounded bg-slate-50 relative justify-center items-center text-sm w-[200px h-[150px] p-6 m-1 border border-red" >
              {school.instnm}
              <div className="absolute right-3 bottom-3 text-slate-400">{school.stabbr}</div>
            </li>
          )):null
        }
      </ul>

      {
        currentSchools?.length? 
          <div className="flex mt-5">
            <ReactPaginate
              activeClassName={'flex items-center justify-center text-primary border border-primary rounded- p- h-8 w-8'}
              breakClassName={'item break-me '}
              breakLabel={'...'}
              containerClassName={'w-full flex justify-center items-center p-4 gap-x-4'}
              disabledClassName={'bg-primary/80'}
              marginPagesDisplayed={2}
              onPageChange={handlePageClick}
              nextClassName={"bg-primary text-white h-9 w-9 flex justify-center items-center rounded-sm"}
              nextLabel={<ChevronRight className="text-sm"/>}
              pageCount={pageCount}
              pageClassName={'item pagination-pagehave'} 
              pageRangeDisplayed={2}
              previousClassName={"bg-primary text-white h-9 w-9 flex justify-center items-center rounded-sm"}
              previousLabel={<ChevronLeft className="text-sm" />}
            />
          </div>: null
      }
    </div>
  );
}