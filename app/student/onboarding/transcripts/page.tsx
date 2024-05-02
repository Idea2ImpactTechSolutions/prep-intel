"use client";
import OnboardingFooter from "@/app/student/_components/onboarding-footer";
import CustomFileInput from "@/components/custom-file-input";
import CustomSelect from "@/components/custom-select";
import ConfirmationModal from "@/components/modal/confirmation-modal";
import SectionContainer from "@/components/section-container";
import { CheckCircle2, FileText } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useUploadAssetMutation, useGetAssetsQuery } from "@/redux/services/assets/assetApi";
import LoadingSpinner from '@/components/loading-spinner';
import { FaFileAlt } from "react-icons/fa";

export default function TranscriptsPage() {
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [insertedFile, setInsertedFile] = useState<File>()
  const [loading, setLoading] = useState(false);
  const [documentType, setDocumentType] = useState("");
  const router = useRouter();
  const [ uploadAsset , { isLoading: isLoadingUpload, isSuccess }] = useUploadAssetMutation()

  const { data } = useSession()
  const userId = data?.user?.id

  const { data: assets, isLoading:isLoadingAssets, refetch } = useGetAssetsQuery({ userId: userId, category: "user-document" });

  async function handleUploadFile(bodyContent){
    await uploadAsset(bodyContent).unwrap()
  }

  useEffect(() => {
    // Reload assets on successful upload
    refetch();
  }, [isSuccess])


  useEffect(() => {
    if (insertedFile) {
      const payload = new FormData()
      payload.append('file', insertedFile)
      payload.append('userId', userId as string)
      payload.append('category', 'user-document')

      handleUploadFile(payload)
    }
  }, [insertedFile])

  return (
    <>
      <div className="flex-1 px-6 md:px-12 lg:px-20">
        <SectionContainer title="Upload Important Documents">
          <>
            <p>Important Documents include:</p>
            <div className="flex flex-col gap-y-2 my-4">
              <span className="flex items-center text-primary text-sm"><CheckCircle2 className="w-4 h-4 mr-1" /> Your Transcripts</span>
              <span className="flex items-center text-primary text-sm"><CheckCircle2 className="w-4 h-4 mr-1" /> Standardized Test Results</span>
              <span className="flex items-center text-primary text-sm"><CheckCircle2 className="w-4 h-4 mr-1" /> Letter of Recommendation</span>
            </div>

            <div className="">
              <form>
                <CustomSelect
                  label="Choose document type"
                  options={[
                    {
                      label: "Transcript",
                      value: "transcript",
                    },
                    {
                      label: "Test Result",
                      value: "test_result",
                    },
                    {
                      label: "Letter of Recommendation",
                      value: "letter_of_recommendation",
                    },
                  ]}
                  selected={documentType}
                  setSelected={setDocumentType}
                  error={""}
                />
                <CustomFileInput
                  className="grid place-content-center mt-6 border border-gray-400 border-dashed p-8 bg-gray-50"
                  accept=".txt, .doc, .docx, .pdf"
                  handleFileChange={(file) => setInsertedFile(file)}
                  uploading={isLoadingUpload}
                >
                  <div className="text-sm text-center flex flex-col justify-center items-center gap-y-3">
                    <FileText className="w-10 h-10 text-gray-400" />
                    <div className="text-gray-700">
                      Drag and drop <br /> <span className="text-xs">Or</span> <span className="block text-primary font-semibold"> Select File</span>
                    </div>
                    <span className="italic">{insertedFile && insertedFile.name}</span>
                  </div>
                </CustomFileInput>
              </form>
            </div>
          </>
        </SectionContainer>



          <div>
              <h3 className="mb-1 mt-4 font-semibold">Documents</h3>
              <ul className="ml-2">
              { isLoadingAssets ? <LoadingSpinner/> :
                assets && assets.data.map(asset => (
                  <li key={asset.id}>
                    <a href={asset.location} className="underline flex align-middle items-center gap-1" >
                    <FaFileAlt />{asset.description}
                    </a>
                  </li>)
                )}
              </ul>
          </div>

      </div>
      <OnboardingFooter
        prevPageHandler={() => router.push('/student/onboarding/extracurricular')}
        nextPageHandler={() => setShowConfirmationModal(true)}
        nextBtnLabel="Finish"
      />
      <ConfirmationModal
        title="Are you absolutely sure?"
        description="This action cannot be undone. This will permanently submit your record."
        open={showConfirmationModal}
        handleClose={() => setShowConfirmationModal(false)}
        loading={loading}
        onClick={() => {
          setLoading(true);
          new Promise((resolve) => {
            setTimeout(() => {
              setLoading(false);
              resolve("");
            }, 2000);
          }).then(() => {
            setShowConfirmationModal(false);
            toast.success("Account Created");
            router.push("/student/explore");
          });
        }}
      />
    </>
  );
}
