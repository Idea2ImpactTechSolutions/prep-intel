"use client"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useRouter } from "next/navigation";

const SERVICES = [
    {
        id: crypto.randomUUID().toString(),
        text: "Greater Transparency into Your Student Funnel"
    },
    {
        id: crypto.randomUUID().toString(),
        text: "Reports and Trends with Your School"
    },
    {
        id: crypto.randomUUID().toString(),
        text: "Increase Your Outreach to Prospects"
    },
]



export default function page() {
    const router = useRouter()

    return (
        <main className="font-sans">
            <div className="bg-[#F0F4F7] p-6 mt-20 m-6 rounded-[6px] sm:max-w-[28rem] sm:mx-auto">
                <div className="pt-2 flex flex-col items-center justify-center text-center">
                    <Image
                        src="/images/logo/text-logo.png"
                        width={150}
                        height={150}
                        alt="logo"
                        className="md:hidden"
                    />
                    <Image
                        src="/images/logo/text-logo.png"
                        width={180}
                        height={180}
                        alt="logo"
                        className="hidden md:block"
                    />
                    <h2 className="font-bold text-2xl py-3">Welcome to Prep Intel!</h2>
                    <p className="text-sm font-medium">By joining Prep Intel, you will gain access to:</p>
                </div>
                <div className="mt-2 flex flex-col gap-y-1">
                    {
                        SERVICES.map(({ id, text }) => (
                            <p
                                key={id}
                                className="p-1.5 bg-[#DCE1E5] rounded-full font-light text-[13px] text-center"
                            >
                                {text}
                            </p>

                        ))
                    }
                </div>
                <div className="mt-4">
                    <form>
                        <Input
                            label="School Email Address"
                            placeholder="Enter email address"
                            className="w-full placeholder:text-gray-300 placeholder:font-light"
                        />
                        <div className="mt-4 flex justify-center">
                            <Button
                                className="font-light h-9"
                                onClick={() => router.push('/school/my-school')}
                                type="button"
                                // loading
                                // loadingText="Claim My Account"
                                // disabled
                            >Claim My Account</Button>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    )
}
