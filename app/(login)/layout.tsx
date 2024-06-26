import { Space_Grotesk } from "next/font/google";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"] });

export default function AuthLayout({
    children,
}: {
    children: React.ReactElement;
}) {
    return (
        <main className="h-screen w-screen overflow-hidden">
            <section className="h-screen lg:grid lg:grid-cols-2">
                <div className="bg-white p-5 sm:w-[32rem] sm:mx-auto">
                    <Link href="/">
                        <Image
                            src='/images/logo.svg'
                            width={100}
                            height={100}
                            alt="logo"
                        />
                    </Link>
                    {children}
                </div>
                <div className="hidden primary-bg text-white lg:flex lg:flex-col lg:justify-between"
                    style={{ backgroundImage: `url('/images/auth-pattern.png')`, backgroundSize: '100%', backgroundRepeat: 'no-repeat' }}
                >
                    <div className="p-5 mt-8">
                        <div className="px-10">
                            <h2 className={cn(
                                spaceGrotesk.className,
                                'w-3/5 text-2xl font-bold md:mt-6 md:text-3xl lg:text-4xl xl:text-[2.5rem]'
                            )}>The Most Powerful Tool</h2>
                            <p className="w-3/5 text-xs md:text-sm md:mt-5 lg:text-[.95rem]">Experience the power of prep intel's tailored suggestions and easy-to-follow instructions that will revolutionize your journey to college and admission success.</p>
                        </div>
                    </div>
                    <div className="-mt-10">
                        <img src="/images/auth-bg.png" alt="" />
                    </div>
                </div>
            </section>
        </main>
    );
}
