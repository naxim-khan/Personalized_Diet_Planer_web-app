"use client";
import * as React from "react";
import { motion } from "framer-motion";
import { FadeLeft } from "../../utility/animation";
import { FaUserPlus, FaClipboardList, FaMagic, FaChartLine } from "react-icons/fa";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "../../../components/ui/card";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "../../../components/ui/carousel";


const HowItWorks = () => {
    const steps = [
        {
            title: "Sign Up",
            description: "Create your profile in minutes",
            icon: <FaUserPlus className="w-full h-full" />,
        },
        {
            title: "Provide Details",
            description: "Share your goals, health conditions, and preferences",
            icon: <FaClipboardList className="w-full h-full" />,
        },
        {
            title: "Generate Plans",
            description: "Get tailored diet plans and recipes instantly",
            icon: <FaMagic className="w-full h-full" />,
        },
        {
            title: "Achieve Results",
            description: "Track progress and stay on top of your health",
            icon: <FaChartLine className="w-full h-full" />,
        },
    ];

    return (
        <section className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl sm:py-8 relative">
            <div className="text-center">
                <h1
                    // variants={FadeUp(0.5)}
                    // initial="hidden"
                    // whileInView="visible"
                    // transition={{ duration: 1, delay: 0.3 }}
                    className="text-3xl lg:text-5xl font-bold uppercase text-gradient"
                >
                    How It Works
                </h1>
            </div>
            <div className='py-4 w-full flex items-center justify-center'>
                <motion.p
                    variants={FadeLeft(0.5)}
                    initial={{ opacity: 0, x: -200 }}
                    whileInView={"visible"}
                    transition={{ duration: 1, delay: 0.3 }}
                    className='text-base sm:text-lg  text-center  text-gray-600 max-w-[50rem]'
                >
                    A step-by-step approach to transforming your health: Sign up, share your goals, get personalized plans, and track your progress—all on one intuitive platform.
                </motion.p>
            </div>

            <div className="w-full flex flex-col items-center justify-center overflow-hidden py-4">
                <Carousel
                    opts={{
                        align: "start",
                    }}
                    className="w-full"
                >
                    <CarouselContent className=" mx-auto">
                        {steps.map((step, index) => (
                            <CarouselItem
                                key={index}
                                className="pl-1 basis-full md:basis-1/2 lg:basis-1/3"
                            >
                                <div className="p-2 h-full">
                                    <Card className="h-full transition-all hover:shadow-xl white-gray-gradient rounded-2xl border border-gray-50">
                                        <CardHeader>
                                            <div className="mb-4 flex items-center justify-center">
                                                <div className="w w-20 h-12 rounded-tr-full rounded-bl-full p-3  bg-gradient-to-r from-maincolor to-darkgreen rotate-[10deg] transition-transform duration-300 shadow-neu">
                                                    <span className="text-gray-50 text-lg">
                                                        {step.icon}
                                                    </span>
                                                </div>
                                            </div>
                                            <CardTitle className="text-2xl text-center">
                                                <span className="text-gradient">Step {index + 1}:</span> <br />
                                                {step.title}
                                            </CardTitle>
                                            <CardDescription className="text-lg text-center">
                                                {step.description}
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="flex justify-center">
                                                <div className="h-1 w-20 bg-blue-100 rounded-full" />
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>

                    {/* Custom Arrows */}
                    <div className="mt-2 flex justify-center min-h-fit py-4">
                        <CarouselPrevious className="static text-4xl translate-x-0 translate-y-0 w-20 h-12 rounded-none rounded-tr-full rounded-bl-full p-2 text-white font-bold hover:text-gray-200 hover:opacity-85 bg-gradient-to-r from-maincolor to-darkgreen rotate-[15deg] transition-transform duration-300 shadow-neu" />
                        <CarouselNext className="static text-2xl translate-x-0 translate-y-0 w-20 h-12 rounded-none rounded-tl-full rounded-br-full p-2 text-white font-bold hover:text-gray-200 hover:opacity-85 bg-gradient-to-r from-maincolor to-darkgreen rotate-[-15deg] transition-transform duration-300 shadow-neu" />
                    </div>
                </Carousel>
            </div>
        </section>
    );
};

export default HowItWorks;