import { ReactNode } from "react";
import "./homepage.css";

import Navbar from "../../components/Landing/Navbar";
import Footer from "../../components/Landing/Footer";
import { ScrollProgress } from "../../components/magicui/scroll-progress";

const RootLayout = ({ children }: { children: ReactNode }) => {
    return (
        <main className="h-screen">
            <ScrollProgress className="top-[64px] from-[#1cdb15] via-[#99fd46] to-[#07e607]" />
            <Navbar />
            {children}
            <Footer />
        </main>
    )
}

export default RootLayout;