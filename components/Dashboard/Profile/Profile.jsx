'use client'
import React, { useEffect, useState, useRef } from 'react'
import { cn } from "../../lib/utils";
import { BentoGrid, BentoGridItem } from "../../ui/bento-grid";
import { IconCheck, IconLeaf, IconShoppingBag, IconChartDonut, IconMeat, IconGlassFull, IconChefHat } from "@tabler/icons-react";
import { motion } from "framer-motion";
import Image from "next/image";
import { AnimatedList } from "../../../components/magicui/animated-list";
import { AnimatedCircularProgressBar } from '../../../components/magicui/animated-circular-progress-bar';

import Link from 'next/link';
import DetailCard from './DetailCard';
import BmiGauge from './BmiGauge';

import { updateUserProfile } from '../../../lib/actions/users.action';

// Default data structure to prevent null errors
const defaultDummyData = {
  mealPlan: {
    today: {
      breakfast: { name: 'No meal planned', calories: 0, ingredients: [] },
      lunch: { name: 'No meal planned', calories: 0, ingredients: [] },
      dinner: { name: 'No meal planned', calories: 0, ingredients: [] },
    }
  },
  nutrition: {
    targetCalories: 2000,
    consumed: 0,
    macros: { protein: 0, carbs: 0, fats: 0 },
    water: 0
  },
  groceryList: []
};

