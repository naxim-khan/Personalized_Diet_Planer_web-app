"use client"
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FadeLeft } from '@/components/utility/animation';
import { FaRegClipboard, FaShoppingCart, FaUsers } from "react-icons/fa";
import { GiCookingPot } from "react-icons/gi";

const Feature = () => {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const cardsData = [
        {
            id: 1,
            icon: <FaRegClipboard />,
            title: "Personalized Diet Plans",
            content: "Generate diet plans tailored specifically to your health goals, preferences, and lifestyle.",
            accentColor: "#03eb41",
            animationDelay: 0.5
        },
        {
            id: 2,
            icon: <GiCookingPot />,
            title: "Get Smart Recipes",
            content: "Get creative and practical meal ideas based on your dietary preferences and restrictions.",
            accentColor: "#27a567",
            animationDelay: 1
        },
        {
            id: 3,
            icon: <FaShoppingCart />,
            title: "Easy Groceries",
            content: "Get tailored grocery lists for each meal, saving you time and effort.",
            accentColor: "#38cb82",
            animationDelay: 1.5
        },
        {
            id: 4,
            icon: <FaUsers />,
            title: "Connect with a Community",
            content: "Join a vibrant community to share your progress, swap tips, and stay motivated.",
            accentColor: "#64e3a1",
            animationDelay: 2
        }
    ];

    if (!isClient) {
        return null; // Prevent rendering until the component is mounted on the client
    }

    return (
        <section className="mx-auto  px-4 sm:px-6 lg:px-8 max-w-7xl  mb-10 relative" id="features">
            {/* Title */}
            <div className='text-center space-y-4 py-10'>
                <motion.h1
                    variants={FadeLeft(0.3)}
                    initial={{ opacity: 0, x: -200 }}
                    whileInView={"visible"}
                    transition={{ duration: 1, delay: 0.3 }}
                    className="text-gradient text-4xl lg:text-5xl font-bold text-center"
                >
                    Why Choose Us?
                </motion.h1>
                <div className='w-full flex items-center justify-center'>
                    <motion.p
                        variants={FadeLeft(0.5)}
                        initial={{ opacity: 0, x: -200 }}
                        whileInView={"visible"}
                        transition={{ duration: 1, delay: 0.3 }}
                        className='text-lg sm:text-xl  text-center  text-gray-600 max-w-[50rem]'
                    >
                        A free platform offering personalized diets, smart tools, and community support to help you reach your health goals easily.
                    </motion.p>
                </div>
            </div>
            {/* Cards */}
            <div className='pb-10'>
                <ul>
                    {cardsData.map(({ id, icon, title, content, accentColor, animationDelay }) => (
                        <li
                            key={id} // Add key for each list item to avoid hydration error
                            // variants={FadeLeft(animationDelay)}
                            // initial={{ opacity: 0, x: -200 }}
                            // whileInView={"visible"}
                            // transition={{ duration: 1, delay: 0.3 }}
                            className="card max-w-[100%] sm:max-w-[15rem]"
                            style={{ "--accent-color": accentColor }}
                        >
                            <div className="icon">{icon}</div>
                            <div className="title">{title}</div>
                            <div className="content">{content}</div>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
};

export default Feature;
