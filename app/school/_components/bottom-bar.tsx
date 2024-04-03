
import { GoChevronLeft } from "react-icons/go";
import { IoCloseOutline } from "react-icons/io5";
import { Button } from "@/components/ui/button";
import { ChevronRight, Upload } from "lucide-react";
import { usePathname } from "next/navigation";

const BottomBar = ({
  onBack,
  onSaveForLater,
  isBackDisabled,
  isSubmitting,
}) => {
  const handleDiscard = () => window.location.reload()
  const location = usePathname()

  return (
    <div className="sticky bottom-0 bg-gray-200 py-0 w-full flex justify-between border-t-2 border-t-solid border-t-primary">
        <div className="pi-container flex md:py-4">
        <button
            type="button"
            className="flex items-center bg-background border-solid border-primary border text-primary hover:bg-primary-500 font-bold py-1 px-4 rounded mr-2 pl-2"
            onClick={handleDiscard}><IoCloseOutline />&nbsp;Discard</button>
        {/* <button
            type="button"
            className="flex items-center bg-background border-solid border-primary border text-primary hover:bg-primary-800 font-bold py-1 px-4 rounded mr-2 pl-2"
            onClick={onSaveForLater}><FaSave />&nbsp; Save for Later</button> */}

      <div className="flex-grow"></div>

      <div className="flex">
        <button
          type="button"
          className={`flex items-center bg-background border-solid border-primary border text-primary hover:bg-primary-800 font-bold py-1 px-4 rounded mr-2 pl-2 ${
            isBackDisabled ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={onBack}
          disabled={isBackDisabled}><GoChevronLeft />&nbsp;Back</button>

          <Button
              className="text-xs h-9 rounded-sm font-bold px-6 py-1"
              type="submit"
              loading={isSubmitting}
              disabled={isSubmitting}
            // onClick={() => handleCreateSchoolProfile(values)}
            >
            {location === "/school/preview-school"  && <span className="flex items-center gap-1">Save & Publish <Upload className="w-4 h-4" /></span>}
            {location !== "/school/preview-school" && <span className="flex items-center gap-1">Next <ChevronRight className="w-4 h-4" /></span>}
          </Button>

        {/* <button
          type="submit"
          className="flex items-center bg-primary hover:bg-primary-500 text-white font-bold py-1 px-4 rounded mr-1 pr-2"
          disabled={isSubmitting}
        ><div className="leading-none inline-block -mt-1">Next</div>&nbsp;<GoChevronRight /></button> */}
      </div>
      </div>
    </div>
  );
};

export default BottomBar;
