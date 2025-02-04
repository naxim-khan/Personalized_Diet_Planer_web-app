"use client"
import React from 'react';
import { FaArrowRight } from "react-icons/fa6";
import { motion } from "framer-motion";
import { FadeRight, FadeUp, FadeLeft } from '@/components/utility/animation';
import Link from 'next/link';

const Hero = () => {
  return (
    <section className='mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl h-screen flex flex-col items-center justify-center mt-20 sm:mt-0' id='home'>
      <div className='container w-full grid grid-cols-1 md:grid-cols-2 min-h-[650px] relative justify-center py-8 sm:py-2'>
        {/* platform Info */}
        <div className='flex flex-col justify-center md:py-0 relative z-10'>
          <div className='text-center md:text-left space-y-6 lg:max-w-[500px] '>
            <motion.h3
              variants={FadeLeft(0.4)}
              initial='hidden'
              animate='visible'
              className="text-xl lg:text-2xl font-bold"
            >
              Transform Your Health with
            </motion.h3>
            <motion.h1
              variants={FadeRight(0.5)}
              initial='hidden'
              animate='visible'
              className='hero_title text-4xl lg:text-6xl font-bold '>
              Personalized Diet Plans
            </motion.h1>
            <motion.p
              variants={FadeUp(0.6)}
              initial='hidden'
              animate='visible'
              className="text-2xl font-semibold"
            >
              Register Now For Fresh Healthy Life
            </motion.p>

            <motion.p
              variants={FadeLeft(0.7)}
              initial='hidden'
              animate='visible'
              className='text-gray-600 text-lg'>
              Discover recipes tailored to your goals, manage your nutrition, and unlock a healthier lifestyle today.
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

        {/* hero Images */}
        <div className='flex justify-center items-center mt-4'>
          <motion.img
            initial={{ opacity: 0, x: 200, rotate: 75 }}
            animate={{ opacity: 1, x: 0, rotate: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            src='./img/fruit-plate.png'
            alt=''
            className='w-[350px] md:w-[550px] drop-shadow rotate-image' />
        </div>
        {/* leaf image */}
        <div className='absolute -top-3 md:-top-4 right-1/2 blur-sm opacity-80 rotate-[40deg]'>
          <motion.img
            initial={{ opacity: 0, y: -200, rotate: 75 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            transition={{ duration: 1, delay: 1.5 }}
            src='./img/leaf.png'
            alt='leaf'
            className='w-[100px] sm:max-w-[200px] md:min-w-[300px] lg:min-w-[300px]' />
        </div>
      </div>
    </section>
  )
}

export default Hero