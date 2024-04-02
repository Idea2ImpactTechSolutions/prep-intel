"use client"

import { FaFacebookSquare, FaYoutube, FaLinkedinIn,FaMapMarkerAlt, FaPhoneAlt } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { AiFillPrinter } from "react-icons/ai";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Image from "next/image";
import logoImage from "public/images/logo.png";
import bulletImage from "public/images/bullet.png";
import workWithImage from "public/images/work-with.png";
import Link from "next/link";
import { Space_Grotesk } from "next/font/google";
import { usePathname } from 'next/navigation'
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"] });

export default function Home() {
  const router = useRouter();
  const pathname = usePathname();

  const PAGE_TABS = [
    {title: "Home", href: "/"},
    {title: "Search", href: "/login"},
    {title: "Blog", href: "/login"}];

  return (
    <>
    <main className="container flex min-h-[950px] flex-col p-8 pt-20 font-sans bg-auto bg-no-repeat bg-right-top bg-[url('/images/banner.png')]">

      <div className="flex justify-between items-center">
        <Image
          src={logoImage}
          alt="logo"
          className="object-contain"
        />

        <div className="flex space-x-24 font-bold">
          {
            PAGE_TABS.map((item, index) => (
              <Link
                href={item.href}
                key={index}
                className={`pb-1 ml-4 text-sm transition-all hover:border-b-[2px] hover:border-b-[#FEBB0E] md:ml-12 md:text-[1rem] ${pathname === item.href && 'border-b-[2px] border-b-[#FEBB0E]'} `}
              >{item.title}</Link>
            ))
          }
        </div>

        <Button className="bg-[#FEBB0E] border-[#FEBB0E] text-black mt-0 mr-20"
            onClick={() => router.push('/login')}
            type="button"
            variant="outline"
          >
            Sign Up
        </Button>
      </div>

      <div className="mt-14 max-w-[500px]">
        <h3 className={`${spaceGrotesk.className} text-2xl font-bold flex gap-1`}>Accurate Results
         <Image
              src={bulletImage}
              alt="bullet"
              className="object-contain"
              width={20}
          />
        </h3>
        <h3  className={`${spaceGrotesk.className} text-5xl mt-6 font-bold`}>Find Your College</h3>
        <h3 className={`${spaceGrotesk.className} text-5xl mt-4 font-bold text-primary`}>Within Seconds</h3>
        <div className="mt-6 text-gray-500">
        At Prep Intel, we are committed to helping students find their
        dream colleges. Our team of experts utilizes A1, machine
        learning, and predictive analytics to deliver accurate and
        personalized college matching and enrollment solutions.
        </div>

        <Button className="bg-[#FEBB0E] border-[#FEBB0E] text-black mt-12 mr-20"
            onClick={() => router.push('/login')}
            type="button"
            variant="outline"
          >
            Sign Up
        </Button>

        <h3 className="mt-16 text-gray-400">Colleges we work with</h3>
        <div>
          <Image
              src={workWithImage}
              alt="work-with"
          />
        </div>
      </div>

    </main>
    <footer className="flex w-full bg-[url('/images/footer-tile.png')] min-h-[550px] align-top text-white" >
      <div className="container p-8 pb-20 flex flex-col md:flex-col justify-end">

      <div className="flex justify-between">
        <div className="w-[280px]">
          <h1 className={`${spaceGrotesk.className} text-4xl`}>Do you have any questions?</h1>
          <div className="mt-4">Feel free to send us your questions or request a free consultation?</div>
          <Button className="bg-[#FEBB0E] border-[#FEBB0E] font-bold text-black mt-8 mb-8"
                onClick={() => router.push('/login')}
                type="button"
                variant="outline"
              >
              Send a Message
          </Button>
        </div>
        <div>
          <h1 className={`${spaceGrotesk.className} text-5xl mt-0`}>PrepIntel</h1>
          <div className="mt-4"><FaMapMarkerAlt className="inline-block mr-2"/> 345 Faulconer Drive, Suite 4 • Charlottesville, CA, 12345</div>
          <div className="flex gap-4 mt-4">
            <span><FaPhoneAlt className="inline-block mr-2" /> (123) 456-780</span>
            <span><AiFillPrinter className="inline-block mr-2" />(123) 456-780</span>
          </div>
        </div>
      </div>

      <div className="flex space-x-8 mt-8">
        <span className="pr-8">Social Media</span>
        <Link href="/" className="uppercase"><FaFacebookSquare /></Link>
        <Link href="/" className="uppercase"><FaXTwitter /></Link>
        <Link href="/" className="uppercase"><FaLinkedinIn  /></Link>
        <Link href="/" className="uppercase"><FaYoutube /></Link>
      </div>

      <div className="flex justify-between mt-14">
        <ul className="flex space-x-14">
          <li><Link href="/" className="uppercase">About Us</Link></li>
          <li><Link href="/" className="uppercase">Contact Us</Link></li>
          <li><Link href="/" className="uppercase">Help</Link></li>
          <li><Link href="/" className="uppercase">Privacy Policy</Link></li>
          <li><Link href="/" className="uppercase">Disclaimer</Link></li>
        </ul>
        <div>
        © 2024 Prepintel. All rights reserved.
      </div>
      </div>


      </div>

    </footer>
    </>
  );
}
