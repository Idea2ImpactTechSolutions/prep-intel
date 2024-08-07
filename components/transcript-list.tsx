import { useUploadAssetMutation, useGetAssetsQuery } from "@/redux/services/assets/assetApi";
import LoadingSpinner from "./loading-spinner";
import { FaFileAlt } from "react-icons/fa";
import { useEffect } from "react";

export function TranscriptsList({userId, reloadData=false}) {
  const { data: assets, isLoading:isLoadingAssets, refetch, isUninitialized } = useGetAssetsQuery({ userId: userId, category: "user-document" }, {skip: !userId});

  useEffect(() => {
    if (!isUninitialized) {
      // Reload assets on successful upload
      refetch();
    }
  }, [reloadData, isUninitialized])

  if (isLoadingAssets) {
    return <LoadingSpinner />
  }

  return (
    <>
      <h3 className="mb-1 mt-4 font-semibold">Documents</h3>
      <ul className="ml-2">
      { isLoadingAssets ? <LoadingSpinner/> :
        assets && assets.data.map(asset => (
          <li key={asset.id}>
            <a href={`/api/assets/${asset.id}`} className="underline flex align-middle items-center gap-1" >
            <FaFileAlt />{asset.description} better...
            </a>
          </li>)
        )}
      </ul>
    </>
  )
}