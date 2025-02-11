"use client";
import React from 'react';
import AnimatedCounter from './AnimatedCounter';
// Charts
import DoughnutChart from "@/components/charts/DoughnutChart";
import PieChart from "@/components/charts/PieChart";

import Link from 'next/link';
import { FaExternalLinkAlt } from 'react-icons/fa';

const ChartCards = () => {
    const chartsData = [
        {
            labels: ['Carbs', 'Protein', 'Fats'],
            dataset: [30, 40, 30]
        },
        {
            labels: ['Consumed', 'Remaining'],
            dataset: [75, 25]
        },
        {
            labels: ['Completed', 'Remaining'],
            dataset: [25, 75]
        },
    ]

    const cardData = [
        {
            chart: <PieChart labels={chartsData[0].labels} dataset={chartsData[0].dataset} />,
            title: "Current Meal Plan",
            content: "Analyze your daily nutrition intake and balance",
            linkText: "Go to My diet plan page",
            link: "#",
            dataIndex: 0, // Corresponds to chartsData index
        },
        {
            chart: <DoughnutChart labels={chartsData[1].labels} dataset={chartsData[1].dataset} />,
            title: "Weekly Goal Status",
            content: "Track your weekly fitness targets progress",
            linkText: "Update Status",
            link: "#",
            dataIndex: 1, // Corresponds to chartsData index
        },
        {
            chart: <DoughnutChart labels={chartsData[2].labels} dataset={chartsData[2].dataset} />,
            title: "Calories Consumed Today",
            content: "Monitor your daily calorie consumption",
            linkText: "See Breakdown",
            link: "#",
            dataIndex: 2, // Corresponds to chartsData index
        },
    ]

    return (
        <section className='w-full items-center gap-4 rounded-xl  sm:gap-6 sm:p-6'>
            {/* Charts Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 py-4">
                {cardData.map((item, index) => (
                    <div
                        key={index}
                        className={`
                                flex flex-col  h-full px-4 border-gray-200 shadow-chart rounded-xl
                                ${index === 2 ? "lg:col-span-2 md:col-span-2" : ""}
                            `}
                    >
                        {/* Card Header */}
                        <div className="py-2">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-xs px-3 py-1 rounded-full">
                                    {item.title}:
                                </span>
                                <span className="truncate">Name of plan</span>
                            </h3>
                        </div>

                        {/* Chart Container */}
                        <div className="relative h-36 sm:h-48 w-full mb-4 rounded-lg bg-gray-50/50 dark:bg-gray-900/30 p-3 backdrop-blur-sm">
                            <div className="absolute inset-0 flex items-center justify-center py-2">
                                {item.chart}
                            </div>
                        </div>

                        {/* Content Section */}
                        <div className="mt-auto space-y-4 py-4">
                            <p className="text-gray-600 dark:text-gray-300 text-sm  text-center">
                                {item.content}:
                            </p>

                            {/* Display labels and dataset values separately */}
                            {/* <div className="flex w-full items-center justify-center gap-2">
                                {chartsData[item.dataIndex].labels.map((label, i) => (
                                    <div key={i} className='flex items-center justify-center gap-2 text-sm'>
                                        {label}:
                                        <AnimatedCounter amount={chartsData[item.dataIndex].dataset[i]} />|
                                    </div>
                                ))}
                            </div> */}
                            <Link
                                href={item.link}
                                className="flex items-center justify-center text-sm text-green-600 hover:text-green-800 dark:text-green-400 
                                    dark:hover:text-green-300 font-medium group transition-colors"
                            >
                                <span className="mr-2 border-b border-transparent group-hover:border-green-600 dark:group-hover:border-green-400 transition-all">
                                    {item.linkText}
                                </span>
                                <FaExternalLinkAlt className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default ChartCards;
