"use client"
import React from 'react'
import ColourfulText from "../ui/colourful-text";
import {HeaderBoxProps} from "../../types/index";

const HeaderBox = ({ type = "title", title, subtext, user }: HeaderBoxProps) => {
    return (
        <div className='py-4 header-box'>
            <h1 className="header-box-title">
                {`${title},${" "}`}
                {type === 'greeting' && (
                    <ColourfulText text={user ?? "Guest"} />
                )}

            </h1>
            <p className="header-box-subtext">
                {subtext}
            </p>
        </div>
    )
}

export default HeaderBox