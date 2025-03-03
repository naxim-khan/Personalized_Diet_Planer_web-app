"use server";
import { UserOptions } from "../../types/dietPlan";
import OpenAI from 'openai';

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
    "meta-llama/llama-3.2-11b-vision-instruct:free",
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
Generate a personalized diet plan for ${userOptions.preferredTimeSpan} days in strict JSON format, following this exact structure:

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
- Age: ${userOptions.age}
- Weight: ${userOptions.weight} kg
- Height: ${userOptions.height} cm
- Gender: ${userOptions.gender}
- Dietary Restrictions: ${userOptions.dietaryRestrictions}
- Health Issues: ${userOptions.healthIssues}
- Fitness Goal: ${userOptions.fitnessGoal}
- Activity Level: ${userOptions.activityLevel}
- Meal Type: ${userOptions.mealType}
- Preferred Cuisine: ${userOptions.preferredCuisine}
- Cooking Style: ${userOptions.cookingStyle}
- Region: ${userOptions.region}
- Country: ${userOptions.country}

1. Caloric and Macronutrient Calculation
   - Use the Mifflin-St Jeor Equation for Basal Metabolic Rate (BMR)
     - Males: (10 × weight) + (6.25 × height) - (5 × age) + 5
     - Females: (10 × weight) + (6.25 × height) - (5 × age) - 161
   - Calculate Total Daily Energy Expenditure (TDEE) using the activity level multiplier: ${userOptions.activityLevel} (1.2 to 1.9)
   - Adjust calories based on the fitness goal
     - Weight Loss: TDEE × 0.85 (15% deficit)
     - Muscle Gain: TDEE × 1.15 (15% surplus)

   - Macronutrient Distribution:
     - Protein: 1.2-2.2g per kg body weight
     - Carbohydrates: 45-65% of remaining calories
     - Fats: 20-35% of remaining calories
     - Special adjustments for health issues: ${userOptions.healthIssues}

2. Meal Composition and Dietary Compliance
   - Follow the structure of ${userOptions.mealType} meals while incorporating ${userOptions.preferredCuisine} flavors
   - Validate ingredients against dietary restrictions: ${userOptions.dietaryRestrictions}
   - Meals should be balanced, nutrient-dense, and culturally relevant
   - prevent repetition
   - Include five staple ingredients from ${userOptions.region}
   - Avoid allergens or restricted foods

3. Cooking and Ingredient Optimization
   - Optimize meals based on ${userOptions.cookingStyle}
   - Simple, cost-effective meals
   - Ensure ingredient availability in ${userOptions.country}

4. Output Requirements
   - Strict JSON format with no extra text or missing fields
   - Use metric units only (grams, liters, etc.)
   - Ensure daily total calories and macros stay within ±5% of the target
   - Sort all ingredients alphabetically

5. Validation and Critical Thinking
   - Ensure accurate TDEE calculation aligned with ${userOptions.fitnessGoal}
   - Ensure the macro split meets daily energy needs
   - Create meal diversity while following dietary restrictions
   - Optimize meals for taste, efficiency, and ease of cooking
   - Ensure sufficient micronutrient intake for health concerns
   - Provide a structured, cost-effective shopping list

