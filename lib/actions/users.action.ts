// actions.ts
"use server";

import { createSessionClient } from "../appwrite";
import { createAdminClient } from "../appwrite";
import { Databases } from "node-appwrite";
import { ID } from "node-appwrite";
import { cookies } from "next/headers";
import { parseStringify } from "../utils";
import { SignUpParams } from "@/types";
import { signInProps } from "@/types";

export const signIn = async ({ email, password }: signInProps) => {
    try {
        const { account } = await createAdminClient();
        const session = await account.createEmailPasswordSession(email, password);

        // ✅ Fixed: Use cookies() directly with await
        (await cookies()).set({
            name: "appwrite-session",
            value: session.secret,
            path: "/",
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
        });

        return { success: true };
    } catch (error) {
        console.error("Error in signIn:", error);
        return {
            error: error instanceof Error ? error.message : "Sign-in failed",
            success: false
        };
    }
};

export const signUp = async (userData: SignUpParams) => {
    try {
        const { account, databases } = await createAdminClient();
        const {
            // Existing fields
            firstName,
            lastName,
            // New fields
            age,
            weight,
            height,
            gender,
            dietaryRestrictions,
            healthIssues,
            fitnessGoal,
            activityLevel,
            lifestyle,
            country,
            region,
            mealType,
            preferredCuisine,
            cookingStyle,
            email,
            password
        } = userData;

        // Create auth account
        const newUserAccount = await account.create(
            ID.unique(),
            email,
            password,
            `${firstName} ${lastName}`
        );

        // Create database document
        const userProfile = await databases.createDocument(
            process.env.APPWRITE_DATABASE_ID!,
            process.env.APPWRITE_USER_COLLECTION_ID!,
            ID.unique(),
            {
                userId: newUserAccount.$id,
                // All user profile fields
                firstName,
                lastName,
                email,
                age,
                weight,
                height,
                gender,
                dietaryRestrictions,
                healthIssues,
                fitnessGoal,
                activityLevel,
                lifestyle,
                country,
                region,
                mealType,
                preferredCuisine,
                cookingStyle
            }
        );

        return parseStringify({ success: true, user: userProfile });
    } catch (error) {
        console.error("Error:", error);
        const errorMessage = error instanceof Error ? error.message : "Sign-up failed";
        return parseStringify({ 
            success: false,
            error: errorMessage
        });
    }
};

export async function getLoggedInUser() {
    try {
        const { account } = await createSessionClient();
        return parseStringify(await account.get());
    } catch (error) {
        console.error("Error getting logged in user:", error);
        return null;
    }
};

export const logoutAccount = async () => {
    try {
        const { account } = await createSessionClient();

        (await cookies()).delete('appwrite-session');

        await account.deleteSession('current');
    } catch (error) {
        return null;
    }
}