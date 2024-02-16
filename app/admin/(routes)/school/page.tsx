"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SchoolAdminRegisterPage() {
    return (
        <section>
            <h1 className="text-xl font-bold">School Onboarding</h1>
            <p className="py-3 text-sm">Please fill the form below to get started creating your school profile. </p>
            <div className="mt-4">
                <form>
                    <div className="flex gap-3">
                        <div>
                            <Input
                                id=""
                                name=""
                                onChange={() => null}
                                placeholder="Enter First Name"
                            />
                        </div>
                        <div>
                        <Input
                            id=""
                            name=""
                            onChange={() => null}
                            placeholder="Enter Last Name"
                        />
                    </div>
                    </div>
                    <div>
                        <Input
                            id=""
                            name=""
                            onChange={() => null}
                            placeholder="Enter School Name"
                        />
                    </div>
                    <div className="mt-6">
                        <Input
                            id=""
                            name=""
                            type="email"
                            onChange={() => null}
                            placeholder="Enter School Email"
                        />
                    </div>
                    <div className="mt-6">
                        <Button>Create School</Button>
                    </div>
                </form>
            </div>
        </section>
    )
}