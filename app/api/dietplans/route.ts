import { NextResponse } from "next/server";
import { getLoggedInUser } from "@/lib/actions/users.action";
import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI!);
let dbConnected = false;

// ✅ Function to get the MongoDB collection
async function getDietPlansCollection() {
    if (!dbConnected) {
        await client.connect();
        dbConnected = true;
    }
    return client.db().collection("dietPlans"); // Uses default DB from MongoDB URI
}

// ✅ GET: Fetch user's diet plans from MongoDB
export async function GET() {
    try {
        const loggedInUser = await getLoggedInUser();
        if (!loggedInUser) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const dietPlansCollection = await getDietPlansCollection();
        const dietPlans = await dietPlansCollection.find({ userId: loggedInUser.$id }).toArray();

        if (!dietPlans.length) {
            return NextResponse.json({ error: "No diet plans found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, dietPlans });

    } catch (error) {
        console.error("❌ Error fetching diet plan:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

// ✅ POST: Store a new diet plan securely in MongoDB
export async function POST(req: Request) {
    try {
        const loggedInUser = await getLoggedInUser();
        if (!loggedInUser) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const requestBody = await req.json();
        if (!requestBody || Object.keys(requestBody).length === 0) {
            return NextResponse.json({ error: "Invalid diet plan data" }, { status: 400 });
        }

        const dietPlansCollection = await getDietPlansCollection();
        const newDietPlan = await dietPlansCollection.insertOne({
            userId: loggedInUser.$id,
            ...requestBody,
            createdAt: new Date(),
        });

        return NextResponse.json({ success: true, dietPlan: newDietPlan });

    } catch (error) {
        console.error("❌ Error storing diet plan:", error);
        return NextResponse.json({ error: "Failed to store diet plan" }, { status: 500 });
    }
}
