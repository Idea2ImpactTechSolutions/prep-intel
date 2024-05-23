import { Image as LucidImage } from 'lucide-react'
import React from 'react'
import { Button } from './ui/button'
import { PageHeading, PageContent } from "@/components/common-page";
import { cn } from '@/lib/utils'

type EmptyStateContainerType = {
    show?: boolean,
    pageTitle: string,
    pageTitleRightContent?: React.ReactNode,
    title: string,
    content: string,
    buttonName?: string,
    onClick?: () => void
}

export default function EmptyStateContainer({ show, pageTitle, title, content, onClick, buttonName }: EmptyStateContainerType) {
    return (
        <section className={cn(!show && 'hidden')}>
            <PageHeading title={pageTitle} />
            <PageContent>
            <section className='!py-6 md:!py-20 '>
                <div className='w-full md:w-[30rem] md:mx-auto'>
                    <div className='p-5 px-6 md:px-10 w-fit mx-auto flex flex-col items-center border-2 border-primary rounded-[6px] bg-white'>
                        <LucidImage className='w-4 h-4 text-primary' />
                        <span className='text-xs pt-3 text-primary'>Welcome Icon</span>
                    </div>
                    <h2 className='font-bold mt-4 md:mt-6 py-2.5 md:text-lg'>{title}</h2>
                    <p className='text-[#312B2B] text-xs text-thin'>{content}</p>
                    <div className="mt-4 flex justify-center">
                        <Button
                            className="font-light h-9 text-xs mt-4"
                            onClick={onClick}
                        >{buttonName ? buttonName : "Create Your School’s Profile"}</Button>
                    </div>
                </div>
            </section>
            </PageContent>
        </section>
    )
}
