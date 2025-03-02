import { NextResponse } from "next/server";
import { getLoggedInUser } from "../../../lib/actions/users.action";
import { getDietPlansCollection } from "../../../lib/db";
import { queue } from "../../../lib/queue";

export async function POST(req: Request) {
    try {
        const user = await getLoggedInUser();
        const userOptions = await req.json();
        const collection = await getDietPlansCollection();

        // Check for existing completed plan
        const existingPlan = await collection.findOne({
            userId: user.$id,
            status: "completed"
        });

        if (existingPlan) {
            return NextResponse.json(
                { error: "A diet plan already exists for this user" },
                { status: 409 }
            );
        }

        // Create initial document with proper structure
        const initialDoc = {
            userId: user.$id,
            status: "pending",
            createdAt: new Date(),
            updatedAt: new Date(),
            calories_per_day: "",
            macronutrient_distribution: {
                protein: "",
                carbohydrates: "",
                fats: ""
            },
            daily_plan: [],
            alternatives: [],
            foods_to_avoid: [],
            instructions: [],
            all_ingredients: []
        };

        const result = await collection.insertOne(initialDoc);
        const jobId = result.insertedId.toString();

        await queue.publish({
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/process-plan`,
            body: JSON.stringify({
                userId: user.$id,
                jobId,
                options: userOptions,
                workerSecret: process.env.WORKER_SECRET
            }),
            retries: 3,
        });

        return NextResponse.json({ 
            status: "processing", 
            jobId 
        });

    } catch (error) {
        console.error("POST Error:", error);
        return NextResponse.json(
            { error: "Failed to generate plan" }, 
            { status: 500 }
        );
    }
}