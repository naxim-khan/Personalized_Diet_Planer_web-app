// app/api/check-plan/route.ts
import { NextResponse } from "next/server";
import { getLoggedInUser } from "../../../lib/actions/users.action";
import { getDietPlansCollection, ObjectId } from "../../../lib/db";

export async function GET() {
  try {
    const user = await getLoggedInUser();
    const collection = await getDietPlansCollection();

    // Check for existing completed plan
    const existingPlan = await collection.findOne(
      { userId: user.$id, status: "completed" },
      { sort: { createdAt: -1 } }
    );

    if (existingPlan) {
      return NextResponse.json({
        status: "exists",
        plan: existingPlan
      });
    }

    // Check for pending jobs
    const pendingJob = await collection.findOne({
      userId: user.$id,
      status: { $in: ["pending", "processing"] }
    });

    if (pendingJob) {
      return NextResponse.json({
        status: "pending",
        jobId: pendingJob._id.toString()
      });
    }

    // No plan or pending jobs
    return NextResponse.json({
      status: "not_found"
    });

  } catch (error) {
    console.error("Check plan error:", error);
    return NextResponse.json(
      { error: "Failed to check diet plan status" },
      { status: 500 }
    );
  }
}