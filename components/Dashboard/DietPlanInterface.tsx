"use client";
import { useState, useRef, useEffect } from "react";
import { DietPlan } from "../../lib/actions/dietplan.action";
import { DietPlanTypes } from "../../types/index"
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "../../components/ui/alert";
import { Badge } from "../../components/ui/badge";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { UserOptions, fixedOptions } from "../../types/dietPlan";
import { user } from "@heroui/theme";

export default function DietPlanInterface({ generatePlan }: { generatePlan: (options: UserOptions) => Promise<DietPlan | { error: string }> }) {
    const [dietPlan, setDietPlan] = useState<DietPlanTypes | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [userData, setUserData] = useState<any>(null);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const printRef = useRef<HTMLDivElement>(null);
    const COLORS = ['#00ff0d', '#02a10a', '#027008']

    // Retry Logic
    const [retryCount, setRetryCount] = useState(0);
    const [retryMessage, setRetryMessage] = useState<string | null>(null);

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

    // 🟢 Fetch user data on component mount
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch('/api/user');
                if (!response.ok) {
                    throw new Error("Failed to fetch user data");
                }
                const data = await response.json();
                setUserData(data); // Store user data in state
                console.log("User data fetched:", data.user);
            } catch (error) {
                console.error("Error fetching user data:", error);
                setError("Failed to load user data. Using default values.");
            }
        };

        fetchUserData();
    }, []);

    // 🟢 Load stored plan on component mount
    useEffect(() => {
        const fetchDietPlan = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${window.location.origin}/api/dietplans`);
                if (!response.ok) throw new Error("Failed to fetch diet plan");

                const data = await response.json();
                console.log("API Response:", data);

                if (data.dietPlan) {
                    setDietPlan(data.dietPlan);
                    localStorage.removeItem("dietPlan"); // Cleanup any old local storage
                } else {
                    setDietPlan(null); // No diet plan exists
                }
            } catch (error) {
                console.error("Error fetching diet plan:", error);
                setError("No Diet Plan found.");
            } finally {
                setLoading(false);
            }
        };

        fetchDietPlan();
    }, []); // Only run on component mount

    const handleGenerate = async (currentRetry = 0) => {
        if (!userData) {
            setError("User data not loaded. Please wait and try again.");
            return;
        }

        setLoading(true);
        setError(null);
        setRetryMessage(null);
        const maxRetries = 5;

        try {
            // Ensure userData exists before merging
            const mergedOptions: UserOptions = {
                age: userData.age || 24, // Default value as a fallback
                weight: userData.weight || 72,
                height: userData.height || 160,
                gender: userData.gender || "Male",
                dietaryRestrictions: userData.dietaryRestrictions || "Vegetarian",
                preferredTimeSpan: userData.preferredTimeSpan || 7,
                healthIssues: userData.healthIssues || "none",
                fitnessGoal: userData.fitnessGoal || "Weight Loss",
                activityLevel: userData.activityLevel || "Light Exercise",
                lifestyle: userData.lifestyle || "Non-smoker",
                country: userData.country || "Pakistan",
                region: userData.region || "Peshawar",
                mealType: userData.mealType || "Balanced",
                preferredCuisine: userData.preferredCuisine || "Pakistani",
                cookingStyle: userData.cookingStyle || "Takeout",
                mealFrequency: userData.mealFrequency || "3 meals per day",
                avoidFoods: userData.avoidFoods || "Mention Foods to be strictly avoided",
            };

            console.log("✅ Merged options:", mergedOptions);

            let result: DietPlan | { error: string } = { error: "" };
            let isValidPlan = false;

            // Retry loop
            for (let attempt = currentRetry; attempt < maxRetries; attempt++) {
                try {
                    setRetryMessage(`Retrying generation plan (${attempt + 1}/${maxRetries})`);
                    result = await generatePlan(mergedOptions);

                    if ("error" in result) throw new Error(result.error);
                    if (!validateDietPlan(result)) throw new Error("Invalid diet plan structure received");

                    isValidPlan = true;
                    break;
                } catch (err: any) {
                    console.error(`Attempt ${attempt + 1} failed:`, err);
                    if (attempt === maxRetries - 1) throw err;
                    await new Promise((resolve) => setTimeout(resolve, 2000));
                }
            }

            if (!isValidPlan) throw new Error("Failed to generate a valid diet plan after 5 attempts");

            // Save to database
            const saveResponse = await fetch("/api/dietplans", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(result),
            });

            if (!saveResponse.ok) throw new Error("Failed to store in database");

            // Fetch updated plan
            const fetchResponse = await fetch("/api/dietplans");
            if (!fetchResponse.ok) throw new Error("Failed to fetch updated plan");

            const dbData = await fetchResponse.json();
            if (dbData.dietPlan) {
                setDietPlan(dbData.dietPlan);
                localStorage.removeItem("dietPlan");
            }
        } catch (err: any) {
            console.error("❌ Error:", err);
            if (retryCount < maxRetries - 1) {
                setRetryCount((prev) => prev + 1);
                setTimeout(() => handleGenerate(retryCount + 1), 2000);
            } else {
                setError(err.message.includes("5 attempts") ? "Server is busy. Try again later." : err.message);
            }
        } finally {
            setLoading(false);
            setRetryMessage(null);
        }
    };


    // Diet plan validation function
    const validateDietPlan = (plan: any): plan is DietPlan => {
        return (
            plan?.daily_plan?.length > 0 &&
            plan?.macronutrient_distribution &&
            plan?.calories_per_day
        );
    };

    // 🟢 Auto-Retry Database Storage
    useEffect(() => {
        const retryStorage = async () => {
            const storedPlan = localStorage.getItem("dietPlan");
            if (!storedPlan) return;

            const parsed = JSON.parse(storedPlan);
            if (parsed.retryAfter && Date.now() < parsed.retryAfter) return;

            try {
                const response = await fetch(`${window.location.origin}/api/dietplans`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(parsed.data),
                });

                if (response.ok) {
                    localStorage.removeItem("dietPlan");
                    // Refresh plan from DB
                    const fetchResponse = await fetch(`${window.location.origin}/api/dietplans`);
                    const dbData = await fetchResponse.json();
                    if (dbData.dietPlans?.length > 0) {
                        setDietPlan(dbData.dietPlans[0]);
                    }
                }
            } catch (error) {
                console.error("Retry failed:", error);
                // Update retry timer
                localStorage.setItem("dietPlan", JSON.stringify({
                    ...parsed,
                    retryAfter: Date.now() + 24 * 60 * 60 * 1000
                }));
            }
        };

        retryStorage();
    }, []);

    const handleConfirmDelete = async () => {
        if (!dietPlan?._id) {
            console.error("No diet plan ID found");
            return;
        }

        try {
            // console.log("Deleting diet plan with ID:", dietPlan._id);

            const response = await fetch(`${window.location.origin}/api/dietplans/${dietPlan._id}`, {
                method: "DELETE",
            });

            // Log the response for debugging
            console.log("Response status:", response.status);
            console.log("Response headers:", response.headers);

            if (!response.ok) {
                // Attempt to parse the error response
                const errorText = await response.text();
                console.error("API Error Response:", errorText);

                // If the response is HTML, throw a custom error
                if (errorText.startsWith("<!DOCTYPE html>")) {
                    throw new Error("Received HTML response. Check the API endpoint.");
                }

                // If the response is JSON, parse it
                try {
                    const errorData = JSON.parse(errorText);
                    throw new Error(errorData.error || "Failed to delete diet plan");
                } catch (jsonError) {
                    throw new Error(errorText || "Failed to delete diet plan");
                }
            }

            setDietPlan(null);
            setShowDeleteConfirmation(false);
            localStorage.removeItem("dietPlan");

            console.log("Diet plan deleted successfully");

        } catch (error) {
            console.error("❌ Error deleting diet plan:", error);
            if (error instanceof Error) {
                setError(error.message || "Failed to delete diet plan. Please try again.");
            } else {
                setError("Failed to delete diet plan. Please try again.");
            }
        }
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


    const handleDelete = async () => {
        setShowDeleteConfirmation(true);
    };

    // const handleConfirmDelete = async () => {
    //     if (!dietPlan) return;

    //     try {
    //         const response = await fetch(`${window.location.origin}/api/dietplans/${dietPlan}`, {
    //             method: "DELETE",
    //         });

    //         if (!response.ok) throw new Error("Failed to delete diet plan");

    //         localStorage.removeItem("dietPlan");
    //         setDietPlan(null);
    //         setShowDeleteConfirmation(false);
    //     } catch (error) {
    //         console.error("❌ Error deleting diet plan:", error);
    //     }
    // };

    const generatePDF = async () => {
        if (!printRef.current) return;

        const pdf = new jsPDF("p", "mm", "a4"); // A4 size PDF in portrait mode
        const pageWidth = 210;  // A4 width in mm
        const pageHeight = 297; // A4 height in mm
        const margin = 10; // Margin for better spacing

        try {
            // Convert the full content into a canvas
            const canvas = await html2canvas(printRef.current, {
                // scale: 3, // High resolution
                useCORS: true,
            });

            const imgData = canvas.toDataURL("image/png");

            // Get image dimensions
            const imgWidth = canvas.width;
            const imgHeight = canvas.height;

            // Convert pixels to mm
            const imgRatio = imgWidth / imgHeight;
            const pdfWidth = pageWidth - margin * 2; // Full width minus margins
            const pdfHeight = pdfWidth / imgRatio; // Auto scale height

            let position = margin; // Start position for the first image

            // If content fits in one page
            if (pdfHeight <= pageHeight - margin * 2) {
                pdf.addImage(imgData, "PNG", margin, position, pdfWidth, pdfHeight);
            } else {
                // If content is long, split into multiple pages
                let remainingHeight = imgHeight;
                let yPosition = 0;

                while (remainingHeight > 0) {
                    const canvasSection = document.createElement("canvas");
                    canvasSection.width = canvas.width;
                    canvasSection.height = (pageHeight / pdfWidth) * canvas.width; // Same ratio

                    const ctx = canvasSection.getContext("2d");
                    if (ctx) {
                        ctx.drawImage(canvas, 0, yPosition, canvas.width, canvasSection.height, 0, 0, canvas.width, canvasSection.height);
                    }

                    const sectionData = canvasSection.toDataURL("image/png");

                    if (yPosition > 0) pdf.addPage(); // Add a new page after the first one
                    pdf.addImage(sectionData, "PNG", margin, margin, pdfWidth, pdfHeight);

                    yPosition += canvasSection.height; // Move down
                    remainingHeight -= canvasSection.height; // Decrease remaining height
                }
            }

            pdf.save("Diet_Plan.pdf");
        } catch (error) {
            console.error("Error generating PDF:", error);
        }
    };

    interface BMICalculation {
        weight: number;
        height: number;
    }

    const calculateBMI = ({ weight, height }: BMICalculation): string => {
        // Convert height from cm to meters
        height /= 100;

        // Calculate BMI
        const bmi = weight / (height ** 2);

        // Return BMI, rounded to 2 decimal places
        return bmi.toFixed(2);
    }

    return (
        <div className="p-4 md:p-6 w-full bg-gray-50 rounded-2xl border-2 mx-auto space-y-6">
            {/* Delete Confirmation Modal */}
            {showDeleteConfirmation && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <Card className="bg-background animate-in zoom-in-95 bg-green-100 border-red-700">
                        <CardHeader>
                            <CardTitle className="text-destructive">Confirm Deletion</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p>Are you sure you want to delete this diet plan?</p>
                            <div className="flex gap-3 justify-end">
                                <Button
                                    className=" bg-green-600 text-white"
                                    variant="outline"
                                    onClick={() => setShowDeleteConfirmation(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    className="bg bg-red-200"
                                    variant="destructive"
                                    onClick={handleConfirmDelete}
                                >
                                    Delete Plan
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Control Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
                <Button
                    onClick={dietPlan ? handleDelete : () => handleGenerate()}
                    size="lg"
                    variant={dietPlan ? "destructive" : "default"}
                    className="w-full sm:w-auto hover:scale-105 transition-transform bg-red-500 text-white font-semibold"
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            {retryMessage || "Generating..."}
                            <span className="ml-2 animate-pulse">...</span>
                        </>
                    ) : (
                        dietPlan ? "Delete Plan" : "Generate Plan"
                    )}
                </Button>

                {dietPlan && (
                    <Button
                        onClick={generatePDF}
                        variant="outline"
                        size="lg"
                        className="w-full sm:w-auto border-primary text-primary hover:bg-primary/10 bg-gradient-green text-white rounded-tl-full rounded-br-full rounded-tr-none rounded-bl-none hover:scale-105 transition-transform"
                    >
                        Download PDF
                    </Button>
                )}
            </div>

            {/* Error Alert */}
            {error && (
                <Alert variant="destructive" className="border-2">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {dietPlan && (
                <div ref={printRef} className="space-y-0.5">
                    {/* Header */}
                    <Card className="bg-background rounded-none border-0 border-b-2 shadow-none bg-gray-50">
                        <CardContent className="p-4 md:p-6 flex flex-col md:flex-row items-center justify-between">
                            <div className="border px-4 rounded-tr-full rounded-bl-full border-green-600 flex items-center justify-center">
                                <img
                                    src="/img/LOGO.png"
                                    alt="Site Logo"
                                    className="h-12 md:h-16 mb-4 md:mb-0"
                                />
                            </div>
                            <h1 className="text-2xl md:text-3xl font-bold text-primary text-green-500">
                                Personalized Diet Plan <span className="text-sm">( {userData.user.fitnessGoal || ""} )</span>
                            </h1>

                        </CardContent>
                    </Card>

                    <Card className="border-destructive rounded-none border-0 border-b-2 border-r-2 shadow-none">
                        <CardHeader>
                            <CardTitle className="text-lg text-destructive text-green-600">
                                {userData?.user?.firstName + " " + userData?.user?.lastName}
                                <span className="text-[0.7rem] border px-[5px] rounded-lg border-green-500 ml-1">{userData?.user?.country}</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-wrap gap-2">
                            <span className="text-sm border border-green-300 px-2 rounded-lg text-green-600">Activity Level: {userData?.user?.activityLevel}</span>
                            <span className="text-sm border border-green-300 px-2 rounded-lg text-green-600">CookingStyle: {userData?.user?.cookingStyle}</span>
                            <span className="text-sm border border-green-300 px-2 rounded-lg text-green-600">DietaryRestriction: {userData?.user?.dietaryRestrictions}</span>
                            <span className="text-sm border border-green-300 px-2 rounded-lg text-green-600">CuisineStyle: {userData?.user?.preferredCuisine}</span>
                            <span
                                className={`
                                     text-sm border px-2 rounded-lg 
                                    ${parseFloat(calculateBMI({ weight: userData?.user?.weight, height: userData?.user?.height })) < 18.5 ||
                                        parseFloat(calculateBMI({ weight: userData?.user?.weight, height: userData?.user?.height })) >= 25
                                        ? "border-red-300 text-red-600"
                                        : parseFloat(calculateBMI({ weight: userData?.user?.weight, height: userData?.user?.height })) >= 23
                                            ? "border-yellow-300 text-yellow-600"
                                            : "border-green-300 text-green-600"}
                                    `}
                            >
                                BMI: {calculateBMI({ weight: userData?.user?.weight, height: userData?.user?.height })}
                            </span>

                        </CardContent>
                    </Card>

                    {/* Overview Section */}
                    <div className="grid gap-4 md:grid-cols-2 rounded-none border-0 border-b-2 bg-gray-50">
                        <Card className=" border-none shadow-none rounded-0 ">
                            <CardHeader>
                                <CardTitle className="text-lg text-green-800">Daily Nutrition</CardTitle>
                            </CardHeader>
                            <CardContent className="">
                                <div className="flex justify-between items-center border-b-2">
                                    <span className="font-semibold  text-green-700">Calories</span>
                                    <Badge variant="outline" className="text-lg mb-2  text-green-700 border-green-700">
                                        {dietPlan.calories_per_day}
                                    </Badge>
                                </div>

                                <ResponsiveContainer width="100%" height={250} className={'pdf-chart'}>
                                    <PieChart>
                                        <Pie
                                            data={getMacronutrientData()}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={50}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            paddingAngle={5}
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
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="w-full flex items-center justify-center">
                                    <LegendBadges />
                                </div>
                            </CardContent>
                        </Card>

                        {(dietPlan.instructions?.length ?? 0) > 0 && (
                            <Card className="border-none shadow-none flex flex-col  justify-center">
                                <CardHeader>
                                    <CardTitle className="text-[1.125rem] text-green-800">Key Instructions</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-1">
                                        {dietPlan.instructions?.map((instruction, index) => (
                                            <li
                                                key={index}
                                                className="flex items-start gap-2 text-sm"
                                            >
                                                <span className=" text-green-500">•</span>
                                                <span className="flex-1">{instruction}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Meal Plan Table */}
                    <div className="grid grid-cols-1 gap-2">
                        {dietPlan.daily_plan?.map((dayPlan, index) => (
                            <Card key={dayPlan.day} className="w-full bg-gray-50 rounded-0 border-none border-b-2">
                                <CardHeader>
                                    <CardTitle className="text-lg">Day : {index + 1}</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4 grid  md:grid-cols-2 sm:grid-cols-1  gap-4">
                                    {/* Breakfast Section */}
                                    <div className="space-y-2 border-b-2 ">
                                        <h3 className="font-semibold">
                                            Breakfast <span className="text-xs text-gray-700">({dayPlan.breakfast.length} options)</span>
                                        </h3>
                                        {dayPlan.breakfast.map((meal, i) => (
                                            <div key={i} className="text-sm pl-4 border-l-4 border-primary">
                                                <div className="font-medium">{meal.meal}</div>
                                                <p className="text-xs mt-1 text-muted-foreground">
                                                    {meal.ingredients.join(", ")}
                                                </p>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Lunch Section */}
                                    <div className="space-y-2 border-b-2 ">
                                        <h3 className="font-semibold">
                                            Lunch <span className="text-xs text-gray-700" >({dayPlan.lunch.length} options)</span>
                                        </h3>
                                        {dayPlan.lunch.map((meal, i) => (
                                            <div key={i} className="text-sm pl-4 border-l-4 border-secondary py-2">
                                                <div className="font-medium">{i + 1}: {meal.meal}</div>
                                                <p className="text-xs mt-1 text-muted-foreground ">
                                                    {meal.ingredients.join(", ")}
                                                </p>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Snacks Section */}
                                    <div className="space-y-2 border-b-2">
                                        <h3 className="font-semibold">
                                            Snacks <span className="text-xs text-gray-700" >({dayPlan.snacks.length} options)</span>
                                        </h3>
                                        {dayPlan.snacks.map((meal, i) => (
                                            <div key={i} className="text-sm pl-4 border-l-4 border-accent py-2">
                                                <div className="font-medium">{i + 1}: {meal.meal}</div>
                                                <p className="text-xs mt-1 text-muted-foreground">
                                                    {meal.ingredients.join(", ")}
                                                </p>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Dinner Section */}
                                    <div className="space-y-2 border-b-2 ">
                                        <h3 className="font-semibold">
                                            Dinner <span className="text-xs text-gray-700">({dayPlan.dinner.length} options)</span>
                                        </h3>
                                        {dayPlan.dinner.map((meal, i) => (
                                            <div key={i} className="text-sm pl-4 border-l-4 border-destructive py-2">
                                                <div className="font-medium">{i + 1}: {meal.meal}</div>
                                                <p className="text-xs mt-1 text-muted-foreground">
                                                    {meal.ingredients.join(", ")}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Additional Sections */}
                    <div className="grid gap-0 md:grid-cols-2 bg-gray-50 py-4 rounded-xl">
                        {(dietPlan.foods_to_avoid?.length ?? 0) > 0 && (
                            <Card className="border-destructive rounded-none border-0 border-b-2 border-r-2 shadow-none">
                                <CardHeader>
                                    <CardTitle className="text-lg text-destructive text-red-500">
                                        Foods to Avoid:
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="flex flex-wrap gap-2">
                                    {dietPlan.foods_to_avoid?.map((food, index) => (
                                        <Badge key={index} variant="destructive" className=" bg-red-50 border-red-600 text-red-600">
                                            {food}
                                        </Badge>
                                    ))}
                                </CardContent>
                            </Card>
                        )}

                        {(dietPlan.all_ingredients?.length ?? 0) > 0 && (
                            <Card className="shadow-none rounded-none border-0 border-b-2">
                                <CardHeader>
                                    <CardTitle className="text-lg text-green-700">
                                        Ingredients List :
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="flex flex-wrap gap-2">
                                    {dietPlan.all_ingredients?.map((ingredient, index) => (
                                        <Badge
                                            key={index}
                                            variant="outline"
                                            className="font-normal bg-green-100 border-green-500"
                                        >
                                            {ingredient}
                                        </Badge>
                                    ))}
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}