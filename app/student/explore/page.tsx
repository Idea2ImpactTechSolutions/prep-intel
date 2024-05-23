"use client";
import UsMap from "@/components/UsMap";
import LoadingSpinner from "@/components/loading-spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLazyGetSchoolDataQuery } from "@/redux/services/student/studentApi";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import ReactPaginate from "react-paginate";
import Select from "react-select";
import { toast } from "sonner";
import SchoolView from "../_components/school-view";
import useDelayedFunction from "@/utils/hooks/useDelayedFunction";
import { PageHeading, PageContent } from "@/components/common-page";
import { cn } from "@/lib/utils";

const options = [
  { value: "AL", label: "Alabama" },
  { value: "AK", label: "Alaska" },
  { value: "AZ", label: "Arizona" },
  { value: "AR", label: "Arkansas" },
  { value: "CA", label: "California" },
  { value: "CO", label: "Colorado" },
  { value: "CT", label: "Connecticut" },
  { value: "DE", label: "Delaware" },
  { value: "DC", label: "District of Columbia" },
  { value: "FL", label: "Florida" },
  { value: "GA", label: "Georgia" },
  { value: "HI", label: "Hawaii" },
  { value: "ID", label: "Idaho" },
  { value: "IL", label: "Illinois" },
  { value: "IN", label: "Indiana" },
  { value: "IA", label: "Iowa" },
  { value: "KS", label: "Kansas" },
  { value: "KY", label: "Kentucky" },
  { value: "LA", label: "Louisiana" },
  { value: "ME", label: "Maine" },
  { value: "MD", label: "Maryland" },
  { value: "MA", label: "Massachusetts" },
  { value: "MI", label: "Michigan" },
  { value: "MN", label: "Minnesota" },
  { value: "MS", label: "Mississippi" },
  { value: "MO", label: "Missouri" },
  { value: "MT", label: "Montana" },
  { value: "NE", label: "Nebraska" },
  { value: "NV", label: "Nevada" },
  { value: "NH", label: "New Hampshire" },
  { value: "NJ", label: "New Jersey" },
  { value: "NM", label: "New Mexico" },
  { value: "NY", label: "New York" },
  { value: "NC", label: "North Carolina" },
  { value: "ND", label: "North Dakota" },
  { value: "OH", label: "Ohio" },
  { value: "OK", label: "Oklahoma" },
  { value: "OR", label: "Oregon" },
  { value: "PA", label: "Pennsylvania" },
  { value: "RI", label: "Rhode Island" },
  { value: "SC", label: "South Carolina" },
  { value: "SD", label: "South Dakota" },
  { value: "TN", label: "Tennessee" },
  { value: "TX", label: "Texas" },
  { value: "UT", label: "Utah" },
  { value: "VT", label: "Vermont" },
  { value: "VA", label: "Virginia" },
  { value: "WA", label: "Washington" },
  { value: "WV", label: "West Virginia" },
  { value: "WI", label: "Wisconsin" },
  { value: "WY", label: "Wyoming" },
];

