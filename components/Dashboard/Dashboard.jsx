"use client"
import React from 'react'
import { FaExternalLinkAlt } from 'react-icons/fa';
import HeaderBox from "@/components/Dashboard/HeaderBox"
import Link from 'next/link';
import RightSidebar from '@/components/Dashboard/RightSidebar';

// Charts
import ChartsCards from "@/components/Dashboard/ChartsCards"

const Dashboard = () => {
    const loggedIn = { firstName: "Nazeem Khan" }


    return (
        <section className="home ">
            <div className="home-content">
                <header className='home-header'>
                    <HeaderBox
                        type="greeting"
                        title="Welcome"
                        user={loggedIn?.firstName || "Guest"}
                        subtext="Ready to achieve your health goals?"
                    />
                    <ChartsCards />
                </header>
            </div>
            <RightSidebar
                user={loggedIn}
                transactions={[]}
                banks={[]}
            />
        </section>
    )
}

export default Dashboard