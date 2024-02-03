import React from "react";

type FromSectionType = {
    title?: string,
}

export function FormSection({ title }: FromSectionType) {


        // <h2 className="text-xl font-semibold mb-4">Financials</h2>

  return <h2 className="text-xl font-bold text-gray-800 mb-3 mt-6 text-blue-800 ">
            {title }
        </h2>;
}
