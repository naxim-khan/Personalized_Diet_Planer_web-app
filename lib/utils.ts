import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { z } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const authformSchema = (type: string) =>
  z.object({
    // Existing fields
    firstName: type === "sign-up" ? z.string().min(3) : z.string().optional(),
    lastName: type === "sign-up" ? z.string().min(3) : z.string().optional(),

    // New diet/fitness fields
    age: type === "sign-up" ? z.coerce.number().min(1).max(120).optional() : z.never().optional(),
    weight: type === "sign-up" ? z.coerce.number().min(1).optional() : z.never().optional(),
    height: type === "sign-up" ? z.coerce.number().min(1).optional() : z.never().optional(),
    gender: type === "sign-up" ? z.enum(["Male", "Female", "Other"]) : z.never().optional(),
    dietaryRestrictions: type === "sign-up" ? z.enum(["None", "Vegetarian", "Vegan", "Gluten-Free", "Dairy-Free", "Other"]) : z.never().optional(),
    healthIssues: type === "sign-up" ? z.string() : z.never().optional(),
    fitnessGoal: type === "sign-up" ? z.enum(["Muscle Gain", "Weight Loss", "Maintenance", "Other"]) : z.never().optional(),
    activityLevel: type === "sign-up" ? z.enum(["Little to No Exercise", "Light Exercise", "Moderate Exercise", "Heavy Exercise"]) : z.never().optional(),
    lifestyle: type === "sign-up" ? z.enum(["Non-smoker", "Smoker", "Occasional Smoker", "Other"]) : z.never().optional(),
    country: type === "sign-up" ? z.string() : z.never().optional(),
    region: type === "sign-up" ? z.string() : z.never().optional(),
    mealType: type === "sign-up" ? z.enum(["Balanced", "High Protein", "Low Carb", "Other"]) : z.never().optional(),
    preferredCuisine: type === "sign-up" ? z.enum(["Pakistani", "Italian", "Mexican", "Other"]) : z.never().optional(),
    cookingStyle: type === "sign-up" ? z.enum(["Home-Cooked", "Restaurant", "Takeout", "Other"]) : z.never().optional(),

    // Common fields
    email: z.string().email(),
    password: z.string().min(8),
  });

export const parseStringify = (value: any) => JSON.parse(JSON.stringify(value));
