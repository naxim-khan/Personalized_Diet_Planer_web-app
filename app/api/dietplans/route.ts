import { NextResponse } from "next/server";
import { getLoggedInUser } from "../../../lib/actions/users.action";
import { getDietPlansCollection } from "../../../lib/db";
import { DietPlanSchema } from "../../../types/dietPlan";

export async function GET() {
    try {
        const user = await getLoggedInUser();
        const collection = await getDietPlansCollection();

        const plan = await collection.findOne({ userId: user.$id });
        return plan
            ? NextResponse.json({ dietPlan: plan })
            : NextResponse.json({ error: "No plan found" }, { status: 404 });

    } catch (error) {
        console.error("GET Error:", error);
        return NextResponse.json({ error: "Failed to fetch plan" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const user = await getLoggedInUser();
        const body = await req.json();

        const parsedBody = DietPlanSchema.safeParse(body);
        if (!parsedBody.success) {
            return NextResponse.json({ error: "Invalid input" }, { status: 400 });
        }

        const collection = await getDietPlansCollection();
        const result = await collection.updateOne(
            { userId: user.$id },
            { 
                $set: {
                    ...parsedBody.data,
                    userId: user.$id,
                    updatedAt: new Date(),
                    createdAt: new Date(),
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
        return NextResponse.json({ error: "Database error" }, { status: 500 });
    }
}
