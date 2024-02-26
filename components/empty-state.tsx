import { Image as LucidImage } from 'lucide-react'
import React from 'react'
import { Button } from './ui/button'
import PageTitleContainer from './page-title'
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

export default function EmptyStateContainer({ show, pageTitle, pageTitleRightContent, title, content, onClick, buttonName }: EmptyStateContainerType) {
    return (
        <section className={cn(!show && 'hidden')}>
            <PageTitleContainer
                title={pageTitle}
            />
            <section className='p-4 m-4 h-[calc(100vh_-_10rem)] bg-[#F0F4F7] rounded-[6px] flex justify-center items-center text-center'>
                <div className='w-[30rem] md:mx-auto'>
                    <div className='p-5 px-10 w-fit mx-auto flex flex-col items-center border-2 border-primary rounded-[6px] bg-white'>
                        <LucidImage className='w-4 h-4 text-primary' />
                        <span className='text-xs pt-3 text-primary'>Welcome Icon</span>
                    </div>
                    <h2 className='font-bold py-2.5 md:text-lg'>{title}</h2>
                    <p className='text-[#312B2B] text-xs text-thin'>{content}</p>
                    <div className="mt-4 flex justify-center">
                        <Button
                            className="font-light h-9 text-xs"
                            onClick={onClick}
                        >{buttonName ? buttonName : "Create Your School’s Profile"}</Button>
                    </div>
                </div>
            </section>
        </section>
    )
}
