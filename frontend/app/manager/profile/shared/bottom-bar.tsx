const BottomBar = ({
  onBack,
  onSaveForLater,
  isBackDisabled,
  isSubmitting,
}) => {
  return (
    <div className="sticky bottom-0 bg-gray-200 py-2 w-full flex justify-between px-4">
      <button
        type="button"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={onSaveForLater}
      >
        Save for Later
      </button>

      <div></div>

      <div>
        <button
          type="button"
          className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2 ${
            isBackDisabled ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={onBack}
          disabled={isBackDisabled}
        >
          Back
        </button>

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          disabled={isSubmitting}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default BottomBar;
