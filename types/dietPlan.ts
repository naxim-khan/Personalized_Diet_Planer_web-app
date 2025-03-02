import { z } from "zod";

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

// Define Meal schema
const MealSchema = z.object({
    meal: z.string(),
    ingredients: z.array(z.string()),
  });
  
  // Define daily plan schema
  const DailyPlanSchema = z.object({
    day: z.number(),
    breakfast: z.array(MealSchema),
    lunch: z.array(MealSchema),
    snacks: z.array(MealSchema),
    dinner: z.array(MealSchema),
  });
  
  // Define the DietPlan schema
  export const DietPlanSchema = z.object({
    _id: z.string().optional(), // MongoDB ObjectId stored as a string
    userId: z.string(), // User reference ID
    all_ingredients: z.array(z.string()), // All ingredients used
    alternatives: z.array(
      z.object({
        original: z.string(),
        alternatives: z.array(z.string()),
      })
    ), // Ingredient alternatives
    calories_per_day: z.string(),
    daily_plan: z.array(DailyPlanSchema), // Array of daily meal plans
    foods_to_avoid: z.array(z.string()), // Foods that should be avoided
    instructions: z.array(z.string()), // List of dietary instructions
    macronutrient_distribution: z.object({
      protein: z.string(),
      carbohydrates: z.string(),
      fats: z.string(),
    }), // Macronutrient distribution
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
  });
  
  // Export TypeScript type for DietPlan
  export type DietPlan = z.infer<typeof DietPlanSchema>;