'use client'
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
    Navbar,
    NavbarBrand,
    NavbarMenuToggle,
    NavbarMenu,
    NavbarMenuItem,
    NavbarContent,
    NavbarItem,
    Link as HeroLink,
    Button,
} from "@heroui/react";

export const AcmeLogo = () => (
    <img src='/img/LOGO.png' width={50} alt="Logo" />
);

const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Features', href: '#features' },
    { name: 'About', href: '#about' },
    { name: 'Our Team', href: '/team' }
];

async function fetchUserDetails() {
    const response = await fetch('/api/user');
    if (response.ok) {
        const user = await response.json();
        return user;
    } else {
        throw new Error('Failed to fetch user details');
    }
}

export default function App({ user }) {
    const [activeSection, setActiveSection] = useState('');
    const [userData, setUserData] = useState(null);
    const pathname = usePathname();

    useEffect(() => {
        fetchUserDetails()
            .then(data => setUserData(data))
            .catch(error => console.error('Error fetching user details:', error));
    }, []);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.id);
                    }
                });
            }, { threshold: 0.5 });

            document.querySelectorAll('section[id]').forEach(section => observer.observe(section));

            return () => observer.disconnect();
        }
    }, []);

    const filteredNavItems = pathname === '/team'
        ? [{ name: 'Home', href: '/' }]
        : navItems;

    const renderLink = (item) => {
        const isPageLink = item.href.startsWith('/');
        const isActive = activeSection === item.href.replace('#', '');

        if (isPageLink) {
            return (
                <Link href={item.href} passHref legacyBehavior>
                    <HeroLink color={isActive ? 'primary' : 'foreground'}>
                        {item.name}
                    </HeroLink>
                </Link>
            );
        }

        return (
            <HeroLink
                color={isActive ? 'primary' : 'foreground'}
                href={item.href}
            >
                {item.name}
            </HeroLink>
        );
    };

    return (
        <Navbar isBordered className="border-b-gray-300 text-sm sm:text-lg fixed " maxWidth="xl" position='static'>
            <NavbarContent className="sm:hidden" justify="start">
                <NavbarMenuToggle />
            </NavbarContent>

            <NavbarContent className="flex sm:hidden gap-4" justify="center">
                <NavbarBrand>
                    <AcmeLogo />
                </NavbarBrand>
            </NavbarContent>

            <NavbarContent className="hidden sm:flex gap-4 w-full max-w-7xl" justify="center">
                <NavbarBrand>
                    <AcmeLogo />
                    <p className="font-bold text-inherit text-xl text-gradient">MyDiet</p>
                </NavbarBrand>
                {filteredNavItems.map((item) => (
                    <NavbarItem key={item.href} isActive={activeSection === item.href.replace('#', '')}>
                        {renderLink(item)}
                    </NavbarItem>
                ))}
            </NavbarContent>

            <NavbarContent justify="end">
                <NavbarItem className="hidden lg:flex">
                    <Link href={user ? "/dashboard" : "/sign-in"} passHref legacyBehavior>
                        <HeroLink>{user ? "Dashboard" :"Login"}</HeroLink>
                    </Link>
                </NavbarItem>
                <NavbarItem>
                    <Link href={user ? "/dashboard" : "/sign-up"} passHref legacyBehavior>
                        <Button
                            as="a"
                            color="maincolor"
                            variant="flat"
                            className="bg-gradient-to-r from-maincolor to-darkgreen rounded-tl-full rounded-br-full bg-opacity-15 font-bold text-white px-6 transform hover:rotate-[-5deg] transition-transform duration-300 "
                        >
                            {user ? userData?.user?.firstName || "Sign Up" : "Sign Up"}
                        </Button>
                    </Link>
                </NavbarItem>
            </NavbarContent>

            <NavbarMenu>
                {filteredNavItems.map((item, index) => (
                    <NavbarMenuItem key={`${item.href}-${index}`}>
                        {renderLink(item)}
                    </NavbarMenuItem>
                ))}
                <NavbarMenuItem>
                    <Link href={user ? "/dashboard" : "/sign-in"} passHref legacyBehavior>
                        <HeroLink className="w-full" color="foreground">
                            {user ? "Dashboard " : "Login"}
                        </HeroLink>
                    </Link>
                </NavbarMenuItem>
            </NavbarMenu>
        </Navbar>
    );
}
