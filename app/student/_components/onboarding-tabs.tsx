"use client"
import { PageHeader } from '@/components/common-page'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { useEffect, useState } from 'react'

type ACTIVE_STEP = 'Vitals' | 'Schools' | 'Majors' | 'Extracurricular' | 'Transcript'

const tabs = [
  {
    step: 1,
    title: 'Vitals',
    path: '/student/onboarding/vitals'
  },
  {
    step: 2,
    title: 'Schools',
    path: '/student/onboarding/schools'
  },
  {
    step: 3,
    title: 'Majors',
    path: '/student/onboarding/majors'
  },
  {
    step: 4,
    title: 'Extracurricular',
    path: '/student/onboarding/extracurricular'
  },
  {
    step: 5,
    title: 'Transcript',
    path: '/student/onboarding/transcripts'
  },
]

interface OnboardingTabsProps {
  active_step: ACTIVE_STEP;
  className?: string;
  originalSteppedWizardView?: boolean;
}

type TabStyle = 'material-tabs' | 'pills';
const mode : TabStyle = "material-tabs";

export default function OnboardingTabs({ active_step: activeTabName, className, originalSteppedWizardView=false}: OnboardingTabsProps) {
  const [activeIndex, setActiveIndex] = useState<any>("")
  const [nextIndex, setNextIndex] = useState<any>("")

  useEffect(() => {
    if (activeTabName) {
      const tabIndex = tabs.findIndex(step => step.title === activeTabName)
      setActiveIndex(tabIndex)

      if (tabIndex ===tabs.length - 1) {
        // Seemingly handle last tab case
        setNextIndex(tabIndex)
      } else {
        setNextIndex(tabIndex + 1)
      }
    }
  },[activeTabName])

  function url(path) {
    return path;
  }

  const normal = 'relative flex justify-center items-center text-xs md:text-sm p-2 md:px-10 md:min-w-[120px] bg-gray-100'
  const defaultLink = normal + ' text-grey-500 hover:text-primary'
  const activeLink = normal + ' text-white bg-primary'

  if (!originalSteppedWizardView) {
    return (
      <>
      <PageHeader title="Edit Profile" />
      <div className={cn(
        "p-0 flex gap-x-2",
        className,
        '!p-4',
        )}>
      {
          // Use the array index as the item key - it's stable in this context,
          // isn't used for anything and eliminates unnecessary UUIDs
          tabs.map(({ title, path }, index) => (
            <Link
                  key={index}
                  href={url(path)}
                  className={cn(
                    mode === 'pills' && `relative p-3 py-1 items-center border-blue-gray border`,
                    mode === 'pills' && (location.pathname === url(path)) ? activeLink : defaultLink,
                    mode === 'material-tabs' &&  "hover:text-primary",
                    mode === 'material-tabs' && (location.pathname === url(path)) && 'text-primary border-b-2 border-b-primary',
                  )}
              >
                  <span className="">{title}</span>
              </Link>
          ))
      }
      </div>
    </>
    );
  }

  // Original stepped progress control
  return (
      <nav className={cn(`p-4 pb-8`, className)}>
        <div className="">
          <div className="flex-1">
            {/* <span className='block border-b border-[#D0CFCF]'></span> */}
            <div className='grid grid-cols-5 w-full'>
              {
                tabs.map(({ step, title, path }, idx) => (
                  <div key={step} className={cn(
                    "flex flex-col items-center gap-y-2 z-0 relative",
                    idx !== 4 && "after:right-0 after:top-[25%] after:block after:contents-[''] after:absolute after:h-[2px] after:bg-[#D0CFCF] after:w-[50%] after:-z-10",
                    idx !== 0 && "before:left-0 before:top-[25%] before:block before:contents-[''] before:absolute before:h-[2px] before:bg-[#D0CFCF] before:w-[50%] before:-z-10",
                    nextIndex -1 !== 0 && idx < nextIndex - 1  && "after:bg-[#A81D28]",
                    idx !== 0 && idx < nextIndex  && "before:bg-[#A81D28]",
                     (idx === 3 && activeIndex + 1 === 5) && "after:bg-[#A81D28]",
                     (idx === 4 && activeIndex + 1 === 5) && "before:bg-[#A81D28]",
                  )}>
                    <span className={cn(
                      "grid place-content-center bg-[#D0CFCF] text-white w-7 h-7 font-bold rounded-full",
                     idx < nextIndex && "bg-[#A81D28]",
                     (activeTabName === title) && "bg-[#A81D28]",
                    )}>{step}</span>
                    <span className={cn(
                      "text-[.6rem] md:text-sm",
                      idx < nextIndex && "text-[#A81D28]",
                      (activeTabName === title) && "text-[#A81D28]",
                    )}>{title}</span>
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      </nav>
  )
}
