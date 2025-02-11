import type { Metadata } from "next";
import { ReactNode } from "react";
import "../(root)/homepage.css";

import Navbar from "@/components/Landing/Navbar";
import Footer from "@/components/Landing/Footer";

const RootLayout = ({ children }: { children: ReactNode }) => {
    return (
        <main>
            {/* <Navbar /> */}
            {children}
            {/* <Footer /> */}
        </main>
    )
}

export default RootLayout;