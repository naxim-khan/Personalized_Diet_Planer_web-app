import { DietPlanTypes } from "../../../types/index";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

export function OverviewSection({
    dietPlan,
    COLORS,
    chartRef
}: {
    dietPlan: DietPlanTypes;
    COLORS: string[];
    chartRef: React.RefObject<HTMLDivElement | null>;

}) {
    const getMacronutrientData = () => {
        if (!dietPlan?.macronutrient_distribution) return [];
        // Extract numerical values from strings like "150g"
        const extractGrams = (str: string) => parseFloat(str.replace('g', ''));

        const protein = extractGrams(dietPlan.macronutrient_distribution.protein);
        const carbs = extractGrams(dietPlan.macronutrient_distribution.carbohydrates);
        const fats = extractGrams(dietPlan.macronutrient_distribution.fats);

        // Calculate calorie contributions (4 cal/g for protein/carbs, 9 cal/g for fats)
        return [
            { name: "Protein", value: protein * 4 },
            { name: "Carbs", value: carbs * 4 },
            { name: "Fat", value: fats * 9 },
        ];
    };

    const LegendBadges = () => {
        const data = getMacronutrientData();
        if (!data.length) return null;

        return (
            <div className="flex gap-2 mt-4">
                {data.map((entry, index) => {
                    // Get original grams from dietPlan
                    const grams = entry.value / (entry.name === 'Fat' ? 9 : 4);
                    return (
                        <div key={index} className="flex items-center gap-2">
                            <div
                                className="w-4 h-4 rounded-full"
                                style={{ backgroundColor: COLORS[index] }}
                            ></div>
                            <span className="text-sm">
                                {entry.name} ({grams}g)
                            </span>
                        </div>
                    );
                })}
            </div>
        );
    };


    return (
        <div className="grid gap-4 md:gap-5 lg:grid-cols-2 rounded-lg bg-white sm:p-4 p-2  shadow-xs">
            {/* Nutrition Card */}
            <Card className="border-0 shadow-none bg-emerald-50/20 p-3 rounded-lg">
                <CardHeader className="pb-2 px-0">
                    <div className="flex justify-between items-center">
                        <CardTitle className="text-lg font-semibold text-emerald-800">
                            Nutrition Overview
                        </CardTitle>
                        <Badge
                            variant="outline"
                            className="text-base py-0.5 px-2.5 border-emerald-200 text-emerald-700 bg-white"
                        >
                            {dietPlan.calories_per_day} kcal
                        </Badge>
                    </div>
                    <div className="border-b border-emerald-100 mt-2"></div>
                </CardHeader>

                <CardContent className="p-0" ref={chartRef}>
                    <div className="h-[180px] lg:h-[200px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={getMacronutrientData()}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={45}
                                    outerRadius={75}
                                    paddingAngle={1}
                                    dataKey="value"
                                    label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                                >
                                    {getMacronutrientData().map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={COLORS[index % COLORS.length]}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip
                                    formatter={(value: number) => [`${Math.round(value)} kcal`, '']}
                                    contentStyle={{
                                        borderRadius: '10px',
                                        border: '1px solid #d1fae5',
                                        boxShadow: '0 2px 4px -1px rgb(0 0 0 / 0.05)'
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2 justify-center">
                        <LegendBadges />
                    </div>
                </CardContent>
            </Card>

            {/* Guidelines Card */}
            {dietPlan.instructions && dietPlan.instructions.length > 0 && (
                <Card className="border-0 shadow-none bg-white p-3 rounded-lg">
                    <CardHeader className="pb-2 px-0">
                        <CardTitle className="text-lg font-semibold text-emerald-800">
                            Key Guidelines
                        </CardTitle>
                        <div className="border-b border-emerald-100 mt-2"></div>
                    </CardHeader>

                    <CardContent className="p-0">
                        <ul className="space-y-2">
                            {dietPlan.instructions?.map((instruction, index) => (
                                <li
                                    key={index}
                                    className="flex items-start gap-2 p-2 rounded-md bg-emerald-50/30 hover:bg-emerald-50/50 transition-colors"
                                >
                                    <div className="shrink-0 w-5 h-5 bg-emerald-500/10 text-emerald-700 text-sm rounded-full flex items-center justify-center">
                                        {index + 1}
                                    </div>
                                    <p className="text-sm leading-snug text-gray-700">
                                        {instruction}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}