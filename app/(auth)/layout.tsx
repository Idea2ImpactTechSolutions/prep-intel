import Image from "next/image";
import Link from "next/link";
import { ImageIcon } from "lucide-react";
import AuthFooter from "./(routes)/_components/auth-footer";

export default function AuthLayout({
  children,
}: {
  children: React.ReactElement;
}) {
  return (
    <main className='min-h-screen bg-white'>
      <section className='grid lg:grid-cols-2 font-sans'>
        <aside className='bg-white min-h-screen flex flex-col'>
          <div className='flex-1 mx-10 pt-20 md:w-[23rem] md:mx-auto'>
            <div className='flex gap-2 items-center justify-start mb-8'>
              <Image
                src='/images/logo/logo.png'
                alt='logo'
                width={100}
                height={100}
              />
              <h2 className='text-4xl font-bold font-sans'>Prep Intel</h2>
            </div>
            {children}
          </div>
          <div className='bg-neutral-100 h-[5rem] grid place-content-center'>
            <AuthFooter />
          </div>
        </aside>
        <aside className='hidden bg-accent border-l min-h-screen lg:grid place-content-center'>
          <ImageIcon className='text-gray-300 w-[10rem] h-[10rem]' />
        </aside>
      </section>
    </main>
  );
}
