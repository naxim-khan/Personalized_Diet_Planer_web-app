"use client";
import { useState, useRef, useEffect } from "react";
import { DietPlan } from "../../lib/actions/dietplan.action";
import { DietPlanTypes } from "../../types/index"
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Button } from "../../components/ui/button";
import { toPng } from 'html-to-image';
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "../../components/ui/alert";
import { Badge } from "../../components/ui/badge";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { UserOptions } from "../../types/dietPlan";
import { Egg, Utensils, Cookie, Drumstick } from "lucide-react";
import { TriangleAlert } from "lucide-react";
import { Trash2 } from "lucide-react";
import DietPlanPDF from '../../components/DietPlanPDF';
import { PDFDownloadLink } from '@react-pdf/renderer';

export default function DietPlanInterface({ generatePlan }: { generatePlan: (options: UserOptions) => Promise<DietPlan | { error: string }> }) {
    const [dietPlan, setDietPlan] = useState<DietPlanTypes | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [userData, setUserData] = useState<any>(null);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const printRef = useRef<HTMLDivElement>(null);
    const COLORS = ['#00ff0d', '#02a10a', '#027008']

    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
    const [localPlan, setLocalPlan] = useState<DietPlanTypes | null>(null);

    // PDF Generate Logic
    const chartRef = useRef(null);
    const [pdfReady, setPdfReady] = useState(false);
    const [chartImage, setChartImage] = useState<string | null>(null);

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

    // initial load: check database first, than local storage
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // First try database
                const dbResponse = await fetch('/api/dietplans');
                if (dbResponse.ok) {
                    const dbData = await dbResponse.json();
                    if (dbData.dietPlan) {
                        setDietPlan(dbData.dietPlan);
                        return;
                    }
                }

                // Fallback to local storage
                const localPlan = localStorage.getItem('dietPlan');
                if (localPlan) {
                    setLocalPlan(JSON.parse(localPlan));
                    setError('Your plan is stored locally - click to save to cloud');
                }
            } catch (error) {
                console.error("Initial load error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Add proper type declarations at the top

    const handleGenerate = async () => {
        if (!userData) {
            setError("User data not loaded");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const mergedOptions: UserOptions = {
                age: userData.user?.age || 25,
                weight: userData.user?.weight || 70,
                height: userData.user?.height || 170,
                gender: userData.user?.gender || "Male",
                dietaryRestrictions: userData.user?.dietaryRestrictions || "None",
                preferredTimeSpan: userData.user?.preferredTimeSpan || 7,
                healthIssues: userData.user?.healthIssues || "None",
                fitnessGoal: userData.user?.fitnessGoal || "Maintain weight",
                activityLevel: userData.user?.activityLevel || "Moderate",
                lifestyle: userData.user?.lifestyle || "Average",
                country: userData.user?.country || "USA",
                region: userData.user?.region || "California",
                mealType: userData.user?.mealType || "Balanced",
                preferredCuisine: userData.user?.preferredCuisine || "International",
                cookingStyle: userData.user?.cookingStyle || "Home cooking",
                mealFrequency: userData.user?.mealFrequency || "3 meals",
                avoidFoods: userData.user?.avoidFoods || "None"
            };

            const result = await generatePlan(mergedOptions);

            if ("error" in result) {
                throw new Error(result.error);
            }
            // Try to save to database first
            setSaveStatus('saving');
            const saveResponse = await fetch('/api/dietplans', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(result)
            });

            // if (!validateDietPlan(result)) {
            //     throw new Error("Invalid plan structure received");
            // }

            // setDietPlan({ ...result, userId: result.userId ?? "" });
            // localStorage.setItem("dietPlan", JSON.stringify(result));
            if (saveResponse.ok) {
                const savedPlan = await saveResponse.json();
                setDietPlan(savedPlan.dietPlan);
                localStorage.removeItem('dietPlan');
                setSaveStatus('success');
            } else {
                // Fallback to local storage
                localStorage.setItem('dietPlan', JSON.stringify(result));
                setLocalPlan({ ...result, userId: result.userId ?? "" });
                setSaveStatus('error');
                setError('Failed to save to cloud - stored locally');
            }

        } catch (err: any) {
            setSaveStatus('error');
            setError(err.message);
        } finally {
            setLoading(false);
            setTimeout(() => setSaveStatus('idle'), 5000);
        }
    };

    // save to cloud
    const handleSaveToCloud = async () => {
        if (!localPlan) return;

        setSaveStatus('saving');
        try {
            const response = await fetch('/api/dietplans', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(localPlan)
            });

            if (response.ok) {
                const savedPlan = await response.json();
                setDietPlan(savedPlan.dietPlan);
                localStorage.removeItem('dietPlan');
                setLocalPlan(null);
                setSaveStatus('success');
            } else {
                setSaveStatus('error');
                setError('Failed to save to cloud. Please try again.');
            }
        } catch (error) {
            setSaveStatus('error');
            setError('Network error - plan remains in local storage');
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
    // useEffect(() => {
    //     const retryStorage = async () => {
    //         const storedPlan = localStorage.getItem("dietPlan");
    //         if (!storedPlan) return;

    //         const parsed = JSON.parse(storedPlan);
    //         if (parsed.retryAfter && Date.now() < parsed.retryAfter) return;

    //         try {
    //             const response = await fetch(`${window.location.origin}/api/dietplans`, {
    //                 method: "POST",
    //                 headers: { "Content-Type": "application/json" },
    //                 body: JSON.stringify(parsed.data),
    //             });

    //             if (response.ok) {
    //                 localStorage.removeItem("dietPlan");
    //                 // Refresh plan from DB
    //                 const fetchResponse = await fetch(`${window.location.origin}/api/dietplans`);
    //                 const dbData = await fetchResponse.json();
    //                 if (dbData.dietPlans?.length > 0) {
    //                     setDietPlan(dbData.dietPlans[0]);
    //                 }
    //             }
    //         } catch (error) {
    //             console.error("Retry failed:", error);
    //             // Update retry timer
    //             localStorage.setItem("dietPlan", JSON.stringify({
    //                 ...parsed,
    //                 retryAfter: Date.now() + 24 * 60 * 60 * 1000
    //             }));
    //         }
    //     };

    //     retryStorage();
    // }, []);

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
        try {
            // Capture chart as image
            if (chartRef.current) {
                const chartUrl = await toPng(chartRef.current);
                setChartImage(chartUrl);
            }
            setPdfReady(true);
        } catch (error) {
            console.error('Error generating PDF:', error);
        }
    };

    interface BMICalculation {
        weight: number;
        height: number;
    }

    const calculateBMI = ({ weight, height }: BMICalculation): string => {
        // Convert height from cm to meters
        height = height ? height / 100 : 0;
        weight = weight || 0;

        // Calculate BMI
        const bmi = weight / (height ** 2);

        // Return BMI, rounded to 2 decimal places
        return bmi.toFixed(2);
    }

    return (
        <div className="p-4 md:p-6 w-full bg-gray-50 rounded-2xl border-2 mx-auto space-y-6">

            {/* Status Alert */}
            {saveStatus === 'saving' && (
                <Alert className="mb-4">
                    ⏳ Saving your plan to cloud storage...
                </Alert>
            )}

            {saveStatus === 'error' && (
                <Alert variant="destructive" className="mb-4">
                    ❌ Failed to save to cloud - using local storage
                </Alert>
            )}

            {/* Local Storage Warning */}
            {localPlan && (
                <Alert className="mb-4">
                    ⚠️ Your plan is stored locally
                    <Button
                        onClick={handleSaveToCloud}
                        className="ml-4"
                        size="sm"
                    >
                        Save to Cloud
                    </Button>
                </Alert>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteConfirmation && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-[100]">
                    <Card className=" bg-white border-gray-200  animate-in fade-in-90 zoom-in-95 w-full max-w-md border-0 shadow-xl">
                        <CardHeader className="pb-4">
                            <div className="flex items-center gap-3">
                                <div className="bg-destructive/10 p-2 rounded-full">
                                    <TriangleAlert className="w-5 h-5 text-destructive text-red-500" />
                                </div>
                                <CardTitle className="text-lg font-semibold text-foreground text-red-500">
                                    Delete Diet Plan
                                </CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                <p className="text-muted-foreground">
                                    This will permanently delete the diet plan and all associated data.
                                    This action cannot be undone.
                                </p>
                                <div className="flex gap-3 justify-end">
                                    <Button
                                        variant="outline"
                                        onClick={() => setShowDeleteConfirmation(false)}
                                        className="px-5 hover:bg-accent/50 text-green-600 bg-green-100"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        onClick={handleConfirmDelete}
                                        className="px-5 bg-destructive hover:bg-destructive/90 text-red-500 bg-red-100"
                                    >
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Delete Plan
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Control Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
                <Button
                    onClick={dietPlan ? handleDelete : handleGenerate}
                    size="lg"
                    variant={dietPlan ? "destructive" : "default"}
                    className="relative w-full sm:w-auto hover:scale-105 transition-transform bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                    disabled={loading}
                >
                    {loading && (
                        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
                            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md text-center">
                                <div className="animate-spin mx-auto mb-4">
                                    <svg
                                        className="h-8 w-8 text-blue-600"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                        />
                                    </svg>
                                </div>
                                <p className="text-gray-700 font-medium">
                                    Crafting your meal plan...
                                </p>
                                <p className="text-sm text-gray-500 mt-2">
                                    This usually takes 2-5 minutes
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="flex items-center gap-2">
                        {loading ? (
                            <>
                                <svg
                                    className="animate-spin h-5 w-5 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    />
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    />
                                </svg>
                                <span>Generating...</span>
                            </>
                        ) : (
                            dietPlan ? "Delete Plan" : "Generate Plan"
                        )}
                    </div>
                </Button>

                
                {dietPlan && (
                    <div className="relative">
                        {!pdfReady ? (
                            <Button
                                onClick={async () => {
                                    try {
                                        const chartUrl = await toPng(chartRef.current!);
                                        setChartImage(chartUrl);
                                        setPdfReady(true);
                                    } catch (error) {
                                        console.error('Error generating PDF:', error);
                                    }
                                }}
                                variant="outline"
                                size="lg"
                                className="w-full sm:w-auto border-primary text-primary hover:bg-primary/10 bg-gradient-green text-white rounded-tl-full rounded-br-full rounded-tr-none rounded-bl-none hover:scale-105 transition-transform"
                            >
                                Download PDF
                            </Button>
                        ) : (
                            <PDFDownloadLink
                                document={
                                    <DietPlanPDF
                                        userData={userData}
                                        dietPlan={dietPlan}
                                        chartImage={chartImage!}
                                    />
                                }
                                fileName="diet-plan.pdf"
                                className="w-full sm:w-auto border-primary text-primary hover:bg-primary/10 bg-gradient-green text-white rounded-tl-full rounded-br-full rounded-tr-none rounded-bl-none hover:scale-105 transition-transform"
                            >
                                {({ loading }) => (
                                    <Button
                                        variant="outline"
                                        size="lg"
                                        disabled={loading}
                                        className="w-full sm:w-auto border-primary text-primary hover:bg-primary/10 bg-gradient-green text-white rounded-tl-full rounded-br-full rounded-tr-none rounded-bl-none hover:scale-105 transition-transform"
                                    >
                                        {loading ? 'Generating...' : 'Download Now'}
                                    </Button>
                                )}
                            </PDFDownloadLink>
                        )}
                    </div>
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
                <div ref={printRef} className="space-y-4">
                    {/* Header */}
                    <Card className="bg-background rounded-none border-0 shadow-sm">
                        <CardContent className="px-4 py-3 md:px-6 md:py-4">
                            <div className="flex items-center gap-4 md:gap-6">
                                {/* Logo with subtle accent */}
                                <div className="flex items-center">
                                    <img
                                        src="/img/LOGO.png"
                                        alt="Site Logo"
                                        className="h-10 md:h-12 w-auto"
                                    />
                                    <div className="ml-2 h-8 w-px bg-emerald-200/80 hidden md:block"></div>
                                </div>

                                {/* Title with gradient text */}
                                <div className="flex-1">
                                    <h1 className="text-xl md:text-2xl font-semibold bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent">
                                        Personalized Nutrition Plan
                                        <span className="block md:inline-block text-sm md:text-base font-normal text-emerald-600/90 mt-1 md:mt-0 md:ml-3">
                                            {userData?.user?.fitnessGoal && `(Optimized for ${userData.user.fitnessGoal})`}
                                        </span>
                                    </h1>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* User Details */}
                    <Card className="border-0 shadow-none">
                        <CardHeader className="pb-3 px-4">
                            <CardTitle className="text-base font-medium text-gray-900 flex items-center gap-2">
                                <span>{userData?.user?.firstName} {userData?.user?.lastName}</span>
                                <span className="text-xs font-normal text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                                    {userData?.user?.country}
                                </span>
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="px-4 pt-0 grid grid-cols-2 md:grid-cols-3 gap-4">
                            <div className="text-sm text-gray-600">
                                <p className="font-medium">Activity Level</p>
                                <p className="text-emerald-700">{userData?.user?.activityLevel}</p>
                            </div>

                            <div className="text-sm text-gray-600">
                                <p className="font-medium">Cooking Style</p>
                                <p className="text-emerald-700">{userData?.user?.cookingStyle}</p>
                            </div>

                            <div className="text-sm text-gray-600">
                                <p className="font-medium">Dietary Restrictions</p>
                                <p className="text-emerald-700">{userData?.user?.dietaryRestrictions}</p>
                            </div>

                            <div className="text-sm text-gray-600">
                                <p className="font-medium">Preferred Cuisine</p>
                                <p className="text-emerald-700">{userData?.user?.preferredCuisine}</p>
                            </div>

                            {userData?.user?.weight && userData?.user?.height && (
                                <div className="text-sm text-gray-600">
                                    <p className="font-medium">BMI</p>
                                    <p className={
                                        (() => {
                                            const bmi = parseFloat(calculateBMI({
                                                weight: userData.user.weight,
                                                height: userData.user.height
                                            }));
                                            if (bmi < 18.5) return "text-red-600";
                                            if (bmi >= 25) return "text-red-600";
                                            if (bmi >= 23) return "text-amber-600";
                                            return "text-emerald-600";
                                        })()
                                    }>
                                        {calculateBMI({
                                            weight: userData.user.weight || 0,
                                            height: userData.user.height || 0
                                        })}
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Overview Section */}
                    <div className="grid gap-4 md:gap-5 lg:grid-cols-2 rounded-lg bg-white p-4 shadow-xs">
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

                    {/* Meal Plan Table */}
                    <div className="grid grid-cols-1 gap-8">
                        {dietPlan.daily_plan?.map((dayPlan, index) => (
                            <Card key={dayPlan.day} className="w-full bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out">
                                {/* Day Header with Progress Psychology */}
                                <CardHeader className="px-6 py-2 bg-emerald-50/70 rounded-t-xl border-b border-emerald-100">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-emerald-500/10 px-2 py-1 rounded-lg border border-emerald-500/20">
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

                                <CardContent className="p-6 grid lg:grid-cols-2 gap-6">
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

                    {/* Additional Sections */}
                    <div className="grid gap-px md:grid-cols-2 bg-gray-100/50 rounded-lg overflow-hidden border border-gray-200">
                        {/* Foods to Avoid */}
                        {(dietPlan.foods_to_avoid ?? []).length > 0 && (
                            <div className="bg-white p-4">
                                <div className="flex flex-col space-y-2">
                                    <h3 className="text-sm font-semibold text-red-600 uppercase tracking-wide">
                                        <span className="border-b-2 border-red-100 pb-1">Foods to Avoid</span>
                                    </h3>
                                    <div className="flex flex-wrap gap-1.5">
                                        {dietPlan.foods_to_avoid?.map((food, index) => (
                                            <span
                                                key={index}
                                                className="px-2 py-1 text-xs font-medium bg-red-50/60 text-red-700 rounded-md border border-red-200"
                                            >
                                                {food}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Ingredients List */}
                        {dietPlan.all_ingredients && dietPlan.all_ingredients.length > 0 && (
                            <div className="bg-white p-4">
                                <div className="flex flex-col space-y-2">
                                    <h3 className="text-sm font-semibold text-emerald-600 uppercase tracking-wide">
                                        <span className="border-b-2 border-emerald-100 pb-1">Ingredients Included in Plan</span>
                                    </h3>
                                    <div className="flex flex-wrap gap-1.5">
                                        {dietPlan.all_ingredients.map((ingredient, index) => (
                                            <span
                                                key={index}
                                                className="px-2 py-1 text-xs font-medium bg-emerald-50/60 text-emerald-700 rounded-md border border-emerald-200"
                                            >
                                                {ingredient}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}