Generate the output strictly in JSON format with proper escaping.
`.replace(/^\s+/gm, "");

    const GPT4_PROMPT = `
    Generate a personalized diet plan for ${userOptions.preferredTimeSpan} days in strict JSON format, following this exact structure:
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
    Age: ${userOptions.age} years  
    Weight: ${userOptions.weight} kg  
    Height: ${userOptions.height} cm  
    Gender: ${userOptions.gender}  
    Dietary Restrictions: ${userOptions.dietaryRestrictions}  
    Health Issues: ${userOptions.healthIssues}  
    Fitness Goal: ${userOptions.fitnessGoal}  
    Activity Level: ${userOptions.activityLevel} (1.2 to 1.9)  
    Meal Type: ${userOptions.mealType}  
    Preferred Cuisine: ${userOptions.preferredCuisine}  
    Cooking Style: ${userOptions.cookingStyle}  
    Region: ${userOptions.region}  
    Country: ${userOptions.country}  

    1. Caloric and Macronutrient Calculation  
    - Use the Mifflin-St Jeor Equation for Basal Metabolic Rate  
      - Male: (10 × weight) + (6.25 × height) - (5 × age) + 5  
      - Female: (10 × weight) + (6.25 × height) - (5 × age) - 161  
    - Calculate Total Daily Energy Expenditure by multiplying BMR with the activity level  
    - Adjust calorie intake based on the fitness goal  
      - Weight Loss: TDEE × 0.85 (15 percent deficit)  
      - Muscle Gain: TDEE × 1.15 (15 percent surplus)  
    - Macronutrient Distribution  
      - Protein: 1.2-2.2 grams per kilogram of body weight  
      - Carbohydrates: 45-65 percent of remaining calories  
      - Fats: 20-35 percent of remaining calories  
      - Adjust for health concerns as necessary  

    2. Meal Planning Guidelines  
    - Meals should align with the selected meal type and preferred cuisine  
    - Provide at least three variations per meal type to prevent repetition  
    - Exclude ingredients restricted by dietary restrictions and avoid allergens  
    - Ensure meals include staple ingredients from the specified region  
    - Meals must be balanced, nutrient-dense, and culturally relevant  

    3. Cooking and Ingredient Optimization  
    - Optimize meal plans based on the specified cooking style  
    - Allow for minimal preparation and batch cooking options where applicable  
    - Ensure ingredients are available in the specified country  

    4. Output Requirements  
    - The response must be in strict JSON format with no extra text or missing fields  
    - Use metric units only, such as grams and liters  
    - Ensure daily calorie and macronutrient values remain within 5 percent of the target  
    - Sort all ingredients alphabetically  

    5. Validation and Quality Control  
    - Verify accuracy in caloric and macronutrient calculations based on the fitness goal  
    - Ensure dietary restriction compliance  
    - Maintain meal variety, taste, and cost-effectiveness  
    - Generate a structured and practical shopping list  

    Generate the output strictly in JSON format with proper escaping.
    `.replace(/^\s+/gm, "");

    // First try GPT model with custom configuration
    try {

        const gpt4Api = process.env.GPT4_API_KEY;
        if (!gpt4Api) {
            console.error("GPT-4 api key missing...!")
            // return { error: 'server configuration error. Please contact support.' }
        }

        const gptClient = new OpenAI({
            apiKey: gpt4Api,
            baseURL: "https://models.inference.ai.azure.com",
        });

        const chatCompletion = await gptClient.chat.completions.create({
            messages: [{ role: 'user', content: GPT4_PROMPT }],
            model: 'gpt-4o',
            response_format: { type: "json_object" },
            temperature: 0.7,
            max_tokens: 4096,
            top_p: 0.9
        });

        const content = chatCompletion.choices[0]?.message?.content || "";

        // Enhanced JSON cleaning
        const cleanedContent = content
            .replace(/```json/g, '')
            .replace(/```/g, '')
            .replace(/(\r\n|\n|\r)/gm, "")
            .replace(/\s+/g, " ")
            .trim();

        if (!cleanedContent.startsWith("{") || !cleanedContent.endsWith("}")) {
            throw new Error("Invalid JSON boundaries in GPT response");
        }

        const dietPlan = JSON.parse(cleanedContent);

        if (!dietPlan.daily_plan || !dietPlan.macronutrient_distribution) {
            throw new Error("Missing required fields in GPT response");
        }

        console.log("✅ GPT-generated Diet Plan:", JSON.stringify(dietPlan, null, 2));
        return dietPlan;

    } catch (gptError) {
        console.error("GPT model fail error:", gptError);
    }

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

