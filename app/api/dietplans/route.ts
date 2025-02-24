import { NextResponse } from "next/server";
import { getLoggedInUser } from "../../../lib/actions/users.action";
import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI!);

async function getDietPlansCollection() {
    await client.connect();
    return client.db().collection("dietPlans");
}

// Enhanced GET endpoint
export async function GET() {
    try {
        const user = await getLoggedInUser();
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const collection = await getDietPlansCollection();
        const plan = await collection.findOne({ userId: user.$id });

        return plan 
            ? NextResponse.json({ dietPlan: plan })
            : NextResponse.json({ error: "No plan found" }, { status: 404 });

    } catch (error) {
        console.error("GET Error:", error);
        return NextResponse.json(
            { error: "Failed to fetch plan" },
            { status: 500 }
        );
    }
}

// Enhanced POST endpoint
export async function POST(req: Request) {
    try {
        const user = await getLoggedInUser();
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        // Validate request body
        let body;
        try {
            body = await req.json();
        } catch (error) {
            return NextResponse.json(
                { error: "Invalid JSON body" },
                { status: 400 }
            );
        }

        const collection = await getDietPlansCollection();
        const result = await collection.updateOne(
            { userId: user.$id },
            {
                $set: {
                    ...body,
                    userId: user.$id,
                    updatedAt: new Date(),
                    createdAt: new Date()
                }
            },
            { upsert: true }
        );

        if (!result.acknowledged) {
            throw new Error("Database operation failed");
        }

        const savedPlan = await collection.findOne({ userId: user.$id });
        return NextResponse.json({ dietPlan: savedPlan });

    } catch (error) {
        console.error("POST Error:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Database error" },
            { status: 500 }
        );
    }
}