import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Egg, Utensils, Cookie, Drumstick } from "lucide-react";
import { DietPlanTypes } from "../../../types";

export function MealPlanTable({ dietPlan }: { dietPlan: DietPlanTypes }) {
    return (
        <div className="grid grid-cols-1 gap-8 static z-10">
            {dietPlan.daily_plan?.map((dayPlan, index) => {
                // Calculate total daily calories
                const totalCalories = ["breakfast", "lunch", "snacks", "dinner"]
                    .reduce((sum, mealType) => {
                        const meals = dayPlan[mealType as keyof typeof dayPlan];
                        if (Array.isArray(meals)) {
                            return sum + meals.reduce((acc: number, meal: any) => {
                                const calories = meal.calories?.$numberInt || meal.calories || 0;
                                return acc + Number(calories);
                            }, 0);
                        }
                        return sum;
                    }, 0);

                const calorieTextColor = totalCalories > dietPlan.calories_per_day
                    ? "text-red-600"
                    : "text-emerald-600";

                // Define meal sections with conditional snacks
                type DayPlanType = { meal: string; ingredients: string[]; }[] | number;
                const mealSections = [
                    ['breakfast', <Egg className="w-5 h-5 text-yellow-500" />, 'Breakfast', 'border-amber-200 bg-amber-50'],
                    ['lunch', <Utensils className="w-5 h-5 text-blue-500" />, 'Lunch', 'border-lime-200 bg-lime-50'],
                    ['snacks', <Cookie className="w-5 h-5 text-orange-500" />, 'Snacks', 'border-emerald-200 bg-emerald-50'],
                    ['dinner', <Drumstick className="w-5 h-5 text-red-500" />, 'Dinner', 'border-teal-200 bg-teal-50']
                ].filter(([mealType]) => {
                    const dayPlanItem = dayPlan[mealType as keyof typeof dayPlan] as DayPlanType;
                    return mealType !== 'snacks' || (Array.isArray(dayPlanItem) && dayPlanItem.length > 0);
                });



                return (
                    <Card key={dayPlan.day} className="w-full bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 ease-in-out border border-gray-100">
                        <CardHeader className="px-3 sm:px-6 py-2 bg-emerald-50/70 rounded-t-xl border-b border-emerald-100">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="bg-emerald-500/10 px-2 py-1 rounded-[0.5rem] border border-emerald-500/20">
                                        <CardTitle className="text-lg font-bold text-emerald-800">
                                            Day {index + 1}
                                        </CardTitle>
                                    </div>
                                    <span className="text-sm text-emerald-600/80">
                                        {index + 1} of {dietPlan.daily_plan.length} days
                                    </span>
                                </div>
                                <div className={`flex items-center gap-2 `}>
                                    <span className={`text-sm font-semibold ${calorieTextColor}`}>{totalCalories} kcal</span>
                                    <span className="text-xs text-emerald-600/80">/ {dietPlan.calories_per_day} kcal</span>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="p-2 sm:p-6 grid lg:grid-cols-2 gap-3 sm:gap-6 py-3 sm:py-8 text-sm sm:text-lg">
                            {mealSections.map(([mealType, icon, title, colors]) => {
                                const meals = dayPlan[mealType as keyof typeof dayPlan];
                                // const mealCount = Array.isArray(meals) ? meals.length : 0;
                                return (
                                    <div key={`${mealType}`} className={`p-4 rounded-xl border ${colors} transition-colors hover:border-opacity-70`}>
                                        <div className="flex items-center gap-3 mb-4">
                                            <span className="text-2xl">{icon}</span>
                                            <h3 className="text-lg font-semibold text-gray-800">
                                                {title}
                                                {/* <span className="ml-2 text-sm text-gray-500 font-normal">
                                                    ({mealCount} options)
                                                </span> */}
                                            </h3>
                                        </div>

                                        <div className="space-y-3">
                                            {Array.isArray(meals) && meals.map((meal: any, i: number) => (
                                                <div
                                                    key={i}
                                                    className="group relative pl-4 before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-4/5 before:bg-emerald-400 before:rounded-full before:opacity-50 before:transition-opacity hover:before:opacity-80"
                                                >
                                                    <div className="font-medium text-gray-800 transition-colors group-hover:text-emerald-700">
                                                        {meal.meal}
                                                    </div>
                                                    <p className="text-sm text-gray-600/90 mt-1 leading-relaxed flex flex-wrap gap-1.5  ">
                                                        {meal.ingredients?.map((ingredient: string, index: number) => (
                                                            <span key={index} className="flex px-2 rounded-lg bg-green-300/30 border border-green-400 text-green-800">
                                                                {ingredient.split(",").map((word, wordIndex) =>
                                                                    wordIndex === 1 ? (
                                                                        <span key={wordIndex} className="">({word})</span>
                                                                    ) : (
                                                                        word
                                                                    )
                                                                )}
                                                            </span>
                                                        ))}
                                                        {meal.calories && (
                                                            <span className="ml-2 font-semibold text-gray-800">
                                                                ({Number(meal.calories?.$numberInt || meal.calories)}) <span className="text-sm text-green-800">Calories <span className="text-xs text-green-500 bg-green-100 px-1 rounded-full">(per-meal)</span></span>
                                                            </span>
                                                        )}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}