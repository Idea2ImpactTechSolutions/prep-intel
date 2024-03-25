import React, { useState, useEffect } from 'react'
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function PageList() {
  const [links, setLinks] = useState([]);
  const { data: userData }: any = useSession()
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

        const schoolId = userData?.user?.schoolID;

        const urls = data.map(url => {
          // Replace [id] strings with runtime values
          if (url.includes('/school/[id]/')) {
            return url.replace('[id]', schoolId);
          }

          return url;
        });

        setLinks(urls);
      });
  }, []);

  if (process.env.NODE_ENV !== 'development') {
    return (<></>);
  }

  return (
    <div className="absolute right-10 top-10 w-[250px] overflow-hidden">
      <h1 className='text-2xs font-bold'>Page List</h1>
      <ul>
        {
          links.map((url, index) => (
            <li key={index} className="m-2"><Link
              href={url}
              className={`pb-1 text-sm transition-all hover:border-b-[4px] hover:border-b-primary md:ml-2 md:text-[1rem] `}
            >{url}</Link></li>
          ))
        }
      </ul>
    </div>

  )
}
