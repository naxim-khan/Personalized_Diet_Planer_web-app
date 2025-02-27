import { DietPlanTypes } from "../../../types/index";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { AnimatedList } from "../../../components/magicui/animated-list";
import { cn } from "../../lib/utils";

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

    // Create a sufficiently large array by repeating dietPlan.instructions multiple times
    const largeInstructionSet = Array.from({ length: 100 }, () => dietPlan.instructions).flat();

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
                <Card className="border border-emerald-50 shadow-none bg-white p-3 rounded-lg">
                    <CardHeader className="pb-2 px-0">
                        <CardTitle className="text-lg font-semibold text-emerald-800">
                            Key Guidelines
                        </CardTitle>
                        <div className="border-b border-emerald-100 mt-2"></div>
                    </CardHeader>

                    <CardContent className="relative flex h-[250px] max-h-[250px] w-full flex-col overflow-hidden p-1">
                        <AnimatedList delay={3000} className="gap-3">
                            {largeInstructionSet.map((instruction, index) => (
                                <li
                                    key={index}
                                    className={cn(
                                        "relative mx-auto min-h-fit w-[calc(100%-10px)]  cursor-pointer overflow-hidden rounded-lg p-3 flex gap-3 items-center  ",
                                        // animation styles
                                        "transition-all duration-200 ease-in-out hover:scale-[103%]",
                                        // light styles
                                        "bg-green-400/10 [box-shadow:0_0_0_1px_rgba(0,0,0,.02),0_1px_2px_rgba(0,0,0,.03),0_3px_7px_rgba(0,0,0,.03)]",
                                    )}
                                >
                                    <div className="shrink-0 w-5 h-5 bg-emerald-500/50 text-emerald-800 text-sm rounded-full flex items-center justify-center">
                                        {(index % (dietPlan.instructions?.length || 1)) + 1}
                                    </div>
                                    <p className="text-sm leading-snug text-gray-700">
                                        {instruction}
                                    </p>
                                </li>
                            ))}
                        </AnimatedList>
                        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-white rounded-b-lg"></div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
