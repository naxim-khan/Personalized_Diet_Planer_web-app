import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/appwrite";
import { getLoggedInUser } from "@/lib/actions/users.action";

export async function GET() {
    try {
        // Step 1: Get the logged-in user
        const loggedInUser = await getLoggedInUser();
        if (!loggedInUser) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Step 2: Get user ID
        const userId = loggedInUser.$id; // Assuming Appwrite returns the user's ID as $id

        // Step 3: Fetch user details from Appwrite database
        const { databases } = await createAdminClient();
        const userDocument = await databases.getDocument(
            process.env.APPWRITE_DATABASE_ID!,
            process.env.APPWRITE_USER_COLLECTION_ID!,
            userId // Fetch user data by ID
        );

        if (!userDocument) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Step 4: Return user details
        return NextResponse.json({
            success: true,
            user: userDocument, // User data from the database
        });

    } catch (error) {
        console.error("Error fetching user details:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
