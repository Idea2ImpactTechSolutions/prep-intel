import React from "react";
import { CircleAlert, CircleCheck } from "lucide-react";

const ConnectedLabel = () => {
  return <div className='flex gap-x-2 items-center'>
  <CircleCheck className='w-4 h-4 text-emerald-500' />
  <span className={`text-[#141111] font-medium`}>
    Connected
  </span>
</div>;
};

export default ConnectedLabel;
