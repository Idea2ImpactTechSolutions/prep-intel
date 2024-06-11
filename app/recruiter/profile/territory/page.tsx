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
import { statePaths } from "@/data/state-paths";

const options = statePaths
  .sort((a, b) => a.name.localeCompare(b.name))
  .map((e) => ({ value: e.id, label: e.name }));

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