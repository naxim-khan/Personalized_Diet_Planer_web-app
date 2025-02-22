"use client"
import React from 'react';
import { FaInfoCircle, FaLaptop } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { FadeRight, FadeUp, FadeLeft } from '../../utility/animation';
import Link from 'next/link';

const Banner = () => {
    return (
        <section className='mx-auto px-4  max-w-7xl  mb-10 relative' id='about'>
            <div className="container grid grid-cols-1  md:grid-cols-2 space-y-6 md:space-y-0 py-14 relative w-full">
                {/* Banner Image */}
                <div className='w-full max-w-[400px] flex items-center justify-center gap-4'>
                    <motion.img
                        initial={{ opacity: 0, scale: 0.5 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
                        viewport={{ once: true }}
                        src="./img/About_img.png" alt="banner"
                        className='w-full max-w-[500px]  sm:pr-0  object-cover rounded-xl ' />
                </div>

                {/* Platform Info */}
                <div className='flex flex-col justify-center items-center w-full'>
                    <div className='text-center md:text-left space-y-4 lg:w-full  sm:text-xl'>
                        <motion.h1
                            variants={FadeUp(0.5)}
                            initial="hidden"
                            whileInView='visible'
                            viewport={{ once: true }}
                            className='text-3xl lg:text-5xl font-bold uppercase text-gradient'
                        >
                            About Us
                        </motion.h1>
                        <motion.p
                            variants={FadeUp(0.7)}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            className='text-lg sm:text-xl text-gray-600 max-w-[50rem]'
                        >
                            Our platform creates personalized diet plans tailored to your health goals, dietary preferences, and lifestyle. Whether you aim to lose weight, build muscle, or maintain a balanced diet, we provide customized meal recommendations that fit your needs. With an intelligent recipe generator and automated grocery lists, eating healthy becomes effortless. Plus, our community support keeps you motivated on your journey. Best of all, it's completely free—because good health should be accessible to everyone.
                        </motion.p>
                        <motion.p
                            variants={FadeUp(0.9)}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            className='text-lg sm:text-xl text-gray-600 max-w-[50rem]'
                        >
                            To learn more about the developers of this platform, click the button below.
                        </motion.p>
                        <motion.div
                            variants={FadeUp(0.9)}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            className='flex justify-center md:justify-start'
                        >
                            <Link href={"/team"} passHref>
                                <button className='primary-btn flex gap-2 items-center justify-center'>
                                    Developers Info
                                    <span><FaLaptop /></span>
                                </button>
                            </Link>
                        </motion.div>
                    </div>
                </div>

            </div>
        </section>
    )
}

export default Banner