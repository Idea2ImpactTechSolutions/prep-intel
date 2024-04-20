"use client"
import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'

type ACTIVE_STEP = 'Vitals' | 'Schools' | 'Majors' | 'Extracurricular' | 'Transcript'


const STEPPERS = [
  {
    step: 1,
    title: 'Vitals',
    path: '/school/onboarding/vitals'
  },
  {
    step: 2,
    title: 'Schools',
    path: '/school/onboarding/schools'
  },
  {
    step: 3,
    title: 'Majors',
    path: '/school/onboarding/majors'
  },
  {
    step: 4,
    title: 'Extracurricular',
    path: '/school/onboarding/extracurricular'
  },
  {
    step: 5,
    title: 'Transcript',
    path: '/school/onboarding/transcript'
  },
]

interface OnboardingTabsProps {
  active_step: ACTIVE_STEP
}

export default function OnboardingTabs({ active_step }: OnboardingTabsProps) {
  const [activeIndex, setActiveIndex] = useState<any>("")
  const [nextStepperIndex, setnextStepperIndex] = useState<any>("")


  useEffect(() => {
    if (active_step) {
      const foundIndex = STEPPERS.findIndex(step => step.title === active_step)
      setActiveIndex(foundIndex)
      if (foundIndex === 4) {
        setnextStepperIndex(foundIndex)
        return
      }
      
      const newStepperIndex = foundIndex + 1
      setnextStepperIndex(newStepperIndex)
    }
  },[active_step])

  return (
    <>

      <nav className={`p-4 mb-8`}>
        <div className="flex overflow-x-auto mt-4 mx-auto md:mt-10 md:w-[calc(100vw_-_15rem)] lg:w-[calc(100vw_-_5rem) xl:w-[calc(100vw_-_35rem)]">
          <div className="flex-1">
            {/* <span className='block border-b border-[#D0CFCF]'></span> */}
            <div className='grid grid-cols-5 w-full'>
              {
                STEPPERS.map(({ step, title, path }, idx) => (
                  <div key={step} className={cn(
                    "flex flex-col items-center gap-y-2 z-20 relative",
                    idx !== 4 && "after:right-0 after:top-[25%] after:block after:contents-[''] after:absolute after:h-[2px] after:bg-[#D0CFCF] after:w-[50%] after:-z-10",
                    idx !== 0 && "before:left-0 before:top-[25%] before:block before:contents-[''] before:absolute before:h-[2px] before:bg-[#D0CFCF] before:w-[50%] before:-z-10",
                    nextStepperIndex -1 !== 0 && idx < nextStepperIndex - 1  && "after:bg-[#A81D28]",
                    idx !== 0 && idx < nextStepperIndex  && "before:bg-[#A81D28]",
                     (idx === 3 && activeIndex + 1 === 5) && "after:bg-[#A81D28]",
                     (idx === 4 && activeIndex + 1 === 5) && "before:bg-[#A81D28]",
                  )}>
                    <span className={cn(
                      "grid place-content-center bg-[#D0CFCF] text-white w-7 h-7 font-bold rounded-full",
                     idx < nextStepperIndex && "bg-[#A81D28]",
                     (active_step === title) && "bg-[#A81D28]",
                    )}>{step}</span>
                    <span className={cn(
                      "text-[.6rem] md:text-sm",
                      idx < nextStepperIndex && "text-[#A81D28]",
                      (active_step === title) && "text-[#A81D28]",
                    )}>{title}</span>
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      </nav>



    </>
  )
}
