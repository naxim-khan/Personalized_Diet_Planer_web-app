import { NextResponse } from "next/server";
import { getDB, ObjectId } from "../../../lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const jobId = searchParams.get("jobId");

  // Validate jobId parameter
  if (!jobId || !ObjectId.isValid(jobId)) {
    return NextResponse.json(
      { error: "Invalid or missing job ID" },
      { status: 400 }
    );
  }

  try {
    const db = await getDB();
    const job = await db.collection("dietPlans").findOne({
      _id: new ObjectId(jobId)
    });

    if (!job) {
      return NextResponse.json(
        { error: "Job not found" }, 
        { status: 404 }
      );
    }

    return NextResponse.json({
      status: job.status,
      dietPlan: job.dietPlan || null
    });

  } catch (error) {
    console.error("Error fetching job status:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}