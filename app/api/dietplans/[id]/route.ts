import { NextResponse } from "next/server";
import { getLoggedInUser } from "@/lib/actions/users.action";
import { MongoClient, ObjectId } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI!);
let dbConnected = false;

async function getDietPlansCollection() {
    if (!dbConnected) {
        await client.connect();
        dbConnected = true;
    }
    return client.db().collection("dietPlans");
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        // Await params to ensure it's resolved
        const { id } = await params;

        const loggedInUser = await getLoggedInUser();
        if (!loggedInUser) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const dietPlansCollection = await getDietPlansCollection();

        console.log("Received ID:", id);
        const objectId = new ObjectId(id);
        console.log("Converted to ObjectId:", objectId);

        // Verify document exists
        const existingPlan = await dietPlansCollection.findOne({
            _id: objectId,
            userId: loggedInUser.$id
        });

        if (!existingPlan) {
            console.log("Document not found with criteria:", {
                _id: objectId,
                userId: loggedInUser.$id
            });
            return NextResponse.json(
                { error: "Diet plan not found" },
                { status: 404 }
            );
        }

        const result = await dietPlansCollection.deleteOne({
            _id: objectId,
            userId: loggedInUser.$id
        });

        console.log("Delete result:", result);

        if (result.deletedCount === 0) {
            return NextResponse.json(
                { error: "Failed to delete diet plan" },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Diet plan deleted successfully",
        });

    } catch (error) {
        console.error("❌ Error deleting diet plan:", error);
        return NextResponse.json(
            { error: "Failed to delete diet plan" },
            { status: 500 }
        );
    }
}