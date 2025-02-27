import React from 'react'
import "./homepage.css";
import Hero from "../../components/Landing/Hero/Hero";
import Feature from "../../components/Landing/Feature/Feature";
import Banner from "../../components/Landing/About/Banner";
import Banner2 from "../../components/Landing/About/Banner2";
import HowItWorks from "../../components/Landing/About/HowItWorks";
import { getLoggedInUser } from "../../lib/actions/users.action";

// import Navbar from "@/components/Landing/Navbar";
// import Footer from "@/components/Landing/Footer";


const Home = async () => {
    const loggedIn = await getLoggedInUser();
    return (
        <>
            {/* <Navbar /> */}
            <Hero user={loggedIn} />
            <Feature />
            <Banner />
            <HowItWorks />
            <Banner2 user={loggedIn} />
            {/* <Footer /> */}
        </>
    )
}

export default Home