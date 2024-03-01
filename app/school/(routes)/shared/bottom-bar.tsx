
import { GoChevronRight, GoChevronLeft } from "react-icons/go";
import { FaSave } from "react-icons/fa";
import { IoCloseOutline } from "react-icons/io5";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

const BottomBar = ({
  onBack,
  onSaveForLater,
  isBackDisabled,
  isSubmitting,
}) => {
  return (
    <div className="sticky bottom-0 bg-gray-200 py-3 w-full flex justify-between px-4 border-t-2 border-t-solid border-t-primary">
        <div className="container flex px-6">
        <button
            type="button"
            className="flex items-center bg-background border-solid border-primary border text-primary hover:bg-primary-500 font-bold py-1 px-4 rounded mr-2 pl-2"
            onClick={onSaveForLater}><IoCloseOutline />&nbsp;Discard</button>
        <button
            type="button"
            className="flex items-center bg-background border-solid border-primary border text-primary hover:bg-primary-800 font-bold py-1 px-4 rounded mr-2 pl-2"
            onClick={onSaveForLater}><FaSave />&nbsp; Save for Later</button>

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
            >Next <ChevronRight className="w-4 h-4 ml-" />
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
