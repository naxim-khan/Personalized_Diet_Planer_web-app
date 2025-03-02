"use server";
import { UserOptions } from "../../types/dietPlan";

export type DietPlan = {
    _id?: string;
    userId?: string;
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

const MODELS = [
    "meta-llama/llama-3.3-70b-instruct:free",
    "deepseek/deepseek-r1-distill-llama-70b:free",
    "deepseek/deepseek-r1:free",
];

export async function generateDietPlan(userOptions: UserOptions): Promise<any> {
    const apiKey = process.env.OPENROUTER_API_KEY;
    console.log("Diet Plan action user data:", userOptions);

    if (!apiKey) {
        console.error("❌ Server config error - OPENROUTER_API_KEY missing");
        return { error: "Server configuration error. Please contact support." };
    }

    const strictPrompt = `
    Generate a personalized diet plan for ${userOptions.preferredTimeSpan} days in strict JSON format. 
    Follow this exact structure:
      {
      "calories_per_day": number,
      "macronutrient_distribution": {
      "protein": "Xg",
      "carbohydrates": "Yg",
      "fats": "Zg"
      },
      "daily_plan": [
      {
      "day": number,
      "breakfast": [{ "meal": string, "ingredients": string[] }],
      "lunch": [{ "meal": string, "ingredients": string[] }],
      "snacks": [{ "meal": string, "ingredients": string[] }],
      "dinner": [{ "meal": string, "ingredients": string[] }]
      }
      ],
      "alternatives": [{ "original": string, "alternatives": string[] }],
      "foods_to_avoid": string[],
      "instructions": string[],
      "all_ingredients": string[]
      }
      
      User Profile:
      
      Age: ${userOptions.age}
      Weight: ${userOptions.weight} kg
      Height: ${userOptions.height} cm
      Gender: ${userOptions.gender}
      Dietary Restrictions: ${userOptions.dietaryRestrictions}
      Health Issues: ${userOptions.healthIssues}
      Fitness Goal: ${userOptions.fitnessGoal}
      Activity Level: ${userOptions.activityLevel}
      Meal Type: ${userOptions.mealType}
      Preferred Cuisine: ${userOptions.preferredCuisine}
      Cooking Style: ${userOptions.cookingStyle}
      
      Rules:
      1. Strict JSON output only. No markdown, no extra text.
      2. Validate JSON syntax before responding.
      3. Include all required fields without missing data.
      4. Format numbers with units (e.g., "150g").
      5. Ensure ingredients match the user’s region: ${userOptions.region}, ${userOptions.country}.
      6. Prioritize nutrient-dense and healthy options.
      7. Avoid excessive sugars, unhealthy fats, and processed foods.
      8. Make the meal plan realistic and easy to prepare based on the user’s cooking style.
      9. Meals must be budget-friendly and not use expensive or hard-to-find ingredients.
    `.replace(/^\s+/gm, "");

    for (const model of MODELS) {
        try {
            const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${apiKey}`,
                    "Content-Type": "application/json",
                    "HTTP-Referer": "YOUR_SITE_URL",
                    "X-Title": "Diet Planner"
                },
                body: JSON.stringify({
                    model,
                    messages: [{ role: "user", content: strictPrompt }],
                    response_format: { type: "json_object" },
                    temperature: 0.3,
                    max_tokens: 4000 // Ensure enough tokens for complete response
                }),
            });

            const rawResponse = await response.text();

            if (!response.ok) {
                console.error(`API Error (${model}):`, response.status, rawResponse);
                continue;
            }

            try {
                const apiResponse = JSON.parse(rawResponse);
                const content = apiResponse.choices[0]?.message?.content;

                if (!content) {
                    console.error("No content in response from", model);
                    continue;
                }

                // Enhanced JSON cleaning
                const cleanedContent = content
                    .replace(/```json/g, '')
                    .replace(/```/g, '')
                    .replace(/(\r\n|\n|\r)/gm, "") // Remove newlines
                    .replace(/\s+/g, " ") // Collapse whitespace
                    .trim();

                // Validate JSON structure before parsing
                if (!cleanedContent.startsWith("{") || !cleanedContent.endsWith("}")) {
                    console.error("Invalid JSON boundaries in response");
                    continue;
                }

                const dietPlan = JSON.parse(cleanedContent);

                // Validate required fields
                if (!dietPlan.daily_plan || !dietPlan.macronutrient_distribution) {
                    console.error("Missing required fields in response");
                    continue;
                }

                console.log("✅ Cleaned Diet Plan:", JSON.stringify(dietPlan, null, 2));
                return dietPlan;

            } catch (parseError) {
                console.error("JSON Parsing Error:", parseError);
                continue;
            }

        } catch (error) {
            console.error(`Error with model ${model}:`, error);
        }
    }

    return { error: "All model attempts failed. Please try again later." };
}





// =======================================
// ======= GPT -4 MODEL =================
// =======================================
