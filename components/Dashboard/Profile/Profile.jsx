'use client'
import React, { useEffect, useState } from 'react'

import { cn } from "../../lib/utils";
import { BentoGrid, BentoGridItem } from "../../ui/bento-grid";
import {
  IconBoxAlignRightFilled,
  IconClipboardCopy,
  IconFileBroken,
  IconSignature,
  IconTableColumn,
} from "@tabler/icons-react";
import { motion } from "framer-motion";
import Image from "next/image";
import { UserDetails } from '../DietPlanUI/UserDetails';
import { AnimatedList } from "../../../components/magicui/animated-list";

const SkeletonOne = ({ mealPlan }) => {
  const variants = {
    initial: { x: 0 },
    animate: { x: 10, rotate: 5, transition: { duration: 0.2 } },
  };

  // Convert mealPlan.today object into an array and repeat it 100 times
  const mealEntries = Object.entries(mealPlan.today);
  const largeInstructionSet = Array.from({ length: 100 }, () => mealEntries).flat();
  console.log("skeletondata; ", mealPlan.today)
  return (
    <motion.div
      initial="initial"
      className="relative flex flex-1 w-full max-h-[10rem] sm:max-h-[15rem] min-h-[6rem]  flex-col space-y-2 overflow-hidden"
    >
      <AnimatedList delay={4000} className="gap-3">
        {largeInstructionSet.map(([mealType, details], index) => (
          <motion.li
            key={`${mealType}-${index}`}
            variants={variants}
            className="relative mx-auto min-h-fit w-[calc(100%-10px)] cursor-pointer transition-all duration-200 ease-in-out hover:scale-[103%]"
          >
            <div className="flex flex-col rounded-lg border border-neutral-100 dark:border-white/[0.2]  bg-white dark:bg-black">
              {/* Meal Category Name (e.g., Breakfast, Lunch, Dinner) */}
              <span className="uppercase text-xs font-bold  dark:text-gray-300 mb-1 h-full w-full py-2 flex items-center justify-center rounded-t-lg bg-gradient-to-l from-green-500 to-green-200 text-white">
                {mealType}
              </span>

              <div className='py-2 px-2'>
                {/* Meal Header */}
                <div className="flex justify-between items-center ">
                  <span className="capitalize font-semibold text-md">{details.name}</span>
                  <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">
                    {details.calories || "N/A"} kcal
                  </span>
                </div>

                {/* Ingredients List */}
                <ul className="mt-2 text-xs text-gray-500 dark:text-gray-400 flex flex-wrap gap-1">
                  {details.ingredients?.map((ingredient, i) => (
                    <li key={i} className="before:content-['•'] before:mr-1 px-2 rounded-lg bg-green-600 text-white flex items-center justify-center">
                      {ingredient}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.li>
        ))}
      </AnimatedList>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-white rounded-b-lg"></div>
    </motion.div>
  );
};


const SkeletonTwo = ({ nutrition }) => {
  const variants = {
    initial: { width: 0 },
    animate: { width: "100%", transition: { duration: 0.2 } },
    hover: { width: ["0%", "100%"], transition: { duration: 2 } },
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      whileHover="hover"
      className="flex flex-1 w-full h-full min-h-[6rem] dark:bg-dot-white/[0.2] bg-dot-black/[0.2] flex-col space-y-2 p-4"
    >
      <div className="space-y-4">
        <motion.div
          variants={variants}
          className="h-3 bg-gray-100 rounded-full overflow-hidden"
        >
          <div
            className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600"
            style={{ width: `${(nutrition.consumed / nutrition.targetCalories * 100)}%` }}
          />
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Object.entries(nutrition.macros).map(([macro, value]) => (
            <motion.div
              key={macro}
              whileHover={{ scale: 1.05 }}
              className="text-center p-1 bg-emerald-50 rounded-xl flex items-center justify-center gap-2"
            >
              <div className="text-lg font-bold text-emerald-700">{value}</div>
              <div className="text-xs text-gray-600 capitalize">{macro}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const SkeletonThree = ({ groceryList }) => {
  const variants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    initial: { x: -20 },
    animate: { x: 0 }
  };

  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="animate"
      className="flex flex-1 w-full h-full min-h-[6rem] dark:bg-dot-white/[0.2] bg-dot-black/[0.2] flex-col space-y-2 p-4 overflow-x-hidden"
    >
      {groceryList.map((item, i) => (
        <motion.div
          key={i}
          variants={itemVariants}
          className="flex items-center gap-3 p-2 hover:bg-emerald-50 rounded-lg transition-colors"
        >
          <input
            type="checkbox"
            defaultChecked={item.bought}
            className="form-checkbox h-4 w-4 text-emerald-600"
          />
          <span className={`text-sm ${item.bought ? 'line-through text-gray-400' : 'text-gray-700'}`}>
            {item.name}
          </span>
        </motion.div>
      ))}
    </motion.div>
  );
};

const SkeletonFour = ({ healthGoals, recipes }) => {
  const first = {
    initial: { x: 20, rotate: -5 },
    hover: { x: 0, rotate: 0 },
  };
  const second = {
    initial: { x: -20, rotate: 5 },
    hover: { x: 0, rotate: 0 },
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      whileHover="hover"
      className="flex flex-1 w-full h-full min-h-[6rem] dark:bg-dot-white/[0.2] bg-dot-black/[0.2] flex-row space-x-2"
    >
      {recipes.map((recipe, i) => (
        <motion.div
          key={i}
          variants={i === 0 ? first : i === 2 ? second : {}}
          className={`h-full w-1/3 rounded-2xl bg-white p-2 dark:bg-black flex flex-col items-center justify-center border `}
        >
          <div className="relative w-full h-32 rounded-lg overflow-hidden ">
            <div className="absolute inset-0 bg-gradient-to-b from-green-800 to-green-400 flex items-end justify-center ">
              <Image
                src={'/img/nazeem.png'}
                alt='png'
                width={200}
                height={200}
                className='  bg-cover w-[120]  rounded-t-xl'
              />
            </div>
          </div>
          <p className="text-sm text-center font-medium mt-2">{recipe.name}</p>
          <div className="flex gap-1 mt-2">
            <span className="text-xs px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full">
              {recipe.time}
            </span>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

const SkeletonFive = () => {
  const variants = {
    initial: {
      x: 0,
    },
    animate: {
      x: 10,
      rotate: 5,
      transition: {
        duration: 0.2,
      },
    },
  };
  const variantsSecond = {
    initial: {
      x: 0,
    },
    animate: {
      x: -10,
      rotate: -5,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <motion.div
      initial="initial"
      whileHover="animate"
      className="flex flex-1 w-full h-full min-h-[6rem] dark:bg-dot-white/[0.2] bg-dot-black/[0.2] flex-col space-y-2"
    >
      <motion.div
        variants={variants}
        className="flex flex-row rounded-2xl border border-neutral-100 dark:border-white/[0.2] p-2  items-start space-x-2 bg-white dark:bg-black"
      >
        <Image
          src="/img/nazeem.png"
          alt="avatar"
          height="100"
          width="100"
          className="rounded-full h-10 w-10"
        />
        <p className="text-xs text-neutral-500">
          There are a lot of cool framerworks out there like React, Angular,
          Vue, Svelte that can make your life ....
        </p>
      </motion.div>
      <motion.div
        variants={variantsSecond}
        className="flex flex-row rounded-full border border-neutral-100 dark:border-white/[0.2] p-2 items-center justify-end space-x-2 w-3/4 ml-auto bg-white dark:bg-black"
      >
        <p className="text-xs text-neutral-500">Use PHP.</p>
        <div className="h-6 w-6 rounded-full bg-gradient-to-r from-pink-500 to-violet-500 flex-shrink-0" />
      </motion.div>
    </motion.div>
  );
};


const Profile = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [dummyData, setDummyData] = useState(null);

  // fetch the dietplan data
  useEffect(() => {
    const fetchDietPlan = async () => {
      try {
        const response = await fetch("/api/dietplans/");
        const data = await response.json();

        if (data?.dietPlan?.daily_plan) {
          const todayIndex = new Date().getDay(); // 0 (Sunday) to 6 (Saturday)
          const todayData = data.dietPlan.daily_plan[todayIndex - 1]; // Adjust index (assuming Monday is Day 1)

          if (todayData) {
            setDummyData({
              mealPlan: {
                today: {
                  breakfast: {
                    name: todayData.breakfast[0]?.meal || "No meal",
                    calories: todayData.breakfast[1]?.calories || 0, // Fix here
                    ingredients: todayData.breakfast[0]?.ingredients || [],
                  },
                  lunch: {
                    name: todayData.lunch[0]?.meal || "No meal",
                    calories: todayData.lunch[1]?.calories || 0, // Fix here
                    ingredients: todayData.lunch[0]?.ingredients || [],
                  },
                  dinner: {
                    name: todayData.dinner[0]?.meal || "No meal",
                    calories: todayData.dinner[1]?.calories || 0, // Fix here
                    ingredients: todayData.dinner[0]?.ingredients || [],
                  },
                },
              },
              nutrition: {
                targetCalories: data.dietPlan.calories_per_day || 2000,
                consumed:
                  (todayData.breakfast[1]?.calories || 0) +
                  (todayData.lunch[1]?.calories || 0) +
                  (todayData.dinner[1]?.calories || 0),
                macros: data.dietPlan.macronutrient_distribution || {
                  protein: 0,
                  carbs: 0,
                  fats: 0,
                },
                water: 5, // Assuming default value
              },
              groceryList: data.dietPlan.all_ingredients.map((item) => ({
                name: item,
                bought: false,
              })),
            });

          }
        }
      } catch (error) {
        console.error("Error fetching diet plan:", error);
      }
    };

    fetchDietPlan();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/user', {
          credentials: 'include', // Include cookies for session-based auth
        })

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }

        const data = await response.json()

        if (!data.success || !data.user) {
          throw new Error('Failed to fetch user data')
        }

        setUser(data.user)
      } catch (err) {
        console.error('Failed to fetch user data:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [])

  if (loading) return <div>Loading...</div>
  if (error) return <div className="text-red-500 p-6">Error: {error}</div>
  if (!user) return <div>No user data found</div>


  //   if (loading) return <ProfileSkeleton />
  if (error) return <div className="text-red-500 p-6">Error: {error}</div>


  const items = [
    {
      title: "Today's Meal Plan",
      description: "Your daily nutrition schedule",
      header: <SkeletonOne mealPlan={dummyData.mealPlan} />,
      className: "md:col-span-1",
      icon: <IconClipboardCopy className="h-4 w-4 text-neutral-500" />,
    },
    {
      title: "Nutrition Tracking",
      description: "Your daily nutrition intake",
      header: <SkeletonTwo nutrition={dummyData.nutrition} />,
      className: "md:col-span-1",
      icon: <IconFileBroken className="h-4 w-4 text-neutral-500" />,
    },
    {
      title: "Grocery List",
      description: "Your shopping list for the week",
      header: <SkeletonThree groceryList={dummyData.groceryList} />,
      className: "md:col-span-1",
      icon: <IconSignature className="h-4 w-4 text-neutral-500" />,
    },
    {
      title: "Recommended Recipes",
      description: "Personalized recipe suggestions",
      header: <SkeletonFour
        healthGoals={user?.fitnessGoal}
        recipes={[
          { name: "Protein Salad", time: "20 mins" },
          { name: "Quinoa Bowl", time: "30 mins" },
          { name: "Grilled Chicken", time: "25 mins" }
        ]}
      />,
      className: "md:col-span-2",
      icon: <IconTableColumn className="h-4 w-4 text-neutral-500" />,
    },
    {
      title: "Text Summarization",
      description: "Summarize your lengthy documents",
      header: <SkeletonFive />,
      className: "md:col-span-1",
      icon: <IconBoxAlignRightFilled className="h-4 w-4 text-neutral-500" />,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-10">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row items-center gap-6 mb-8 bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl shadow-sm">
        <div className="relative group w-32 h-32 rounded-full bg-gradient-to-br from-green-100 to-emerald-200 flex items-center justify-center">
          <span className="text-4xl">👤</span>
          <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span className="text-white text-sm">Upload</span>
          </div>
        </div>
        <div className="text-center md:text-left">
          <h1 className="text-3xl font-bold text-gray-800 mb-1">{user.firstName + " " + user.lastName}</h1>
          <p className="text-gray-600 mb-2">{user.email}</p>
          <div className="flex flex-wrap gap-2 justify-center md:justify-start">

            <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-medium">
              {user.dietaryRestrictions}
            </span>

          </div>
        </div>
      </div>

      <BentoGrid className="max-w-7xl mx-auto md:auto-rows-[20rem] ">
        {items.map((item, i) => (
          <BentoGridItem
            key={i}
            title={item.title}
            description={item.description}
            header={item.header}
            className={cn("[&>p:text-lg]", item.className)}
            icon={item.icon}
          />
        ))}
      </BentoGrid>

    </div>
  )
}



export default Profile