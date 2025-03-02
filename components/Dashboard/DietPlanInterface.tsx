"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { DietPlanTypes } from "../../types/index";
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

export default function DietPlanInterface() {
    const [dietPlan, setDietPlan] = useState<DietPlanTypes | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [userData, setUserData] = useState<any>(null);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [jobId, setJobId] = useState<string | null>(null);
    const printRef = useRef<HTMLDivElement>(null);
    const COLORS = ['#00ff0d', '#02a10a', '#027008'];
    const pollingInterval = useRef<NodeJS.Timeout | null>(null);
    const chartRef = useRef<HTMLDivElement>(null);
    const [pdfReady, setPdfReady] = useState(false);
    const [chartImage, setChartImage] = useState<string | null>(null);
    const [isInitializing, setIsInitializing] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false);
    const [processingStatus, setProcessingStatus] = useState<'idle' | 'pending' | 'processing' | 'completed'>('idle');

    // Fetch user data and check existing plans
    useEffect(() => {
        const initializeData = async () => {
            try {
                const userResponse = await fetch('/api/user');
                if (!userResponse.ok) throw new Error("Failed to fetch user data");
                const userData = await userResponse.json();
                setUserData(userData);

                const planResponse = await fetch('/api/check-plan');
                const planData = await planResponse.json();

                if (planData.status === 'exists') {
                    setDietPlan(planData.plan);
                    setProcessingStatus('completed');
                } else if (planData.status === 'pending') {
                    setProcessingStatus('pending');
                    setLoading(true);
                    startPolling(planData.jobId);
                }
            } catch (error) {
                console.error("Initialization error:", error);
                setError("Failed to load initial data");
            } finally {
                setIsInitializing(false);
            }
        };
        initializeData();
    }, []);

    // Polling logic
    // Modified polling logic to fetch from database after completion
    const startPolling = useCallback((jobId: string) => {
        setJobId(jobId);
        setProcessingStatus('processing');
        setLoading(true);

        const startTime = Date.now();
        const timeout = 300000;

        if (pollingInterval.current) {
            clearInterval(pollingInterval.current);
        }

        pollingInterval.current = setInterval(async () => {
            if (Date.now() - startTime > timeout) {
                clearInterval(pollingInterval.current!);
                setProcessingStatus('idle');
                setError("Plan generation timed out");
                setLoading(false);
                return;
            }

            try {
                const res = await fetch(`/api/job-status?jobId=${jobId}`);
                const { status } = await res.json();

                if (status === 'completed') {
                    clearInterval(pollingInterval.current!);

                    // Fetch the latest plan from database
                    const planResponse = await fetch('/api/check-plan');
                    const planData = await planResponse.json();

                    if (planData.status === 'exists') {
                        setDietPlan(planData.plan);
                    } else {
                        throw new Error("Generated plan not found");
                    }

                    setProcessingStatus('completed');
                    setLoading(false);
                } else if (status === 'failed') {
                    clearInterval(pollingInterval.current!);
                    setProcessingStatus('idle');
                    setError("Plan generation failed");
                    setLoading(false);
                }
            } catch (error) {
                console.error("Polling error:", error);
                setProcessingStatus('idle');
                setLoading(false);
                setError("Error checking plan status");
            }
        }, 3000);
    }, []);

    // Cleanup polling
    useEffect(() => {
        return () => {
            if (pollingInterval.current) {
                clearInterval(pollingInterval.current);
            }
        };
    }, []);

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

            const response = await fetch('/api/generate-plan', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(mergedOptions)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to start generation");
            }

            const responseData = await response.json();
            if (!responseData.jobId) throw new Error("Missing job ID in response");
            startPolling(responseData.jobId);
        } catch (err: any) {
            setLoading(false);
            setError(err.message);
        }
    };

    const handleConfirmDelete = async () => {
        if (!dietPlan?._id) return;

        try {
            setIsDeleting(true);
            const response = await fetch(`/api/dietplans/${dietPlan._id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText);
            }

            setDietPlan(null);
            setProcessingStatus('idle');
            setShowDeleteConfirmation(false);
        } catch (error) {
            console.error("Delete error:", error);
            setError("Failed to delete diet plan");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="p-2 py-4 md:p-6 w-full bg-gray-50 rounded-2xl border border-gray-100 mx-auto space-y-6">
            {/* Loading overlay */}
            {loading && (
                <div className="fixed inset-0  flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md text-center">
                        <p className="text-gray-700 font-medium">Crafting your meal plan...</p>
                        <p className="text-sm text-gray-500 mt-2">This usually takes 30-60 seconds</p>
                    </div>
                </div>
            )}
             {/* Error Alert with Retry Button */}
             {error && (
                <Alert variant="destructive" className="border-2">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription className="flex items-center justify-between">
                        <span>{error}</span>
                        <Button
                            onClick={handleGenerate}
                            variant="outline"
                            size="sm"
                            className="ml-4"
                            disabled={loading}
                        >
                            Try Again
                        </Button>
                    </AlertDescription>
                </Alert>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteConfirmation && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-[100]">
                    <Card className="bg-white border-gray-200 animate-in fade-in-90 zoom-in-95 w-full max-w-md border-0 shadow-xl">
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
                                        disabled={isDeleting}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        onClick={handleConfirmDelete}
                                        className="px-5 bg-destructive hover:bg-destructive/90 text-red-500 bg-red-100"
                                        disabled={isDeleting}
                                    >
                                        {isDeleting ? (
                                            <svg
                                                className="animate-spin h-5 w-5 text-white"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                            >
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                            </svg>
                                        ) : (
                                            <>
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                Delete Plan
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Control Buttons */}
            <div className="flex flex-col gap-4">
                <div className="flex flex-row gap-4">
                    <Button
                        onClick={dietPlan ? () => setShowDeleteConfirmation(true) : handleGenerate}
                        size="lg"
                        variant={dietPlan ? "destructive" : "default"}
                        className="relative w-full sm:w-auto hover:scale-105 transition-transform bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                        disabled={isInitializing || loading || processingStatus === 'pending' || processingStatus === 'processing' || isDeleting}
                    >
                        <div className="flex items-center gap-2">
                            {loading ? (
                                <>
                                    <svg
                                        className="animate-spin h-5 w-5 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    <span>Generating...</span>
                                </>
                            ) : dietPlan ? "Delete Plan" : "Generate Plan"}
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
                                    document={<DietPlanPDF userData={userData} dietPlan={dietPlan} chartImage={chartImage!} />}
                                    fileName="diet-plan.pdf"
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

                {/* Status Messages */}
                {processingStatus === 'pending' && (
                    <div className="flex items-center gap-2 text-blue-600">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span>Your plan is being prepared. Please wait...</span>
                    </div>
                )}

                {processingStatus === 'processing' && (
                    <div className="flex items-center gap-2 text-blue-600">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span>Finalizing your personalized plan. Almost ready...</span>
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

            {/* Diet Plan Display */}
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