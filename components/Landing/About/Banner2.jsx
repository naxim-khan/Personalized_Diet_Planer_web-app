"use client"
import React from 'react';
import { FaInfoCircle, FaArrowRight } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { FadeRight, FadeUp, FadeLeft } from '../../utility/animation';
import Link from 'next/link';

const bgStyle = {
    backgroundImage: `url('/img/banner-bg.jpg')`,
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundAttachment: 'fixed'
}

const Banner2 = () => {
    return (
        <section className='mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl '>
            <div style={bgStyle} className="container grid grid-cols-1 md:grid-cols-2 space-y-6 md:space-y-0 py-14 relative border border-green-300 rounded-3xl">
                {/* blank div */}
                <div></div>
                {/* Platform Info */}
                <div className='flex flex-col justify-center '>
                    <div className='text-center md:text-left space-y-4 lg:max-w-[500px] text-lg sm:text-xl'>
                        <motion.h1
                            variants={FadeUp(0.5)}
                            initial="hidden"
                            whileInView='visible'
                            viewport={{ once: true }}
                            className='text-2xl lg:text-5xl font-bold uppercase text-gradient'
                        >
                            Why You'll Love this PLatform
                        </motion.h1>
                        <motion.p
                            variants={FadeUp(0.7)}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            className='text-base sm:text-lg'
                        >
                            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Veritatis quos pariatur iure neque quia vitae sed officia natus velit dolor expedita, consectetur optio a incidunt hic delectus placeat aperiam molestias ex eveniet non consequuntur? Voluptatum.
                        </motion.p>

                        {/* button section */}
                        <motion.div
                            className='flex justify-center md:justify-start'
                            variants={FadeRight(0.9)}
                            initial='hidden'
                            animate='visible'
                        >
                            <Link href={'/sign-in'}>
                                <button className='primary-btn flex gap-2 items-center justify-center'>
                                    Get Started
                                    <span><FaArrowRight /></span>
                                </button>
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Banner2