export default function Page() {
  const [getSchoolData, { isLoading, isFetching }] = useLazyGetSchoolDataQuery();
  const [activeSelection, setActiveSelection] = useState<any[]>([]);
  const [activeStates, setActiveStates] = useState<string[]>([]);
  const [activeSchoolId, setActiveSchoolId] = useState("");
  const [schools, setSchools] = useState<any[]>([]);
  const [pageCount, setPageCount] = useState(0);
  const [page, setPage] = useState(0);
  const [schoolCount, setSchoolCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const itemsPerPage = 18;

  const { delayedFunction } = useDelayedFunction(500);

  function selectChanged(selected, e: any) {
    switch (e.action) {
      case "remove-value":
        setActiveStates([...activeStates.filter((st) => st !== e.removedValue.value)]);
        break;
      case "select-option":
        setActiveStates([...activeStates, e.option.value]);
        break;
    }
  }

  const fetchSchoolData = async () => {
    setSchools([]);
    try {
      const result = await getSchoolData({ states: activeStates.join(","),searchTerm:'', page: page + 1, pageSize: itemsPerPage }).unwrap();
      const { schools, totalPages, totalItems } = result.data;
      setSchools(schools);
      setPageCount(totalPages);
      setSchoolCount(totalItems);
    } catch (error) {
      toast.error("There was a problem fetching school data:");
    }
  };

  const handleSearch = useCallback(async (searchTerm: string) => {
    setSchools([]);
    try {
      const result = await getSchoolData({ states: activeStates.join(","), searchTerm, page: page + 1, pageSize: itemsPerPage }).unwrap();
      const { schools, totalPages, totalItems } = result.data;
      setSchools(schools);
      setPageCount(totalPages);
      setSchoolCount(totalItems);
    } catch (error) {
      toast.error("There was a problem fetching school data:");
    }
  }, [activeStates, page, itemsPerPage, getSchoolData]);

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchText = e.target.value;
    setSearchTerm(searchText);
    if (!searchText) {
      fetchSchoolData();
      return;
    }
    delayedFunction(() => handleSearch(searchText));
  };

  useEffect(() => {
    if (activeStates.length > 0) {
      fetchSchoolData();
    }
  }, [page]);

  useEffect(() => {
    const activeItems = options.filter((opt) =>
      activeStates.includes(opt.value)
    );
    setActiveSelection(activeItems);
  }, [activeStates]);

  if (activeSchoolId) {
    return <SchoolView schoolId={activeSchoolId} goBack={() => setActiveSchoolId("")} />
  }

  return (
    <>
      <PageHeading
        title="Select the states you would like to explore"
        subtitle="Discover your ideal university match here."
      />
      <PageContent className="!pt-0" >

      <div className="w-full flex pt-4 items-end">
        <div >
          <h2>State</h2>
          <Select instanceId="state-select"
            options={options}
            isMulti
            value={activeSelection}
            onChange={selectChanged}
            className="w-full md:w-[600px]"
          />
        </div>

        <span className="flex-1"></span>

        <Button
          type="button"
          variant="default"
          loadingText="Search..."
          loading={isLoading || isFetching}
          onClick={() => fetchSchoolData()}
        >
          Search
        </Button>
      </div>

      <div className={cn(
        "w-full min-h-[200px] p-2 md:px-10 lg:px-20",
        (isLoading || schools?.length) && "md:px-40 lg:px-80")} >
        <UsMap
          activeStates={activeStates}
          setActiveStates={setActiveStates}
        />
      </div>

      {schools?.length ?
        <div className="space-y-1 my-3">
          <h2 className="font-semibold">{schoolCount} Universit{schoolCount === 1 ? 'y' : 'ies'} Found</h2>
          <p className="text-sm text-gray-500">Explore {schools?.length} top universit{schoolCount === 1 ? 'y' : 'ies'}</p>
        </div> : null}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end">
        <div className="hidden relative md:flex">
          {
            schools?.length ? <>
              <Search width={15} height={15} className="text-[#AAAAAA] absolute left-3 top-1/2 transform -translate-y-1/2" />
              <Input
                placeholder="Search schools by name"
                containerClass="mb-0"
                className="rounded-lg p-[1rem] pl-8 placeholder:text-[#AAAAAA]"
                onChange={handleOnChange}
                value={searchTerm}
              /></> : null
          }
        </div>
      </div>

      {
        (isLoading || isFetching) ? <LoadingSpinner className="h-[250px]" /> :
          <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-3 mt-5">
            {schools?.length
              ? schools.map((school, index) => (
                <li key={index} className="flex rounded bg-slate-50 relative justify-center items-center text-sm w-[200px] h-[150px] p-6 m-1 border border-red">
                  <Link href='#' onClick={() => setActiveSchoolId(school.id)}>
                    {school.name}
                  </Link>
                  <div className="absolute right-3 bottom-3 text-slate-400">
                    {school.school_address.state}
                  </div>
                </li>
              ))
              : null}
          </ul>
      }

      {
        schools?.length ?
          <div className="flex mt-5">
            <ReactPaginate
              activeClassName={"flex items-center justify-center text-primary border border-primary rounded- p- h-8 w-8"}
              breakClassName={"item break-me "}
              breakLabel={"..."}
              containerClassName={"w-full flex justify-center items-center p-4 gap-x-4"}
              disabledClassName={"bg-primary/80"}
              forcePage={page}
              marginPagesDisplayed={2}
              onPageChange={(event: any) => setPage(event.selected)}
              nextClassName={"bg-primary text-white h-9 w-9 flex justify-center items-center rounded-sm"}
              nextLabel={<ChevronRight className="text-sm" />}
              pageCount={pageCount}
              pageClassName={"item pagination-pagehave"}
              pageRangeDisplayed={2}
              previousClassName={"bg-primary text-white h-9 w-9 flex justify-center items-center rounded-sm"}
              previousLabel={<ChevronLeft className="text-sm" />}
            />
          </div> : null
      }
    </PageContent>
    </>
  );
}
