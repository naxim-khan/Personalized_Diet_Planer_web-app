import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { z } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const authformSchema = (type: string) =>
  z.object({
    firstName: type === "sign-up" ? z.string().min(3) : z.string().optional(),
    lastName: type === "sign-up" ? z.string().min(3) : z.string().optional(),
    address1: type === "sign-up" ? z.string().max(50) : z.string().optional(),
    city: type === "sign-up" ? z.string().max(20) : z.string().optional(),
    state: type === "sign-up" ? z.string().length(2) : z.string().optional(),
    postalCode: type === "sign-up" ? z.string().min(3) : z.string().optional(),
    dob: type === "sign-up" ? z.string().min(3) : z.string().optional(),
    ssn: type === "sign-up" ? z.string().min(3) : z.string().optional(),

    // fields common to both sign-in and sign-up
    email: z.string().email(),
    password: z.string().min(8),
  });

  export const parseStringify = (value: any) => JSON.parse(JSON.stringify(value));
