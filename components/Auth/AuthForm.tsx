'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "../../components/ui/button"
import {
    Form,
} from "../../components/ui/form"
import CustomInput from '../../components/CustomInput'
import { authformSchema } from "../../lib/utils"
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { SignUpParams } from '../../types/index'
import { signIn, signUp } from '../../lib/actions/users.action'
import CustomSelect from '../../components/CustomSelect'

const AuthForm = ({ type }: { type: string }) => {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const formSchema = authformSchema(type);

    // 1. Define your form.
    // Replace your current useForm initialization with:
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: '',
            ...(type === 'sign-up' ? {
                firstName: '',
                lastName: '',
                age: undefined,  // Changed from 0
                weight: undefined, // Changed from 0
                height: undefined, // Changed from 0
                gender: undefined, // Changed from ''
                dietaryRestrictions: undefined,
                healthIssues: '',
                fitnessGoal: undefined,
                activityLevel: undefined,
                lifestyle: undefined,
                country: '',
                region: '',
                mealType: undefined,
                preferredCuisine: undefined,
                cookingStyle: undefined
            } : {})
        },
    })

    // 2. Define a submit handler.
    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        setIsLoading(true);
        try {
            if (type === 'sign-up') {
                const response = await signUp(data as SignUpParams);

                if (response?.error) {
                    form.setError('root', {
                        type: 'manual',
                        message: response.error
                    });
                    return;
                }

                if (response?.user) {
                    setUser(response.user);
                    router.push('/dashboard');
                }
            }

            if (type === 'sign-in') {
                const response = await signIn({
                    email: data.email,
                    password: data.password,
                });

                if (response?.error) {
                    form.setError('root', {
                        type: 'manual',
                        message: response.error
                    });
                    return;
                }

                if (response) router.push('/dashboard');
            }
        } catch (error: any) {
            form.setError('root', {
                type: 'manual',
                message: error.message || 'An unexpected error occurred'
            });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <section className='auth-form'>
            <header className='flex flex-col gap-5 md:gap-8'>
                <Link
                    href={"/"}
                    className='cursor-pointer items-center gap-0 flex px-4'
                >
                    <Image
                        src={"/img/LOGO.png"}
                        width={50}
                        height={50}
                        alt='MyDiet Logo'
                    />
                    <h1 className='text-26 font-ibm-plex-serif font-bold text-black-1'>MyDiet</h1>
                </Link>

                <div className="flex flex-col gap-1 md:gap-3">
                    <h1 className='text-24 lg:text-36 font-semibold text-gray-900'>
                        {
                            user ? 'Link Account' : type === 'sign-in' ? 'Sign In' : 'Sign Up'
                        }
                    </h1>
                    <p className='text-16 font-normal text-gray-600'>
                        {
                            user ? 'Link your account to get started' :
                                'Please Enter Your Details'
                        }
                    </p>
                </div>
            </header>
            {user ? (
                <div className='flex flex-col gap-4'>
                    {/* Paid Link */}
                </div>
            ) : (
                <>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            {type === 'sign-up' && (
                                <>
                                    {/* Existing personal info fields */}
                                    <div className="flex gap-4">
                                        <CustomInput
                                            control={form.control}
                                            name="firstName"
                                            label="First Name"
                                            placeholder="FirstName"
                                            type="string"
                                        />
                                        <CustomInput
                                            control={form.control}
                                            name="lastName"
                                            label="Weight (kg)"
                                            placeholder="LastName"
                                            type="string"
                                        />
                                    </div>
                                    {/* New diet/fitness fields */}
                                    <div className="flex gap-4">
                                        <CustomInput
                                            control={form.control}
                                            name="age"
                                            label="Age"
                                            placeholder="Enter your age"
                                            type="number"
                                        />
                                        <CustomInput
                                            control={form.control}
                                            name="weight"
                                            label="Weight (kg)"
                                            placeholder="Enter your weight"
                                            type="number"
                                        />
                                        <CustomInput
                                            control={form.control}
                                            name="height"
                                            label="Height (cm)"
                                            placeholder="Enter your height"
                                            type="number"
                                        />
                                    </div>

                                    <CustomSelect
                                        control={form.control}
                                        name="gender"
                                        label="Gender"
                                        placeholder="Select gender"
                                        options={[
                                            { value: "Male", label: "Male" },
                                            { value: "Female", label: "Female" },
                                            { value: "Other", label: "Other" }
                                        ]}
                                    />

                                    <CustomSelect
                                        control={form.control}
                                        name="dietaryRestrictions"
                                        label="Dietary Restrictions"
                                        placeholder="Select restrictions"
                                        options={[
                                            { value: "None", label: "None" },
                                            { value: "Vegetarian", label: "Vegetarian" },
                                            { value: "Vegan", label: "Vegan" },
                                            { value: "Gluten-Free", label: "Gluten-Free" },
                                            { value: "Dairy-Free", label: "Dairy-Free" },
                                            { value: "Other", label: "Other" }
                                        ]}
                                    />

                                    <CustomInput
                                        control={form.control}
                                        name="healthIssues"
                                        label="Health Issues"
                                        placeholder="Comma-separated health issues"
                                    />

                                    <CustomSelect
                                        control={form.control}
                                        name="fitnessGoal"
                                        label="Fitness Goal"
                                        placeholder="Select fitness goal"
                                        options={[
                                            { value: "Muscle Gain", label: "Muscle Gain" },
                                            { value: "Weight Loss", label: "Weight Loss" },
                                            { value: "Maintenance", label: "Maintenance" },
                                            { value: "Other", label: "Other" }
                                        ]}
                                    />

                                    <CustomSelect
                                        control={form.control}
                                        name="activityLevel"
                                        label="Activity Level"
                                        placeholder="Select activity level"
                                        options={[
                                            { value: "Little to No Exercise", label: "Little to No Exercise" },
                                            { value: "Light Exercise", label: "Light Exercise" },
                                            { value: "Moderate Exercise", label: "Moderate Exercise" },
                                            { value: "Heavy Exercise", label: "Heavy Exercise" }
                                        ]}
                                    />

                                    <CustomSelect
                                        control={form.control}
                                        name="lifestyle"
                                        label="Lifestyle"
                                        placeholder="Select lifestyle"
                                        options={[
                                            { value: "Non-smoker", label: "Non-smoker" },
                                            { value: "Smoker", label: "Smoker" },
                                            { value: "Occasional Smoker", label: "Occasional Smoker" },
                                            { value: "Other", label: "Other" }
                                        ]}
                                    />

                                    <CustomInput
                                        control={form.control}
                                        name="country"
                                        label="Country"
                                        placeholder="Enter your country"
                                    />

                                    <CustomInput
                                        control={form.control}
                                        name="region"
                                        label="Region"
                                        placeholder="Enter your region"
                                    />

                                    <CustomSelect
                                        control={form.control}
                                        name="mealType"
                                        label="Meal Type"
                                        placeholder="Select meal type"
                                        options={[
                                            { value: "Balanced", label: "Balanced" },
                                            { value: "High Protein", label: "High Protein" },
                                            { value: "Low Carb", label: "Low Carb" },
                                            { value: "Other", label: "Other" }
                                        ]}
                                    />

                                    <CustomSelect
                                        control={form.control}
                                        name="preferredCuisine"
                                        label="Preferred Cuisine"
                                        placeholder="Select cuisine"
                                        options={[
                                            { value: "Pakistani", label: "Pakistani" },
                                            { value: "Italian", label: "Italian" },
                                            { value: "Mexican", label: "Mexican" },
                                            { value: "Other", label: "Other" }
                                        ]}
                                    />

                                    <CustomSelect
                                        control={form.control}
                                        name="cookingStyle"
                                        label="Cooking Style"
                                        placeholder="Select cooking style"
                                        options={[
                                            { value: "Home-Cooked", label: "Home-Cooked" },
                                            { value: "Restaurant", label: "Restaurant" },
                                            { value: "Takeout", label: "Takeout" },
                                            { value: "Other", label: "Other" }
                                        ]}
                                    />
                                </>
                            )}
                            <CustomInput
                                control={form.control}
                                name='email'
                                label='Email'
                                placeholder="Enter your email"
                            />
                            <CustomInput
                                control={form.control}
                                name='password'
                                label='Password'
                                placeholder="Enter your password"
                            />
                            <div className='flex flex-col gap-4'>
                                <Button type="submit" disabled={isLoading} className='form-btn'>
                                    {isLoading ? (
                                        <>
                                            <Loader2 size={20} className='animate-spin' /> &nbsp; Loading...
                                        </>
                                    ) : type === 'sign-in' ? 'Sign In' : 'Sign Up'}
                                </Button>
                            </div>
                        </form>
                    </Form>

                    <div className='flex justify-center gap-1'>
                        <p className='text-14 font-normal text-gray-600'>
                            {type === 'sign-in' ? "Don't have an account?" : "Already have an Account?"}
                        </p>
                        <Link className='underline text-green-700' href={type === 'sign-in' ? '/sign-up' : '/sign-in'}>
                            {type === 'sign-in' ? 'Sign Up' : 'Sign In'}
                        </Link>
                    </div>
                </>
            )}
        </section>
    )
}

export default AuthForm