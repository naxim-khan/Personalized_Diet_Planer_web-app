'use client'
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { sidebarLinks } from '../../constants/index';
import { cn } from '../lib/utils';
import { usePathname } from 'next/navigation';
import Footer from './Footer';
import { SiderbarProps } from '../../types/index';
const SideBar = ({ user }: SiderbarProps) => {
    const pathname = usePathname();
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <section className={cn(
            "sidebar transition-all duration-300 z-50 ",
            isExpanded ? "w-[355px]" : "w-fit"
        )}>
            <nav className='flex flex-col gap-4 h-full'>
                <div
                    // href={"/dashboard"}
                    className=' cursor-pointer items-center gap-2 flex'
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    <Image
                        src={"/img/LOGO.png"}
                        width={34}
                        height={34}
                        alt='MyDiet Logo'
                        className='size-12 max-xl:size-10'
                    />
                    <h1 className={cn(
                        "sidebar-logo font-inter text-gradient",
                        !isExpanded && "hidden"
                    )}>
                        MyDiet
                    </h1>
                </div>

                <div className='flex-1'>
                    {sidebarLinks.map((item) => {
                        const isActive = pathname === item.route || pathname.startsWith(`${item.route}/dashboard`);
                        return (
                            <Link
                                href={item.route}
                                key={item.label}
                                className={cn('flex gap-3  py-1 md:p-3 2xl:p-4 rounded-lg xl:justify-start transition-colors items-start justify-start', { 'bg-green-700': isActive })}
                            // onClick={() => setIsExpanded(!isExpanded)}
                            >
                                <div className='relative size-6'>
                                    <Image
                                        src={item.imgURL}
                                        alt={item.label}
                                        fill
                                        className={cn("transition-all duration-300", {
                                            "brightness-0 invert filter": isActive,
                                        })}
                                    />
                                </div>
                                <p className={cn("sidebar-label", {
                                    '!text-white': isActive,
                                    'hidden': !isExpanded
                                })}>
                                    {item.label}
                                </p>
                            </Link>
                        );
                    })}
                </div>
            </nav>
            <Footer user={user} type='desktop' isExpanded={isExpanded} />
        </section>
    );
};

export default SideBar;