import { NextResponse } from "next/server";
import { getDB, ObjectId } from "../../../lib/db";

const PROCESSING_TIMEOUT_MS = 1.5 * 60 * 1000; // 1 minute 30 seconds

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const jobId = searchParams.get("jobId");

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

    // Check for timeout if still processing
    if (job.status === 'processing' && job.createdAt) {
      const currentTime = new Date();
      const createdAt = job.createdAt instanceof Date ? 
        job.createdAt : 
        new Date(job.createdAt);
      
      const elapsedTime = currentTime.getTime() - createdAt.getTime();

      if (elapsedTime > PROCESSING_TIMEOUT_MS) {
        // Update status only if still processing
        const result = await db.collection("dietPlans").updateOne(
          { 
            _id: new ObjectId(jobId),
            status: 'processing' // Atomic update filter
          },
          { 
            $set: { 
              status: 'timed-out',
              updatedAt: new Date() 
            } 
          }
        );

        if (result.modifiedCount > 0) {
          return NextResponse.json({
            status: 'timed-out',
            dietPlan: null
          });
        }
      }
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