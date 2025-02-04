"use client"
import React from 'react';
// import { FaArrowRight } from "react-icons/fa6";
import { motion } from "framer-motion";
import { FadeRight, FadeLeft } from '@/components/utility/animation';
import TeamShowCase from "@/components/Landing/TeamShowCase/TeamShowCase";
import { FaArrowLeft } from "react-icons/fa";
import { AnimatedTooltip } from "@/components/ui/animated-tooltip";


const Team = () => {
    const people = [
        {
            id: 1,
            name: "Shareefa",
            designation: "UI/UX & Testing",
            image:
                "/img/nazeem.png",
        },
        {
            id: 2,
            name: "Syeda Amna",
            designation: "System Architecture & Research",
            image:
                "/img/amn-cartoon3.png",
        },
        {
            id: 3,
            name: "Nazeem Khan",
            designation: "Full Stack Developer",
            image:
                "/img/nazeem.png",
        },
    ];
    return (
        <section className=' w-full'>
            <div className='mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-4'>
                <div className='container w-full grid grid-cols-1 md:grid-cols-2 min-h-[650px] relative justify-center py-8 sm:py-2'>
                    {/* platform Info */}
                    <div className='flex flex-col justify-center mt-8 md:mt-2 md:py-0 relative  '>
                        <div className='text-center md:text-left space-y-6 lg:max-w-[500px] '>
                            <motion.h1
                                variants={FadeRight(0.5)}
                                initial='hidden'
                                animate='visible'
                                className='hero_title text-4xl lg:text-6xl font-bold '>
                                Meet Our Team
                            </motion.h1>

                            <motion.p
                                variants={FadeLeft(0.7)}
                                initial='hidden'
                                animate='visible'
                                className='text-gray-600 text-lg pb-10 sm:pb-0'>
                                Welcome to Personalized Diet Planning Platform, a health-driven initiative created by a team of passionate Computer Science students. As part of our final-year project, we wanted to build something meaningful—an app that helps people stay healthy and make better lifestyle choices.

                                This is just the beginning, and with your support, we can grow and improve the platform to offer even more tools and resources for a healthier life. Together, we can help you make healthier decisions, track your progress, and work towards your wellness goals.

                                Thank you for being part of our journey—stay with us, and let’s build a healthier future together!
                            </motion.p>

                        </div>
                    </div>

                    {/* hero Images */}
                    <div className='flex justify-center items-center bg-cover' style={{ backgroundImage: `url('/img/frame.png')` }}>
                        <div className="flex justify-center " >
                            <div className="flex items-center justify-center ">
                                <AnimatedTooltip items={people} />
                            </div>
                        </div>
                    </div>

                </div>
                <TeamShowCase />
            </div>
        </section>
    )
}

export default Team