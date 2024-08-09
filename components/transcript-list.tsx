import { useGetAssetsQuery } from "@/redux/services/assets/assetApi";
import LoadingSpinner from "./loading-spinner";
import { FaFileAlt } from "react-icons/fa";
import { useEffect } from "react";
import { buildAssetUrl } from "@/app/config/helpers";


interface Props {
  userId: string;
  reloadData?: boolean;
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';

  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const size = bytes / Math.pow(k, i);

  return `${parseFloat(size.toFixed(2))} ${sizes[i]}`;
}

export function TranscriptsList({userId, reloadData=false} : Props) {
  const { data: assets, isLoading:isLoadingAssets, refetch, isUninitialized } = useGetAssetsQuery({ userId: userId, category: "user-document" }, {skip: !userId});

  useEffect(() => {
    if (!isUninitialized) {
      // Reload assets on successful upload
      refetch();
    }
  }, [reloadData, isUninitialized])

  if (isLoadingAssets) {
    return <LoadingSpinner className="h-[200px]" />
  }

  return (
    <>
      <ul className="">
      { isLoadingAssets ? <LoadingSpinner/> :
        (assets && assets.data.length) ? assets.data.map(asset => (
          <li key={asset.id} className="border rounded-md p-0 w-full my-4">
            <a href={buildAssetUrl(asset.id)} className="p-4 w-full flex align-middle items-center gap-1 no-underline hover:bg-slate-100" >
              <div className="flex items-center justify-center w-12 h-12 bg-slate-100 rounded-full">
                <FaFileAlt className="text-primary text-xl stroke-current fill-current" />
              </div>

              <div className="pl-2">
                  <span className="block font-medium text-lg">{asset.description}</span>
                  {/* <span className="block text-sm text-gray-500 mt-[-.3em]">{formatFileSize(asset.bytes)}</span> */}
              </div>
            </a>
          </li> )
          ) : (
          <div className="flex items-center flex-col space-y-2 p-4">
            <p className='text-md'>No Results Found</p>
            <span className='text-md text-gray-200'>No transcript data is available at this time.</span>
          </div>)
      }
      </ul>

      { assets?.length }
    </>
  )
}