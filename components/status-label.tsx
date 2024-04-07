import React from "react";
import { cn } from "@/lib/utils";

interface StatusLabelProps {
  status: string;
}

// interface StatusColor {
//   [key: string]: {
//     textColor: string;
//     bgColor: string;
//   };
// }

// const STATUS_COLOR: StatusColor = {
//   accepted: {
//     textColor: "#57BFC7",
//     bgColor: "#EDFDF8",
//   },

//   rejected: {
//     textColor: "#C75764",
//     bgColor: "#FDEDF2",
//   },

//   waitlisted: {
//     textColor: "#1354FB",
//     bgColor: "#EDF7FD",
//   },
// };

interface StatusColor {
  [key: string]: string;
}

const STATUS_COLOR: StatusColor = {
  accepted: "text-green-600 bg-green-100",
  rejected: "text-red-600 bg-red-100",
  waitlisted: "text-blue-600 bg-blue-100",
};

const StatusLabel = ({ status }: StatusLabelProps) => {
  const colorData = STATUS_COLOR[status];

  return (
    <span className={cn("py-1.5 px-2 rounded-md capitalize", colorData)}>
      {status}
    </span>
  );
};

export default StatusLabel;
