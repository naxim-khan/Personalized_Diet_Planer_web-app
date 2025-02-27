"use client";
import React from "react";
import { FaFacebook, FaGithub, FaLinkedin } from "react-icons/fa";

const TeamShowCase = () => {
    const card_content = [
        {
            name: "Nazeem Khan",
            img: "./img/nazeem.png",
            role: "Full Stack Developer",
            content: "Oversees end-to-end platform development, ensuring robust and user-friendly functionality."
        },
        {
            name: "Syeda Amna",
            img: "./img/amn-cartoon3.png",
            role: "Architecture & Research",
            content: "Designs system architecture and AI solutions to power intelligent platform features."
        },
        {
            name: "Shareefa",
            img: "./img/amn-cartoon3.png",
            role: "UI/UX & Testing",
            content: "Creates intuitive interfaces and ensures flawless performance across all devices."
        }
    ];
    return (
        <div className="mt-8">
            <div className="text-center py-8 gap-5 ">
                <h1
                    className='text-3xl  lg:text-5xl font-bold uppercase text-gradient'
                >
                    Our Team Members
                </h1>
                <div className="w-full flex items-center justify-center">
                    <p className="text-gray-600 text-base sm:text-lg pb-8 sm:pb-0 py-3 max-w-6xl ">
                        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Veritatis quos pariatur iure neque quia vitae sed officia natus velit dolor expedita, consectetur optio a incidunt hic delectus placeat aperiam molestias ex eveniet non consequuntur? Voluptatum.
                    </p>
                </div>
            </div>

            {/* Cards */}
            <div className="m-container w-full bg-cover " >
                {card_content.map((card, index) => (
                    <div className="m-card " style={{ "--clr": "#03eb41" }} key={index}>
                        <div className="m-box white-gray-gradient">
                            <div className="m-icon">
                                <div className="m-iconbox" style={{ backgroundImage: `url('${card.img}')` }}>
                                    {/* <!-- <ion-icon name="brush-outline"></ion-icon> --> */}
                                </div>
                            </div>
                            <div className="m-content text-sm ">
                                <h3>{card.name}</h3>
                                <p className="py-4">
                                    {card.content}
                                </p>
                                <span className="role" href="#">{card.role}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

        </div>
    )
}

export default TeamShowCase