import { ReactNode } from "react";
import "./homepage.css";

import Navbar from "../../components/Landing/Navbar";
import Footer from "../../components/Landing/Footer";

const RootLayout = ({ children }: { children: ReactNode }) => {
    return (
        <main className="h-screen">
            <Navbar />
            {children}
            <Footer />
        </main>
    )
}

export default RootLayout;