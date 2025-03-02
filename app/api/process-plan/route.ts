import { NextResponse } from "next/server";
import { getDietPlansCollection, ObjectId } from "../../../lib/db";
import { generateDietPlan } from "../../../lib/actions/dietplan.action";

export async function POST(req: Request) {
  let jobId: string = "";
  try {
    const { userId, jobId: jobIdFromReq, options, workerSecret } = await req.json();
    jobId = jobIdFromReq;

    if (workerSecret !== process.env.WORKER_SECRET) {
      return new Response("Unauthorized", { status: 401 });
    }

    const collection = await getDietPlansCollection();

    // Atomic status update
    const updateResult = await collection.updateOne(
      { 
        _id: new ObjectId(jobId),
        status: "pending" // Only update if still pending
      },
      { 
        $set: { 
          status: "processing",
          updatedAt: new Date() 
        }
      }
    );

    if (updateResult.modifiedCount === 0) {
      return NextResponse.json(
        { error: "Job already processed or not found" },
        { status: 409 }
      );
    }

    // Generate diet plan with timeout
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 55000); // 55s timeout
    
    const plan = await generateDietPlan(options);
    clearTimeout(timeout);

    // Update with plan data
    await collection.updateOne(
      { _id: new ObjectId(jobId) },
      { 
        $set: {
          ...plan,
          status: "completed",
          updatedAt: new Date()
        }
      }
    );

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Processing error:", error);
    
    if (jobId) {
      try {
        const collection = await getDietPlansCollection();
        await collection.updateOne(
          { _id: new ObjectId(jobId) },
          { 
            $set: { 
              status: "failed",
              updatedAt: new Date(),
              error: error instanceof Error ? error.message : "Unknown error"
            }
          }
        );
      } catch (e) {
        console.error("Failed to mark job as failed:", e);
      }
    }

    return NextResponse.json(
      { error: "Processing failed" },
      { status: 500 }
    );
  }
}