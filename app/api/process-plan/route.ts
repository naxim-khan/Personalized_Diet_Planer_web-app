import { NextResponse } from "next/server";
import { getDietPlansCollection, ObjectId } from "../../../lib/db";
import { generateDietPlan } from "../../../lib/actions/dietplan.action";

export async function POST(req: Request) {
    let jobId: string = "";
    try {
        const { userId, jobId: jobIdFromReq, options, workerSecret } = await req.json();
        jobId = jobIdFromReq;

        // Validate worker secret
        if (workerSecret !== process.env.WORKER_SECRET) {
            console.error("⚠️ Authorization failed");
            return new Response("Unauthorized", { status: 401 });
        }

        const collection = await getDietPlansCollection();

        // Check if job already processed
        const existingJob = await collection.findOne({
            _id: new ObjectId(jobId),
            status: { $in: ["completed", "processing"] }
        });

        if (existingJob) {
            console.log("Job already processed:", jobId);
            return NextResponse.json(
                { error: "Job already being processed" },
                { status: 409 }
            );
        }

        // Update to processing
        await collection.updateOne(
            { _id: new ObjectId(jobId) },
            { $set: { 
                status: "processing",
                updatedAt: new Date() 
            }}
        );

        // Generate diet plan
        const plan = await generateDietPlan(options);
        
        // Update with full plan data AT THE ROOT LEVEL
        await collection.updateOne(
            { _id: new ObjectId(jobId) },
            { $set: {
                ...plan, // Spread the plan data directly
                status: "completed",
                updatedAt: new Date()
            }}
        );

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("Processing error:", error);
        
        try {
            const collection = await getDietPlansCollection();
            await collection.updateOne(
                { _id: new ObjectId(jobId) },
                { $set: { 
                    status: "failed",
                    updatedAt: new Date() 
                }}
            );
        } catch (e) {
            console.error("Failed to mark job as failed:", e);
        }

        return NextResponse.json(
            { error: "Processing failed" },
            { status: 500 }
        );
    }
}