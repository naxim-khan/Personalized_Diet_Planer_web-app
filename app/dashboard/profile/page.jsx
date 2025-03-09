import React from 'react'
import Profile from "../../../components/Dashboard/Profile/Profile"
const page = () => {
  return (
    <section
      className='rounded-tl-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex flex-col items-center justify-center gap-2 flex-1 w-full h-screen overflow-hidden'
      style={{
        backgroundColor: "#fafffb",
        backgroundImage: 'url("https://www.transparenttextures.com/patterns/blizzard.png")',
        backgroundSize: "auto",
        backgroundRepeat: "repeat",
        minHeight: 'fit-content'

      }}

    >
      <Profile />

    </section>
  )
}

export default page