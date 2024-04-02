import React, { useState, useEffect } from 'react'
import Link from "next/link";
interface PageProps {
  schoolId: string
}

export default function PageList({ schoolId }: PageProps) {
  const [links, setLinks] = useState([]);

  function resolveIds(url) {
    return url.replace('[id]', schoolId);
  }

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') {
      return;
    }

    //call api
    fetch('/api/pagelist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((r) => {
        return r.json();
      })
      .then(data => {
        setLinks(data);
      });
  }, []);

  if (process.env.NODE_ENV !== 'development') {
    return (<></>);
  }

  return (
    <div className="overflow-hidden">
      <h1 className='text-xl font-bold mt-6'>Page List</h1>
      <ul>
        {
          links.map((url, index) => (
            <li key={index} className="m-2"><Link
              href={resolveIds(url)}
              className={`pb-1 text-sm transition-all hover:border-b-[4px] hover:border-b-primary md:ml-2 md:text-[1rem] `}
            >{url}</Link></li>
          ))
        }
      </ul>
    </div>

  )
}
