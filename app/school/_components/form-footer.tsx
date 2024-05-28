
import { GoChevronLeft } from "react-icons/go";
import { IoCloseOutline } from "react-icons/io5";
import { Button } from "@/components/ui/button";
import { ChevronRight, Upload } from "lucide-react";
import { usePathname } from "next/navigation";

export default function FormFooter({
  onBack,
  onSaveForLater,
  isBackDisabled,
  isSubmitting,
}) {
  const handleDiscard = () => window.location.reload()
  const location = usePathname()

  return (
    <div className="flex pt-6 gap-3">
      <button
            type="button"
            className="flex items-center bg-background border-solid border-primary border text-primary hover:bg-primary-500 font-bold py-1 px-4 rounded mr-2 pl-2"
            onClick={handleDiscard}><IoCloseOutline />&nbsp;Discard</button>

      <div className="flex-grow"></div>

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
        >
        {location === "/school/preview-school"  && <span className="flex items-center gap-1">Save & Publish <Upload className="w-4 h-4" /></span>}
        {location !== "/school/preview-school" && <span className="flex items-center gap-1">Next <ChevronRight className="w-4 h-4" /></span>}
      </Button>
    </div>
  );
};
