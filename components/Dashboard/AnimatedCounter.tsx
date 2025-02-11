'use client'
import React from 'react'
import CountUp from 'react-countup'
const AnimatedCounter = ({ amount }: { amount: number }) => {
    return (
        <div className='flex items-center justify-center gap-2'>
            <CountUp duration={2} decimal=',' end={amount} />
        </div>
    )
}

export default AnimatedCounter