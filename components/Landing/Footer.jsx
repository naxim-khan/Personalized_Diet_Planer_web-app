"use client"
import React from 'react'
import { FaFacebook, FaTwitter, FaInstagram, FaGithub } from 'react-icons/fa'
const Footer = () => {
    return (
        <>
            <footer className='mt-80'>
                <div className="waves">
                    <div className="wave" id="wave1"></div>
                    <div className="wave" id="wave2"></div>
                    <div className="wave" id="wave3"></div>
                    <div className="wave" id="wave4"></div>
                </div>
                <ul className="social_icon">
                    <li><a href="#">
                        <FaFacebook />
                    </a>
                    </li>
                    <li><a href="#">
                        <FaInstagram />
                    </a></li>
                    <li><a href="#">
                        <FaGithub />
                    </a></li>
                    <li><a href="#">
                        <FaTwitter />
                    </a></li>
                </ul>
                <ul className="menu">
                    <li><a href="#">Home</a></li>
                    <li><a href="#">About Us</a></li>
                    <li><a href="#">Services</a></li>
                    <li><a href="#">Contact</a></li>
                </ul>
                <p>&copy; 2025 | Nazeem Khan | All Right Reserved  </p>
            </footer>
        </>
    )
}

export default Footer