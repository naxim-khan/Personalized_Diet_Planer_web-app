import React from 'react'
import HeaderBox from "@/components/Dashboard/HeaderBox"
const page = () => {
  return (
    <section
      className='rounded-tl-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex flex-col gap-2 flex-1 w-full h-screen'
      style={{
        backgroundColor: "#fafffb",
        backgroundImage: 'url("https://www.transparenttextures.com/patterns/blizzard.png")',
        backgroundSize: "auto",
        backgroundRepeat: "repeat",
        minHeight: 'fit-content'

      }}

    >
      <header className='home-header'>
        <HeaderBox
          type="greeting"
          title="Welcome to"
          user={"Generate Your Diet"}
          subtext="Generate A Diet Plan or see existing plains here."
        />
      </header>
      <br />
      Diet Plan

    </section>
  )
}

export default page