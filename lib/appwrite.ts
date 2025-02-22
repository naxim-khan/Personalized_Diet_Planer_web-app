// src/lib/server/appwrite.js
"use server";
import { Client, Account } from "node-appwrite";
import { cookies } from "next/headers";
import { Databases, Users } from "node-appwrite";


export async function createSessionClient() {
    const client = new Client()
        .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
        .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);

    const cookieStore = await cookies(); // ✅ Await cookies() before calling .get()
    const sessionCookie = cookieStore.get("appwrite-session");

    if (!sessionCookie || !sessionCookie.value) {
        throw new Error("No session");
    }

    client.setSession(sessionCookie.value);

    return {
        get account() {
            return new Account(client);
        },
    };
}

export async function createAdminClient() {
    const client = new Client()
        .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
        .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!)
        .setKey(process.env.NEXT_APPWRITE_KEY!);

    return {
        get account() {
            return new Account(client);
        },
        get databases() {
            return new Databases(client);
        },
        get user() {
            return new Users(client);
        }
    };
}
