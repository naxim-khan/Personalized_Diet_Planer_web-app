import { createAdminClient } from "../../lib/appwrite";

export async function storeDietPlanInDB(userId: string, dietPlan: any) {
    try {
        const { databases } = await createAdminClient();

        if (!databases) {
            console.error("❌ Appwrite databases object is undefined!");
            throw new Error("Failed to connect to Appwrite databases.");
        }

        console.log("✅ Appwrite Database Connection Successful");

        const response = await databases.createDocument(
            process.env.APPWRITE_DATABASE_ID!,
            process.env.APPWRITE_DIET_COLLECTION_ID!,
            "unique()",  
            {
                userId,
                dietPlan,
                createdAt: new Date().toISOString()
            }
        );

        console.log("✅ Successfully stored diet plan:", response);
        return response;
    } catch (error) {
        console.error("❌ Error storing diet plan in DB:", error);
        throw new Error("Failed to store diet plan"); 
    }
}

