export const dynamic = 'force-dynamic';
import { ReactNode } from "react";
import SideBar from "../../components/Dashboard/SideBar";
import Image from "next/image";
import { getLoggedInUser } from "../../lib/actions/users.action";
import MobileNav from "../../components/Dashboard/MobileNav";
import { redirect } from "next/navigation";

export default async function RootLayout({ children }: { children: ReactNode }) {
    const loggedIn = await getLoggedInUser(); // ✅ Server-side fetching
    if (!loggedIn) redirect('/sign-in')

    return (
        <main className="flex overflow-x-hidden h-screen w-full scroll-smooth font-inter bg-gray-100">
            {loggedIn &&
                <>
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
                </>
            }

        </main>
    );
}
