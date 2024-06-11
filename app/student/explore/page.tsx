"use client";
import UsMap from "@/components/UsMap";
import LoadingSpinner from "@/components/loading-spinner";
import { Input } from "@/components/ui/input";
import { useGetSchoolDataQuery } from "@/redux/services/student/studentApi";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import Select from "react-select";
import SchoolView from "../_components/school-view";
import { PageHeader, PageContent } from "@/components/common-page";
import { cn } from "@/lib/utils";
import { statePaths } from "@/data/state-paths";

const options = statePaths
  .sort((a, b) => a.name.localeCompare(b.name))
  .map((e) => ({ value: e.id, label: e.name }));

function useDebouncedValue(inputValue, delay) {
  const [debouncedValue, setDebouncedValue] = useState(inputValue);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(inputValue);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [inputValue, delay]);

  return debouncedValue;
};

export default function Page() {
  const [activeSelection, setActiveSelection] = useState<any[]>([]);
  const [activeStates, setActiveStates] = useState<string[]>([]);
  const [activeSchoolId, setActiveSchoolId] = useState("");
  const [page, setPage] = useState(0);
  const [termText, setTermText] = useState("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const itemsPerPage = 18;
  const debouncedSearchTerm = useDebouncedValue(termText, 500);

  // After debounced search term (termText) settles, update searchTerm variable, kicking off the query
  useEffect(() => {
    setSearchTerm(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  // Bind the getSchoolData query to a given search term, paging data, and selected states
  const { data: response, isLoading, isFetching } = useGetSchoolDataQuery({
    searchTerm,
    states: activeStates.join(","),
    page: page + 1,
    pageSize: itemsPerPage,
  },
  {
    skip: (activeStates.length === 0 && !searchTerm),
  });

  // Destructure the response from getSchoolData, extracting the schools, totalPages,
  // and totalItems into the previously expected local variable names
  const {
    schools = [],
    totalPages: pageCount = 0,
    totalItems: schoolCount = 0
  } = response?.data || {};

  // Update activeStates as the user interacts with the data
  function selectChanged(selected, e: any) {
    switch (e.action) {
      case "clear":
        setActiveStates([]);
        break;
      case "remove-value":
        setActiveStates([...activeStates.filter((st) => st !== e.removedValue.value)]);
        break;
      case "select-option":
        setActiveStates([...activeStates, e.option.value]);
        break;
    }
  }

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTermText(e.target.value);
  };

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
      <PageHeader
        title="Select the states you would like to explore"
        subtitle="Discover your ideal Institution match here."
      />
      <PageContent className="!pt-0" >

      <div className="w-full flex pt-4 items-end">
        <div className=" md:w-[60%]">
          <h2>States</h2>
          <Select instanceId="state-select"
            options={options}
            isMulti
            value={activeSelection}
            onChange={selectChanged}
            className="w-full"
          />
        </div>

        <span className="flex-1"></span>
        <div className="relative md:flex">
          <Search width={15} height={15} className="text-[#AAAAAA] absolute left-3 top-1/2 transform -translate-y-1/2" />
          <Input
            placeholder="Search schools by name"
            containerClass="mb-0"
            className="rounded-lg p-[1rem] pl-8 placeholder:text-[#AAAAAA]"
            onChange={handleOnChange}
            value={termText}
          />
        </div>

      </div>

      <div className={cn(
        "w-full min-h-[200px] p-2 md:px-10 lg:px-20",
        (isLoading || schools?.length) && "md:px-40 lg:px-80")} >
        <UsMap
          activeStates={activeStates}
          setActiveStates={setActiveStates}
        />
      </div>

      {((activeStates?.length > 0 || !!searchTerm) && !isLoading) ? (
        <div className="w-full flex items-end">
          <div className="space-y-1 my-3">
            <h2 className="font-semibold">{schoolCount} Universit{schoolCount === 1 ? 'y' : 'ies'} Found</h2>
            <p className="text-sm text-gray-500">Explore {schools?.length} top universit{schoolCount === 1 ? 'y' : 'ies'}</p>
          </div>
        </div>) : null }

      {
        (isLoading || isFetching) ? <LoadingSpinner className="h-[250px]" /> :
          (activeStates?.length > 0 || !!searchTerm) && (<>
          <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-3 mt-5">
            {schools?.length > 0
              ? schools.map((school, index) => (
                <li key={index} className="flex rounded bg-slate-50 relative justify-center items-center text-sm w-[160px] h-[120px] md:w-[200px] md:h-[150px] p-3 md:p-6 m-1 border">
                  <Link href='#' onClick={() => setActiveSchoolId(school.id)}>
                    {school.name}
                  </Link>
                  <div className="absolute right-3 bottom-3 text-slate-400">
                    {school.school_address.state}
                  </div>
                </li>
              ))
              : <p className="text-sm text-gray-500">No matches found.</p>}
          </ul>
          <div className={cn(
              "flex mt-5",
              schools?.length === 0 && "hidden",
              )}>
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
          </div></>)
      }
    </PageContent>
    </>
  );
}
