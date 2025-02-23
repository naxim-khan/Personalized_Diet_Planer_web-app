// "use server";

// import { storeDietPlanInDB } from "../../lib/actions/diet.db";
// import { getLoggedInUser } from "../../lib/actions/users.action";
// import { generateDietPlan } from "../../lib/actions/dietplan.action";  // Import your existing function

// export async function generateAndStoreDietPlan() {
//     try {
        
//         const dietPlan = await generateDietPlan();

//         if ("error" in dietPlan) {
//             return dietPlan; // Return error if generation fails
//         }

//         // ✅ Step 2: Get Logged-in User
//         const user = await getLoggedInUser();
//         if (!user) {
//             return { error: "Unauthorized: Please log in to save your diet plan." };
//         }

//         // ✅ Step 3: Store the Diet Plan in Database
//         const storedPlan = await storeDietPlanInDB(user.$id, dietPlan);
        
//         return { success: true, storedPlan };
//     } catch (error: any) {
//         console.error("Error storing diet plan:", error);
//         return { error: error.message || "Failed to store diet plan" };
//     }
// }
