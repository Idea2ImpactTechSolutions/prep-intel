"use client"

import { FaFacebookSquare, FaYoutube, FaLinkedinIn  } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <>
    <main className="container flex min-h-[950px] flex-col items-end pt-20 font-sans bg-contain bg-no-repeat bg-center bg-[url('/images/banner.png')] bg-no-repeat">
        <Button className="bg-[#FEBB0E] text-black mt-0 mb-8 justify-end"
            onClick={() => router.push('/login')}
            type="button"
            variant="outline"
          >
            Sign Up
        </Button>
    </main>
    <footer className="flex w-full bg-[url('/images/footer-tile.png')] min-h-[600px] align-top text-white" >
      <div className="container p-2 px-6 pb-20 flex flex-col md:flex-col justify-end pl-8">

      <div className="w-[250px]">
      <h1 className="text-4xl font-bold">Do you have any questions?</h1>
      <span>Feel free to send us your questions or request a free consultation?</span>
      <Button className="bg-[#FEBB0E] font-bold text-black mt-8 mb-8"
            onClick={() => router.push('/login')}
            type="button"
            variant="outline"
          >
            Send a Message
          </Button>
      </div>

      <div className="flex space-x-8 mt-8">
        <span className="pr-8">Social Media</span>
        <a href="#"><FaFacebookSquare /></a>
        <a href="#"><FaXTwitter /></a>
        <a href="#"><FaLinkedinIn  /></a>
        <a href="#"><FaYoutube /></a>
      </div>

      <div className="flex justify-between mt-14">
        <ul className="flex space-x-14">
          <li><a href="#">About Us</a></li>
          <li><a href="#">Contact Us</a></li>
          <li><a href="#">Help</a></li>
          <li><a href="#">Privacy Policy</a></li>
          <li><a href="#">Disclaimer</a></li>
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
