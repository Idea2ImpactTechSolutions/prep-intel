import CustomFileInput from "@/components/custom-file-input";
import { cn } from "@/lib/utils";
import { useUploadAssetMutation } from "@/redux/services/assets/assetApi";
import { ImagePlus } from "lucide-react";

interface AssetImageProps {
  imageUrl: string;
  userId: string;
  assetCategory: string;
  toast: any;
  onAssetUploaded?: (imageUrl: string) => void;
}

export default function AssetImage({ imageUrl, userId, assetCategory, toast, onAssetUploaded }: AssetImageProps) {
  const [uploadImageAsset, { isLoading: uploading }] = useUploadAssetMutation();

  async function uploadImage(imageFile: File) {
    if (imageFile) {
      const payload = new FormData();
      payload.append("file", imageFile);
      payload.append("userId", userId);
      payload.append("category", assetCategory);

      try {
        const response = await uploadImageAsset(payload).unwrap();
        if (onAssetUploaded && response?.data?.assetUrl) {
          // Notify parent component that asset has been uploaded
          onAssetUploaded(response.data.assetUrl);
        }
      } catch (err: any) {
        toast.error(err.message);
      }
    }
  }

  return (
    <div className="flex gap-x-4 items-center">
      <CustomFileInput uploading={uploading} handleFileChange={uploadImage}>
        <div id="imageInput"className={cn("border border-dashed border-gray-400 w-32 h-32 grid place-content-center rounded-full overflow-hidden")}>
          {imageUrl ?
            <img src={imageUrl} alt="" className={cn(uploading && "opacity-25")} />
            :
            <ImagePlus className="w-10 h-10 text-gray-400" />}
        </div>
      </CustomFileInput>
    </div>
  );
}
