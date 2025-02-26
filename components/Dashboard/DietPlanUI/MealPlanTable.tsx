import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Egg, Utensils, Cookie, Drumstick } from "lucide-react";
import { DietPlanTypes } from "../../../types";

export function MealPlanTable({ dietPlan }: { dietPlan: DietPlanTypes }) {
    return (
        <div className="grid grid-cols-1 gap-8">
            {dietPlan.daily_plan?.map((dayPlan, index) => (
                <Card key={dayPlan.day} className="w-full bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 ease-in-out border border-gray-100">
                    {/* Day Header with Progress Psychology */}
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
                            <div className="flex items-center gap-2 text-emerald-600">
                                <span className="text-sm">{dietPlan.calories_per_day}</span>
                                <span className="text-xs">kcal/day</span>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="p-2 sm:p-6 grid lg:grid-cols-2 gap-3 sm:gap-6 py-3 sm:py-8 text-sm sm:text-lg">
                        {/* Meal Sections with Color Coding */}
                        {[['breakfast', <Egg className="w-5 h-5 text-yellow-500" />, 'Morning Energy', 'border-amber-200 bg-amber-50'],
                        ['lunch', <Utensils className="w-5 h-5 text-blue-500" />, 'Midday Fuel', 'border-lime-200 bg-lime-50'],
                        ['snacks', <Cookie className="w-5 h-5 text-orange-500" />, 'Sustained Energy', 'border-emerald-200 bg-emerald-50'],
                        ['dinner', <Drumstick className="w-5 h-5 text-red-500" />, 'Evening Recovery', 'border-teal-200 bg-teal-50']].map(([mealType, icon, title, colors]) => (
                            <div key={`${mealType}`} className={`p-4 rounded-xl border ${colors} transition-colors hover:border-opacity-70`}>
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="text-2xl">{icon}</span>
                                    <h3 className="text-lg font-semibold text-gray-800">
                                        {title}
                                        <span className="ml-2 text-sm text-gray-500 font-normal">
                                            ({Array.isArray(dayPlan[mealType as keyof typeof dayPlan]) ? (dayPlan[mealType as keyof typeof dayPlan] as { meal: string; ingredients: string[] }[]).length : 0} options)
                                        </span>
                                    </h3>
                                </div>

                                <div className="space-y-3">
                                    {Array.isArray(dayPlan[mealType as keyof typeof dayPlan])
                                        ? (dayPlan[mealType as keyof typeof dayPlan] as { meal: string; ingredients: string[] }[]).map((meal, i) => (
                                            <div
                                                key={i}
                                                className="group relative pl-4 before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-4/5 before:bg-emerald-400 before:rounded-full before:opacity-50 before:transition-opacity hover:before:opacity-80"
                                            >
                                                <div className="font-medium text-gray-800 transition-colors group-hover:text-emerald-700">
                                                    {meal.meal}
                                                </div>
                                                <p className="text-sm text-gray-600/90 mt-1 leading-relaxed">
                                                    {meal.ingredients.join(", ")}
                                                </p>
                                            </div>
                                        ))
                                        : null /* Avoids calling .map() on a number */
                                    }

                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}