import Image from "next/image";
import Link from "next/link";

export default function Page() {
  return <div>
        <div className="container">
            <nav className="p-4 border-b md:px-12 lg:px-20">
                <div className="flex flex-col items-center md:flex-row md:items-center md:justify-between">
                    <Link
                        href="/login"
                    >
                        <Image
                            src="/images/logo/logo.png"
                            className="md:hidden"
                            width={50}
                            height={50}
                            alt="logo"
                        />
                        <Image
                            src="/images/logo/logo.png"
                            className="hidden md:block"
                            width={65}
                            height={65}
                            alt="logo"
                        />
                    </Link>
                    <div className="flex w-[90%] mt-4 md:w-[75vw] md:mt-0 border-solid border-color-red border-1" >
                    </div>
                </div>
            </nav>
        </div>
        <div className="container">
            <ul>
                <li><a href="/manager/profile/welcome">Claim My Account</a> </li>
                <li><a href="/manager/profile/academic-info">Academic</a> </li>
                <li><a href="/manager/profile/school-profile">Profile</a></li>
            </ul>
        </div>
    </div>
}