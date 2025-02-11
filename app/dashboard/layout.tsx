import { ReactNode } from "react";
import  SideBar  from "@/components/Dashboard/SideBar";
import Image from "next/image";
import { cn } from "@/lib/utils";

import MobileNav from "@/components/Dashboard/MobileNav";
// import Navbar from "@/components/Landing/Navbar"; 

const RootLayout = ({ children }: { children: ReactNode }) => {
    const loggedIn={firstName:"Nazeem", lastName:'Khan'}

    return (
        <main className=" flex overflow-x-hidden h-screen w-full scroll-smooth font-inter bg-gray-100">
            <SideBar user={loggedIn} />
            <div className="flex size-full flex-col">
                <div className="root-layout">
                    <Image src={'/img/LOGO.png'} alt="logo-icon" width={30} height={30} />
                    <div>
                        <MobileNav user={loggedIn} />
                    </div>
                </div>
                {children}
            </div>
        </main>
    )
}

export default RootLayout;