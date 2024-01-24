"use client"
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { TAB_LINKS } from './data'

export default function SchoolTabs() {
  const pathname = usePathname()
  return (
    <>
      {
        TAB_LINKS.map(({ id, title, url }) => (
          <Link
            href={url}
            key={id}
            className={`pb-1 ml-4 text-sm transition-all hover:border-b-[4px] hover:border-b-primary md:ml-12 md:text-[1rem] ${pathname === url && 'border-b-[4px] border-b-primary'} `}
          >{title}</Link>
        ))
      }
    </>
  )
}