// Cards
const MealPlanCard = ({ mealPlan }) => {
  const meals = Object.entries(mealPlan.today);

  return (
    <div className="relative   bg-white rounded-3xl p-6 shadow-lg border border-emerald-50">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-emerald-100 rounded-xl">
          <IconChefHat className="w-6 h-6 text-emerald-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Today's Meals</h2>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {meals.map(([mealType, details]) => (
          <motion.div
            key={mealType}
            whileHover={{ scale: 1.02 }}
            className="flex-shrink-0 w-64 bg-gradient-to-br from-emerald-50 to-white rounded-2xl p-5 border border-emerald-100"
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
              <span className="text-sm font-semibold text-emerald-600 uppercase">
                {mealType}
              </span>
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">{details.name}</h3>
            <p className="text-sm text-emerald-600 mb-3">
              🍴 {details.ingredients?.slice(0, 3).join(', ')}
            </p>
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm">
                {details.calories} kcal
              </span>
              <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
                <IconLeaf className="w-4 h-4 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const NutritionCard = ({ nutrition }) => {
  const progress = (nutrition.consumed / nutrition.targetCalories) * 100;

  return (
    <div className="bg-white rounded-3xl p-6 shadow-lg border border-emerald-50">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-emerald-100 rounded-xl">
          <IconChartDonut className="w-6 h-6 text-emerald-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Nutrition Tracking</h2>
      </div>

      <div className="space-y-6">
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-emerald-600">Daily Progress</span>
            <span className="font-semibold">{Math.round(progress)}%</span>
          </div>
          <div className="h-3 bg-emerald-50 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {Object.entries(nutrition.macros).map(([macro, value]) => (
            <div key={macro} className="text-center p-3 bg-emerald-50 rounded-xl">
              <div className="text-2xl font-bold text-emerald-600">{value}g</div>
              <div className="text-sm text-gray-600 capitalize">{macro}</div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-xl">
          <IconGlassFull className="w-6 h-6 text-emerald-600" />
          <div className="flex-1">
            <div className="flex justify-between mb-1">
              <span className="text-sm text-emerald-600">Water Intake</span>
              <span className="text-sm font-semibold">{nutrition.water}/8 glasses</span>
            </div>
            <div className="flex gap-1">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className={`w-1/12 h-2 rounded-full ${i < nutrition.water ? 'bg-emerald-500' : 'bg-emerald-100'}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const GroceryCard = ({ groceryList }) => {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-lg border border-emerald-50">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-emerald-100 rounded-xl">
          <IconShoppingBag className="w-6 h-6 text-emerald-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Grocery List</h2>
      </div>

      <div className="space-y-3 custom-scrollbar px-2 max-h-[15rem] overflow-hidden overflow-y-scroll">
        {groceryList.map((item, i) => (
          <motion.div
            key={i}
            whileHover={{ x: 5 }}
            className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg"
          >
            <IconCheck className={`w-5 h-5 ${item.bought ? 'text-emerald-600' : 'text-emerald-200'}`} />
            <span className={`${item.bought ? 'line-through text-gray-400' : 'text-gray-700'}`}>
              {item.name}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dummyData, setDummyData] = useState(defaultDummyData);

  // profile image upload
  const fileInputRef = useRef(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'profile_images'); // Make sure this matches your Cloudinary preset name

      const cloudinaryRes = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: 'POST', body: formData }
      );

      if (!cloudinaryRes.ok) {
        throw new Error('Cloudinary upload failed');
      }

      const cloudinaryData = await cloudinaryRes.json();
      console.log("Cloudinary Response:", cloudinaryData); // Debugging

      // Update Appwrite with the new image URL
      const updateResult = await updateUserProfile(user.$id, cloudinaryData.secure_url);

      if (!updateResult.success) {
        throw new Error(updateResult.error);
      }

      setUser(prev => ({
        ...prev,
        profile_img: cloudinaryData.secure_url
      }));

    } catch (error) {
      console.error('Upload error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // progress bar
  const [value, setValue] = useState(0);
  useEffect(() => {
    const handleIncrement = (prev) => {
      if (prev === 100) {
        return 0;
      }
      return prev + 10;
    };
    setValue(handleIncrement);
    const interval = setInterval(() => setValue(handleIncrement), 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchDietPlan = async () => {
      try {
        const response = await fetch("/api/dietplans/");
        const data = await response.json();

        if (data?.dietPlan?.daily_plan) {
          const todayIndex = (new Date().getDay() + 6) % 7;
          const todayData = data.dietPlan.daily_plan[todayIndex];
          console.log(todayData)

          if (todayData) {
            setDummyData({
              mealPlan: {
                today: {
                  breakfast: {
                    name: todayData.breakfast[0]?.meal || "No meal",
                    calories: todayData.breakfast[1]?.calories || 0,
                    ingredients: todayData.breakfast[0]?.ingredients || [],
                  },
                  lunch: {
                    name: todayData.lunch[0]?.meal || "No meal",
                    calories: todayData.lunch[1]?.calories || 0,
                    ingredients: todayData.lunch[0]?.ingredients || [],
                  },
                  dinner: {
                    name: todayData.dinner[0]?.meal || "No meal",
                    calories: todayData.dinner[1]?.calories || 0,
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
                water: 5,
              },
              groceryList: data.dietPlan.all_ingredients?.map((item) => ({
                name: item,
                bought: false,
              })) || [],
            });
          }
        }
      } catch (error) {
        console.error("Error fetching diet plan:", error);
        setDummyData(defaultDummyData);
      }
    };

    fetchDietPlan();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/user', { credentials: 'include' });
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const data = await response.json();
        if (!data.success || !data.user) throw new Error('Failed to fetch user data');

        setUser(data.user);
      } catch (err) {
        console.error('Failed to fetch user data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) return <div>
    <AnimatedCircularProgressBar
      max={100}
      min={0}
      value={value}
      gaugePrimaryColor="rgb(79 70 229)"
      gaugeSecondaryColor="rgba(0, 0, 0, 0.1)"
    />
  </div>;
  if (error) return <div className="text-red-500 p-6">Error: {error}</div>;
  if (!user) return <div>No user data found</div>;

  return (
    <div className="max-w-7xl mx-auto px-4  py-8">
      <div className="max-w-7xl mx-auto  py-4 ">
        {/* Profile Header Section */}
        <div className="flex flex-col md:flex-row  items-center gap-4 md:gap-6 mb-8 bg-gradient-to-r from-green-50 to-emerald-50 p-4 md:p-6 rounded-2xl shadow-sm">
          <div className='w-full md:w-1/3 flex items-center justify-center gap-4'>
            <div className='flex items-center justify-center gap-4'>
              <div className="relative group w-20 h-20 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-green-100 to-emerald-200 flex items-center justify-center shrink-0">
                {user.profile_img ? (
                  <div className="relative w-32 h-32">
                    <Image
                      src={user.profile_img}
                      alt="Profile"
                      width={128}
                      height={128}
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                ) : (
                  <div className="relative group w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-2xl md:text-4xl">👤</span>

                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="profileUpload"
                      ref={fileInputRef}
                    />

                    <label
                      htmlFor="profileUpload"
                      className="absolute inset-0 bg-black/60 text-white text-xs md:text-sm rounded-full flex items-center justify-center cursor-pointer transition-opacity duration-300 opacity-0 group-hover:opacity-100 bg-gradient-green"
                    >
                      Upload
                    </label>
                  </div>
                )}

              </div>
              <div className="text-left flex-1 min-w-0">
                <h1 className="text-xl md:text-3xl font-bold text-gray-800 mb-1 truncate">{user.firstName + " " + user.lastName}</h1>
                <p className="text-sm md:text-base text-gray-600 mb-2 truncate">{user.email}</p>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-emerald-100 text-emerald-800 px-2 py-1 md:px-3 md:py-1 rounded-full text-xs md:text-sm font-medium">
                    {user.dietaryRestrictions || 'No dietary restrictions'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Details Grid Section */}
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 mb-8">
            <DetailCard title="Weight" value={`${user.weight} kg`} icon="⚖️" />
            <DetailCard title="Height" value={`${user.height} cm`} icon="📏" />
            <DetailCard title="Activity Level" value={user.activityLevel} icon="🏃" />
            <DetailCard title="Fitness Goal" value={user.fitnessGoal} icon="🎯" />
            <DetailCard title="Preferred Cuisine" value={user.preferredCuisine} icon="🍲" />
            <DetailCard title="Cooking Style" value={user.cookingStyle} icon="👨🍳" />
          </div>
        </div>

        {/* BMI Gauge Section */}
        <div className="mb-8 flex items-center justify-center w-full">
          <BmiGauge weight={user.weight} height={user.height} />
        </div>
      </div>

      {!dummyData.mealPlan.today.breakfast.name.includes('No meal') ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* First Row - Three Main Cards */}
          <div className="md:col-span-2 lg:col-span-1">
            <MealPlanCard mealPlan={dummyData.mealPlan} />
          </div>
          <div className="md:col-span-2 lg:col-span-1">
            <NutritionCard nutrition={dummyData.nutrition} />
          </div>
          <div className="md:col-span-2 lg:col-span-1">
            <GroceryCard groceryList={dummyData.groceryList} />
          </div>

          {/* Second Row - Weekly Progress */}
          <div className="md:col-span-2 lg:col-span-3">
            <div className="bg-gradient-to-br from-emerald-500 to-green-600 rounded-3xl p-6 text-white h-full">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-white/20 rounded-xl">
                  <IconMeat className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold">Weekly Progress</h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                {[...Array(7)].map((_, i) => (
                  <div key={i} className="text-center">
                    <div className="h-20 sm:h-24 bg-white/10 rounded-xl mb-2"></div>
                    <span className="text-xs sm:text-sm">Day {i + 1}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center p-8 bg-yellow-50 rounded-xl">
          <h2 className="text-2xl font-semibold mb-4">No Diet Plan Found</h2>
          <p className="text-gray-600 mb-4">You don't have an active diet plan. Would you like to create one?</p>
          <Link href={'/dashboard/dietplan'}>
            <button className="text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 bg-green-400">
              Create New Diet Plan
            </button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Profile;