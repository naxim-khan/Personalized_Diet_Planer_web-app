import { ReactNode } from "react";
import "./homepage.css";

import Navbar from "../../components/Landing/Navbar";
import Footer from "../../components/Landing/Footer";
import { ScrollProgress } from "../../components/magicui/scroll-progress";
import { getLoggedInUser } from "../../lib/actions/users.action";

const RootLayout = async ({ children }: { children: ReactNode }) => {
    const loggedIn = await getLoggedInUser();

    return (
        <main className="h-screen">
            <ScrollProgress className="top-[64px] from-[#1cdb15] via-[#99fd46] to-[#07e607]" />
            <Navbar user={loggedIn} />
            {children}
            <Footer />
        </main>
    )
}

export default RootLayout;
