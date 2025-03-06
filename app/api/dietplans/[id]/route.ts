import { NextResponse } from "next/server";
import { getLoggedInUser } from "../../../../lib/actions/users.action";
import { getDietPlansCollection, ObjectId } from "../../../../lib/db";

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;
        const { dayIndex, nutrition } = await request.json();
        const user = await getLoggedInUser();
        const collection = await getDietPlansCollection();
        const objectId = new ObjectId(id);

        const updateResult = await collection.updateOne(
            {
                _id: objectId,
                userId: user.$id
            },
            {
                $set: {
                    [`daily_plan.${dayIndex}.nutrition`]: nutrition
                }
            }
        );

        if (updateResult.modifiedCount === 0) {
            return NextResponse.json(
                { error: "Failed to update nutrition data" },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("❌ Error updating nutrition data:", error);
        return NextResponse.json(
            { error: "Failed to update nutrition data" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        // Await the params to ensure it's resolved
        const { id } = await params;

        const user = await getLoggedInUser();
        const collection = await getDietPlansCollection();
        const objectId = new ObjectId(id);

        const existingPlan = await collection.findOne({
            _id: objectId,
            userId: user.$id, 
        });

        if (!existingPlan) {
            return NextResponse.json({ error: "Diet plan not found" }, { status: 404 });
        }

        const result = await collection.deleteOne({
            _id: objectId,
            userId: user.$id, 
        });

        if (result.deletedCount === 0) {
            return NextResponse.json({ error: "Failed to delete diet plan" }, { status: 500 });
        }

        return NextResponse.json({ success: true, message: "Diet plan deleted" });

    } catch (error) {
        console.error("❌ Error deleting diet plan:", error);
        return NextResponse.json({ error: "Failed to delete diet plan" }, { status: 500 });
    }
}