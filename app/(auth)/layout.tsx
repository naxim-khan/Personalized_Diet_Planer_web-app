import type { Metadata } from "next";
import { ReactNode } from "react";
import "../(root)/homepage.css";
import Image from "next/image";

const RootLayout = ({ children }: { children: ReactNode }) => {
    return (
        <main className="flex min-h-screen w-full justify-between font-inter">
            {/* <Navbar /> */}
            {children}
            {/* <div className="auth-asset">
                <div>
                    <Image src={'/img/dashboard-img.png'} alt="dashboard Image" width={700} height={700} className="border-2 border-green-700 border-r-0 rounded-tl-xl rounded-bl-xl" />
                </div>
            </div> */}
            {/* <Footer /> */}
        </main>
    )
}

export default RootLayout;