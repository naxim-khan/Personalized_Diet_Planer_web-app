'use client'
// import React, { useState, useEffect } from 'react';
import DummyDashboard from "@/components/Dashboard/DummyDashboard";
// import Dashboard from "@/components/Dashboard/Dashboard";
import { getLoggedInUser } from "@/lib/actions/users.action";
import Dashboard from "@/components/Dashboard/Dashboard";

const Home = async () => {
    // const [isLoading, setIsLoading] = useState(true);
    const loggedIn = await getLoggedInUser();
    // useEffect(() => {
    //     // Simulate an asynchronous operation such as fetching data
    //     const timer = setTimeout(() => {
    //         setIsLoading(false);
    //     }); // Change this duration to match the actual loading time

    //     return () => clearTimeout(timer);
    // }, []);

    return (

        <div
            className='rounded-tl-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex flex-col gap-2 flex-1 w-full h-screen'
            style={{
                backgroundColor: "#fafffb",
                backgroundImage: 'url("https://www.transparenttextures.com/patterns/blizzard.png")',
                backgroundSize: "auto",
                backgroundRepeat: "repeat",
                minHeight: 'fit-content'
            }}
        >
             <Dashboard loggedIn={loggedIn} />
        </div>
    );
}

export default Home;
