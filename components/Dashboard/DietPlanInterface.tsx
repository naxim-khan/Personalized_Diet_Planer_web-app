"use client";
import { useState, useRef, useEffect } from "react";
import { DietPlan } from "../../lib/actions/dietplan.action";
import { DietPlanTypes } from "../../types/index"
import { Button } from "../../components/ui/button";
import { toPng } from 'html-to-image';
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "../../components/ui/alert";
import { UserOptions } from "../../types/dietPlan";
import { TriangleAlert } from "lucide-react";
import { Trash2 } from "lucide-react";
import DietPlanPDF from '../../components/DietPlanPDF';
import { PDFDownloadLink } from '@react-pdf/renderer';

import { Header } from "./DietPlanUI/Header";
import { MealPlanTable } from "./DietPlanUI/MealPlanTable";
import { OverviewSection } from "./DietPlanUI/OverviewSection";
import { UserDetails } from "./DietPlanUI/UserDetails";
import { AdditionalSection } from "./DietPlanUI/AdditionalSection";
import { ImSpinner2 } from "react-icons/im";

// Pointer styling
import { Pointer } from "../magicui/pointer";
import { motion } from "motion/react";
import { SpinningText } from "../magicui/spinningtext";

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

    const chartRef = useRef<HTMLDivElement>(null);
    const [pdfReady, setPdfReady] = useState(false);
    const [chartImage, setChartImage] = useState<string | null>(null);

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
    // const validateDietPlan = (plan: any): plan is DietPlan => {
    //     return (
    //         plan?.daily_plan?.length > 0 &&
    //         plan?.macronutrient_distribution &&
    //         plan?.calories_per_day
    //     );
    // };
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


    const handleDelete = async () => {
        setShowDeleteConfirmation(true);
    };


    interface BMICalculation {
        weight: number;
        height: number;
    }

    return (
        <div className="p-2 py-4 md:p-6 w-full bg-gray-50 rounded-2xl border border-gray-100 mx-auto space-y-6">

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
            <div className="flex flex-row gap-4">
                <Button
                    onClick={dietPlan ? handleDelete : handleGenerate}
                    size="lg"
                    variant={dietPlan ? "destructive" : "default"}
                    className="relative w-full sm:w-auto hover:scale-105 transition-transform bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                    disabled={loading}
                >
                    {loading && (
                        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
                            <div className=" absolute size-full flex items-center justify-center">
                                <SpinningText reverse className="text-2xl text-green-600" duration={20} radius={10}>
                                    Loading... •  Plz Wait  •  Usually akes 10-40 seconds
                                </SpinningText>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md text-center">

                                <p className="text-gray-700 font-medium">
                                    Crafting your meal plan...
                                </p>
                                <p className="text-sm text-gray-500 mt-2">
                                    This usually takes 10-40 seconds
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

            {/* Diet Plan UI Interface */}
            {dietPlan && (
                <div ref={printRef} className="space-y-4">
                    <Header userData={userData} />
                    <UserDetails userData={userData} />
                    <OverviewSection dietPlan={dietPlan} COLORS={COLORS} chartRef={chartRef} />
                    <MealPlanTable dietPlan={dietPlan} />
                    <AdditionalSection dietPlan={dietPlan} />
                </div>
            )}
        </div>
    );
}