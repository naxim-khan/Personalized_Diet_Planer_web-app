import { NextResponse } from "next/server";
import { getLoggedInUser } from "@/lib/actions/users.action";
import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI!);
let dbConnected = false;

async function getDietPlansCollection() {
    if (!dbConnected) {
        await client.connect();
        dbConnected = true;
    }
    return client.db().collection("dietPlans");
}

// ✅ GET: Fetch user's diet plan (single plan per user)
export async function GET() {
    try {
        const loggedInUser = await getLoggedInUser();
        if (!loggedInUser) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const dietPlansCollection = await getDietPlansCollection();
        const dietPlan = await dietPlansCollection.findOne({
            userId: loggedInUser.$id // Only fetch plans for the logged-in user
        });

        if (!dietPlan) {
            return NextResponse.json({ error: "No diet plan found" }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            dietPlan // Return single plan
        });

    } catch (error) {
        console.error("❌ Error fetching diet plan:", error);
        return NextResponse.json(
            { error: "Failed to fetch diet plan" },
            { status: 500 }
        );
    }
}

// ✅ POST: Create/Update user's diet plan
export async function POST(req: Request) {
    try {
        const loggedInUser = await getLoggedInUser();
        if (!loggedInUser) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const requestBody = await req.json();
        if (!requestBody || Object.keys(requestBody).length === 0) {
            return NextResponse.json(
                { error: "Invalid diet plan data" },
                { status: 400 }
            );
        }

        const dietPlansCollection = await getDietPlansCollection();
        const userId = loggedInUser.$id;

        // Upsert operation with proper error handling
        const updateResult = await dietPlansCollection.updateOne(
            { userId },
            {
                $set: {
                    ...requestBody,
                    userId,
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            },
            { upsert: true }
        );

        if (!updateResult.acknowledged) {
            throw new Error("Database operation failed");
        }

        // Fetch the updated/created document
        const dietPlan = await dietPlansCollection.findOne({ userId });

        if (!dietPlan) {
            throw new Error("Failed to retrieve saved diet plan");
        }

        return NextResponse.json({
            success: true,
            dietPlan
        });

    } catch (error) {
        console.error("❌ Error storing diet plan:", error);
        return NextResponse.json(
            { 
                success: false,
                error: error instanceof Error ? error.message : "Unknown error occurred"
            },
            { status: 500 }
        );
    }
}
