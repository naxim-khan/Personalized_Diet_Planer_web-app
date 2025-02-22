"use server";

const fixedOptions = {
    age: 24,
    weight: 72,
    height: 175,
    gender: "Male" as const,
    dietaryRestrictions: "None",
    preferredTimeSpan: 7, // more options : 1week, 15 days, 1 month
    healthIssues: "None",
    fitnessGoal: "Muscle Gain" as const,
    activityLevel: "Little to No Exercise", // further option could be added lately 
    lifestyle: "Non-smoker",
    country: "Pakistan",
    region: "Peshawar",
    mealType: "Balanced" as const,
    preferredCuisine: "Pakistani",
    cookingStyle: "Home-Cooked",
    mealFrequency: "3 Meals",
    avoidFoods: ["Processed Sugar", "Fried Foods"],

};

export type DietPlan = {
    calories_per_day: number;
    macronutrient_distribution: {
        protein: string;
        carbohydrates: string;
        fats: string;
    };
    daily_plan: Array<{
        day: number;
        breakfast: Array<{ meal: string; ingredients: string[] }>;
        lunch: Array<{ meal: string; ingredients: string[] }>;
        snacks: Array<{ meal: string; ingredients: string[] }>;
        dinner: Array<{ meal: string; ingredients: string[] }>;
    }>;
    alternatives?: Array<{ original: string; alternative: string[] }>;
    foods_to_avoid?: string[];
    instructions?: string[];
    all_ingredients?: string[];
};

export async function generateDietPlan(): Promise<DietPlan | { error: string }> {
    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
        console.error("❌ Server config error - OPENROUTER_API_KEY missing");
        return { error: "Server configuration error. Please contact support." };
    }

    const prompt = `
    Generate a structured **${fixedOptions.preferredTimeSpan}-day personalized diet plan** in **strict JSON format**.
    
    Respond only with valid JSON. Do NOT include any explanations, reasoning, comments, or markdown formatting.
    
    User Profile:
    - Age: ${fixedOptions.age}
    - Weight: ${fixedOptions.weight} kg
    - Height: ${fixedOptions.height} cm
    - Gender: ${fixedOptions.gender}
    - Dietary Restrictions: ${fixedOptions.dietaryRestrictions}
    - Health Issues: ${fixedOptions.healthIssues}
    - Fitness Goal: ${fixedOptions.fitnessGoal}
    - Activity Level:${fixedOptions.activityLevel}
    - Life Style: ${fixedOptions.lifestyle}
    - Country: ${fixedOptions.country}
    - Region: ${fixedOptions.region}
    - Meal Type: ${fixedOptions.mealType}
    - Preferred Cuisine: ${fixedOptions.preferredCuisine}
    - Cooking Style: ${fixedOptions.cookingStyle}
    - Meal Frequency: ${fixedOptions.mealFrequency}
    
    **IMPORTANT:** Your response MUST be a **valid JSON object** and follow this format:
    
    {
      "calories_per_day": 2500,
      "macronutrient_distribution": {
        "protein": "150g",
        "carbohydrates": "300g",
        "fats": "80g"
      },
      "daily_plan": [
        {
          "day": 1,
          "breakfast": [{ "meal": "Meal Name", "ingredients": ["Ing1", "Ing2"] }],
          "lunch": [{ "meal": "Meal Name", "ingredients": ["Ing1", "Ing2"] }],
          "snacks": [{ "meal": "Snack Name", "ingredients": ["Ing1", "Ing2"] }],
          "dinner": [{ "meal": "Meal Name", "ingredients": ["Ing1", "Ing2"] }]
        }
        // Continue for ${fixedOptions.preferredTimeSpan - 1} more days...
      ],
      "alternatives": [
        { "original": "Food", "alternative": ["Sub1", "Sub2"] }
      ],
      "foods_to_avoid": ["Food1", "Food2"],
      "instructions": ["Instruction1", "Instruction2"],
      "all_ingredients": ["Ing1", "Ing2", "Ing3"]
    }
    
    Rules:
    1. Only return JSON. No additional text.
    2. Do NOT include explanations, reasoning, or markdown formatting, give only the final output you generate.
    3. Ensure the JSON is valid and follows the exact format above.
    4. Ensure complete response don't leave in the middle give the complete structure
    `;

    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
                // "HTTP-Referer": `${process.env.NEXT_PUBLIC_SITE_URL}`,
            },
            body: JSON.stringify({
                model: "deepseek/deepseek-r1:free",
                messages: [{
                    role: "user",
                    content: prompt
                }],
                // temperature: 0.3,
                response_format: { type: "json_object" } // **Forcing JSON response**
            }),
        });

        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`API request failed (${response.status}): ${errorBody}`);
        }

        const data = await response.json();
        const content = data.choices?.[0]?.message?.content;

        if (!content) {
            throw new Error("Empty response The Servier is busy try after sometime...");
        }

        try {
            const parsedData: DietPlan = JSON.parse(content);
            if (!parsedData.daily_plan || !parsedData.calories_per_day) {
                throw new Error("Invalid diet plan structure received");
            }
            return parsedData;
        } catch (error) {
            console.error("Invalid JSON content:", content);
            throw new Error("Failed to parse JSON response from API.");
        }

    } catch (error: any) {
        console.error("Error:", error);
        return { error: error.message || "Failed to generate diet plan" };
    }
}
