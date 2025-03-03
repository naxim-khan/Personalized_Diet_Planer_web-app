'use client'
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { cn } from '../lib/utils'
import { sidebarLinks } from '../../constants'
import { usePathname } from 'next/navigation'
import { MobileNavProps } from '../../types/index'
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "../../components/ui/sheet"
import Footer from './Footer'

const MobileNav = ({ user }: MobileNavProps) => {
    const pathname = usePathname();

    // Function to remove trailing slash
    const normalizePath = (path: string): string => path.replace(/\/$/, '');

    return (
        <section className='w-full max-w-[264px]'>
            <Sheet>
                <SheetTrigger>
                    <Image
                        alt='menu-icon'
                        src={'/icons/hum-burger.svg'}
                        width={25}
                        height={25}
                        className='cursor-pointer'
                    />
                </SheetTrigger>
                <SheetContent side='left' className='border-none bg-white'>
                    <SheetHeader>
                        <SheetTitle className='sr-only'>Navigation Menu</SheetTitle> {/* This hides the title visually but keeps it accessible for screen readers */}
                        <Link
                            href={"/dashboard"}
                            className='cursor-pointer items-center gap-0 flex px-4'
                        >
                            <Image
                                src={"/img/LOGO.png"}
                                width={50}
                                height={50}
                                alt='MyDiet Logo'
                            />
                            <h1 className='text-26 font-ibm-plex-serif font-bold text-black-1'>MyDiet</h1>
                        </Link>
                    </SheetHeader>

                    <div className='mobilenav-sheet'>
                        <SheetClose asChild>
                            <nav className='flex  flex-col gap-3 pt-10 text-white'>
                                {sidebarLinks.map((item) => {
                                    const isActive = normalizePath(pathname) === normalizePath(item.route);
                                    return (
                                        <SheetClose asChild key={item.route}>
                                            <Link href={item.route} className={cn('mobilenav-sheet_close w-full', { 'bg-gradient-green': isActive })}>
                                                <Image
                                                    src={item.imgURL}
                                                    alt={item.label}
                                                    width={20}
                                                    height={20}
                                                    className={cn("transition-all duration-300", {
                                                        "brightness-0 invert filter": isActive,
                                                        "text-black": !isActive, // Default state
                                                    })}
                                                />
                                                <p className={cn("text-16 font-semibold text-black-2 ", { '!text-white': isActive })}>
                                                    {item.label}
                                                </p>
                                            </Link>
                                        </SheetClose>
                                    );
                                })}
                            </nav>
                        </SheetClose>
                        <Footer user={user} type="mobile" />
                    </div>
                </SheetContent>
            </Sheet>
        </section>
    )
}

export default MobileNav
