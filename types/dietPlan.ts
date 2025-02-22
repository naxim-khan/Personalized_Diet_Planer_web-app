
export type UserOptions = {
    age: number;
    weight: number;
    height: number;
    gender: "Male" | "Female";
    dietaryRestrictions: string;
    preferredTimeSpan: number;
    healthIssues: string;
    fitnessGoal: "Muscle Gain" | "Weight Loss" | "Maintenance";
    activityLevel: string;
    lifestyle: string;
    country: string;
    region: string;
    mealType: "Balanced" | "High Protein" | "Low Carb";
    preferredCuisine: string;
    cookingStyle: string;
    mealFrequency: string;
    avoidFoods: string[];
};

export const fixedOptions: UserOptions = {
    age: 24,
    weight: 72,
    height: 175,
    gender: "Male",
    dietaryRestrictions: "None",
    preferredTimeSpan: 7,
    healthIssues: "None",
    fitnessGoal: "Muscle Gain",
    activityLevel: "Little to No Exercise",
    lifestyle: "Non-smoker",
    country: "Pakistan",
    region: "Peshawar",
    mealType: "Balanced",
    preferredCuisine: "Pakistani",
    cookingStyle: "Home-Cooked",
    mealFrequency: "3 Meals",
    avoidFoods: ["Processed Sugar", "Fried Foods"],
};