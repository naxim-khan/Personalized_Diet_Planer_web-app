// actions.ts
"use server";

import { createSessionClient } from "../appwrite";
import { createAdminClient } from "../appwrite";
import { ID } from "node-appwrite";
import { cookies } from "next/headers";
import { parseStringify } from "../utils";

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
        const { account } = await createAdminClient();
        const { email, password, firstName, lastName } = userData;

        const newUserAccount = await account.create(
            ID.unique(),
            email,
            password,
            `${firstName} ${lastName}`
        );

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

        return parseStringify({ success: true, user: newUserAccount });
    } catch (error) {
        console.error("Error in signUp:", error);
        return parseStringify({
            error: error instanceof Error ? error.message : "Sign-up failed",
            success: false
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