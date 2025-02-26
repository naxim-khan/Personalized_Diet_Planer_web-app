import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import {BMICalculation} from './types'
export function UserDetails({ userData }: { userData: any }) {
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
    );
}