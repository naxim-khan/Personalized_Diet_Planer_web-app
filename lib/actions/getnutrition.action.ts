interface NutritionData {
    // Example:
    items: Array<{
        name: string;
        calories: number;
        serving_size_g: number;
        fat_total_g: number;
        fat_saturated_g: number;
        protein_g: number;
        sodium_mg: number;
        potassium_mg: number;
        cholesterol_mg: number;
        carbohydrates_total_g: number;
        fiber_g: number;
        sugar_g: number;
    }>;
}



export const getNutritionData = async (query: string): Promise<NutritionData> => {
    console.log("nutriction Function Triggered")
    console.log("SUBmitteddata: ", query)
    const apiKey = process.env.NEXT_PUBLIC_CALORIE_NINJAS_SECRET;
    const url = `https://api.calorieninjas.com/v1/nutrition?query=${encodeURIComponent(query)}`;
    // Ensure the API key is defined
    
    try {
        if (!apiKey) {
            console.log("api key missing", apiKey)
            throw new Error("API key is missing. Please ensure CALORIE_NINJAS_SECRET is set in your environment variables.");
        }
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                "X-Api-Key": apiKey,
                "Content-Type": "application/json"
            },
        });

        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`Error: ${response.status} - ${errorBody}`);
        }

        const data: NutritionData = await response.json();
        console.log("Nutrition Data: ", data);
        return data;
    } catch (error) {
        throw new Error(`Request failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
};