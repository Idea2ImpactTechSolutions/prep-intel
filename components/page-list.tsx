import React, { useState, useEffect } from 'react'
import Link from "next/link";
interface PageProps {
  schoolId: number;
  studentId: number;
}

export default function PageList({ schoolId, studentId }: PageProps) {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showLinks, setShowLinks] = useState(false);
  const [collected, setCollected] = useState(false);

  function resolveIds(url) {
    return url
        .replace('[id]', schoolId)
        .replace('[studentId]', studentId)
  }

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') {
      return;
    }
  }, []);

  function toggleLinks() {

    if (!collected) {
      setCollected(true);
      setLoading(true);
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
          setLoading(false);
        });
    }

    setShowLinks(!showLinks);
  }

  if (process.env.NODE_ENV !== 'development') {
    return (<></>);
  }

  return (
    <div className="overflow-hidden">
      <h1 className='text-xl font-bold mt-6' onClick={toggleLinks}>Page List</h1>

      {
        loading && <div>Loading...</div>
      }

      {
        showLinks && <ul>
          {
            links.map((url, index) => (
              <li key={index} className="m-2"><Link
                href={resolveIds(url)}
                className={`pb-1 text-sm transition-all hover:border-b-[4px] hover:border-b-primary md:ml-2 md:text-[1rem] `}
              >{url}</Link></li>
            ))
          }
        </ul>
      }
    </div>

  )
}
