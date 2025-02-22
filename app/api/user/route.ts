import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/appwrite";
import { getLoggedInUser } from "@/lib/actions/users.action";
import { Query } from "node-appwrite"; // Import Query for filtering

export async function GET() {
    try {
        // Step 1: Get the logged-in user
        const loggedInUser = await getLoggedInUser();
        if (!loggedInUser) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Step 2: Get logged-in user ID
        const userId = loggedInUser.$id;
        if (!userId) {
            return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
        }

        // Step 3: Ensure environment variables are set
        const databaseId = process.env.APPWRITE_DATABASE_ID;
        const collectionId = process.env.APPWRITE_USER_COLLECTION_ID;

        if (!databaseId || !collectionId) {
            return NextResponse.json({ error: "Missing database or collection ID" }, { status: 500 });
        }

        // Step 4: Initialize Appwrite client
        const { databases } = await createAdminClient();

        // Step 5: Query the database to find the document where `userId` matches logged-in user ID
        let userDocument;
        try {
            const response = await databases.listDocuments(databaseId, collectionId, [
                Query.equal("userId", userId), // Filter by userId field
            ]);

            if (response.documents.length === 0) {
                return NextResponse.json({ error: "User document not found" }, { status: 404 });
            }

            userDocument = response.documents[0]; // Get the first matching document
        } catch (error) {
            console.error("Error fetching user details:", error);
            return NextResponse.json({ error: "Error fetching user document" }, { status: 500 });
        }

        // Step 6: Return user details
        return NextResponse.json({ success: true, user: userDocument });

    } catch (error) {
        console.error("Server error:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
