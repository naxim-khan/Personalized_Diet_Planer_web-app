"use client";
import React from 'react';
import { FaExternalLinkAlt } from 'react-icons/fa';
import HeaderBox from "@/components/Dashboard/HeaderBox";
import RightSidebar from '@/components/Dashboard/RightSidebar';
import ChartsCards from "@/components/Dashboard/ChartsCards";

const Dashboard = ({ loggedIn }) => {
  return (
    <section className="home ">
      <div className="home-content">
        <header className='home-header'>
          <HeaderBox
            type="greeting"
            title="Welcome"
            user={loggedIn?.name || "Guest"}
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
  );
};

export default Dashboard;