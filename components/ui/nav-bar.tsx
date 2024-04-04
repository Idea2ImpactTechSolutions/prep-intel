"use client"
import CustomProfilePopover from "@/components/custom-profile-popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAppDispatch } from "@/redux/store";
import useWindowSize from "@/utils/hooks/useWindowSize";
import { AlignJustify, Bell, LogOut, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import { managerReset } from "@/redux/features/school/managerSlice";

interface TabLink
{
  title: string;
  url: (id: string) => string;
  icon:React.ReactNode;
}

interface NavbarProps {
    showSidebar: any;
    setShowSidebar: (state: any) => any;
    tabs: TabLink[];
}

export default function Navbar({ setShowSidebar, showSidebar, tabs }: NavbarProps) {
    const [showProfilePopover, setShowProfilePopover] = useState(false)

    const { width } = useWindowSize()

    const normal = 'relative p-1.5 mb-2 block flex items-center gap-x-2 text-sm'
    const defaultLink = normal + ' text-grey-500 pl-4 dark:text-slate-400 dark:hover:text-slate-300 hover:text-primary hover:p-1.5 hover:pl-4'
    const activeLink = normal + ' text-white bg-primary rounded-[4px] pl-4 dark:text-slate-300'

    // const location = useLocation();
    const router = useRouter()
    const location = usePathname()
    const pageParams = useParams();
    const schoolId = pageParams?.id as string;

    const dispatch = useAppDispatch()

    const handleLogout = async () => {
        await signOut()
        dispatch(managerReset());
        // window.location.href = "/login";
    }

    useEffect(() => {
        if (width < 768) {
            setShowSidebar(false)
        } else {
            setShowSidebar(true)
        }
    }, [width])

    return (
        <div className="bg-[#F0F4F7]">
            {showSidebar && width < 768 && <div className='absolute w-screen h-screen left-0 bg-neutral-50/5 z-20 cursor-pointer'
                onClick={() => setShowSidebar(!showSidebar)}
            ></div>}
            <nav className={cn(
               //width < 768 && "p-4",
              "pi-container flex justify-between items-center")}>
                <Link
                    href="/"
                    className="hidden md:block"
                >
                    <Image
                        src="/images/logo/text-logo.png"
                        width={100}
                        height={100}
                        alt="logo"
                    />
                </Link>
                <section className="md:hidden">
                    {
                        location !== '/school/claim' && location !== '/school/set-password' && (
                            <AlignJustify className="w-6 h-6 cursor-pointer" onClick={() => setShowSidebar(true)} />)
                    }
                    <div className={`fixed top-0 left-0 h-screen bg-white w-[12rem] pt-4 z-30 transition-all duration-500 ease-in-out border-r border-r-gray-100 md:relative md:x-7 lg:w-[16rem] ${showSidebar || width >= 768 ? 'translate-x-0' : '-translate-x-full'} dark:bg-gray-800`}>
                        <div className="flex justify-center border-b border-b-gray-100 pb-4">
                            <Image
                                src="/images/logo/text-logo.png"
                                width={100}
                                height={100}
                                alt="logo"
                            />
                        </div>
                        <div className="p-4 mt-5 flex flex-col">
                            <div className="">
                                {
                                    // Use the array index as the item key - it's stable in this context,
                                    // isn't used for anything and eliminates unnecessary UUIDs
                                    tabs.map(({ title, url, icon }, index) => (
                                        <Link
                                            key={index}
                                            href={url(schoolId)}
                                            className={cn(`relative p-2.5 items-center gap-x-2`,
                                                (location === url(schoolId)) ? activeLink : defaultLink
                                            )}
                                            onClick={() => {
                                                setShowSidebar(!showSidebar)
                                                router.push(url(schoolId))
                                            }}
                                        >
                                            <span className="flex items-center">{icon} <span className="pl-2">{title}</span> </span>
                                        </Link>
                                    ))
                                }
                            </div>
                            <Button
                                variant="ghost"
                                className="h-8 mt-10 text-xs mr-auto hover:bg-transparent hover:text-destructive"
                                onClick={handleLogout}
                            ><LogOut className="w-4 h-4 mr-1" /> Sign Out</Button>
                        </div>
                    </div>
                    {
                        location === '/school/claim' || location === '/school/set-password' && (
                            <Image
                                src="/images/logo/text-logo.png"
                                width={100}
                                height={100}
                                alt="logo"
                            />
                        )
                    }
                </section>
                {
                    location !== '/school/claim' && location !== '/school/set-password' && (
                        <div className="flex items-center justify-between gap-x-16">
                            <div className="hidden md:flex md:justify-between md:items-center">
                                {
                                    tabs.map(({ title, url }, index) => (
                                        <Link
                                            key={index}
                                            href={url(schoolId)}
                                            className={cn(
                                                "text-sm pb-1 ml-10 hover:text-primary",
                                                location === url(schoolId) && 'text-primary border-b-2 border-b-primary'
                                            )}
                                        >
                                            {title}
                                        </Link>
                                    ))
                                }
                            </div>

                            <div className="flex gap-x-4">
                                <Bell className="w-4 h-4 cursor-pointer" />
                                <User className="w-4 h-4 cursor-pointer" onClick={() => setShowProfilePopover(!showProfilePopover)}/>
                                <CustomProfilePopover
                                    show={showProfilePopover}
                                    handleClose={() => setShowProfilePopover(false)}
                                />
                            </div>
                        </div>

                    )}
            </nav>
        </div>
    )
}
