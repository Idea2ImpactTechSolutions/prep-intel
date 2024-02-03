import Image from "next/image";
import Link from "next/link";

const links = `/manager/profile/academic-info
/manager/profile/dashboard
/manager/profile/recruits
/manager/profile/school-profile
/manager/profile/school-welcome
/manager/profile/welcome
/recruiter/connections
/recruiter/dashboard
/recruiter/profile/personal-info
/recruiter/profile/setup
/recruiter/profile/territory
/recruiter/profile/welcome
/recruiter/student-profile
/student/explore`.split('\n').map(p => p.trim())

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
            <h1 className="text-xl font-bold mt-8">Pages</h1>
            <ul>
                {
                    links.map( url => (
                    <li className="m-2"><Link
                        href={url}
                        className={`pb-1 ml-14 text-sm transition-all hover:border-b-[4px] hover:border-b-primary md:ml-12 md:text-[1rem] `}
                    >{url}</Link></li>
                    ))
                }
            </ul>
            <div>
                <h1 className="text-xl font-bold mt-8">Rebuild with the command below, executed from the frontend directory :</h1>
                 <pre className="p-4 text-red-800">find . -name "*page.tsx" | sed 's|^\./app||' | sed 's|/page\.tsx$||' | sed '/^$/d'</pre>
            </div>
        </div>
    </div>
}