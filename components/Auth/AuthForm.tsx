'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "../../components/ui/button"
import { Form } from "../../components/ui/form"
import CustomInput from '../../components/CustomInput'
import { authformSchema } from "../../lib/utils"
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { SignUpParams } from '../../types/index'
import { signIn, signUp } from '../../lib/actions/users.action'
import CustomSelect from '../../components/CustomSelect'
import { Progress } from "../../components/ui/progress"

import {
    GENDER_OPTIONS,
    DIETARY_RESTRICTIONS,
    ACTIVITY_LEVEL,
    FITNESS_GOALS,
    LIFESTYLE_OPTIONS,
    MEAL_TYPE,
    PREFERRED_CUISINE,
    COOKING_STYLE
} from '../../constants'

const AuthForm = ({ type }: { type: string }) => {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const [progress, setProgress] = useState(20);
    const steps = type === 'sign-up' ? 5 : 1;

    const formSchema = authformSchema(type);

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

    const handleNext = async () => {
        const fields = stepFields[currentStep - 1];
        const isValid = await form.trigger(fields as any);

        if (isValid) {
            const newStep = Math.min(currentStep + 1, steps);
            setCurrentStep(newStep);
            setProgress((newStep / steps) * 100);
        }
    };

    const handlePrev = () => {
        const newStep = Math.max(currentStep - 1, 1);
        setCurrentStep(newStep);
        setProgress(((newStep - 1) / steps) * 100);
    };

    const stepFields = [
        ['firstName', 'lastName', 'email', 'password'],
        ['age', 'weight', 'height', 'gender'],
        ['dietaryRestrictions', 'healthIssues', 'fitnessGoal', 'activityLevel'],
        ['lifestyle', 'country', 'region'],
        ['mealType', 'preferredCuisine', 'cookingStyle']
    ];

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        setIsLoading(true);
        try {
            if (type === 'sign-up') {
                const response = await signUp(data as SignUpParams);
                if (response?.error) {
                    form.setError('root', { type: 'manual', message: response.error });
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
                    form.setError('root', { type: 'manual', message: response.error });
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
        <section className='max-w-4xl mx-auto h-screen w-full flex items-center justify-center'>
            <div className='bg-white rounded-2xl shadow-lg p-6  sm:p-8  md:p-12  max-w-2xl w-full '>
                <header className='text-center mb-2'>
                    <div className='flex justify-center mb-6'>
                        <Link href="/" >
                            <Image
                                src={"/img/LOGO.png"}
                                width={60}
                                height={60}
                                alt='MyDiet Logo'
                                className='rounded-lg'
                                priority
                            />
                        </Link>
                    </div>

                    {type === 'sign-up' && (
                        <div className='mb-8'>
                            <Progress value={progress} className="h-2 bg-gray-200" />
                            <div className='flex justify-between mt-4 text-sm text-gray-600'>
                                {[...Array(steps)].map((_, i) => (
                                    <div
                                        key={i}
                                        className={`w-8 h-8 rounded-full flex items-center justify-center 
                                            ${currentStep > i + 1 ? 'bg-green-500 text-white' :
                                                currentStep === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                                    >
                                        {i + 1}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <h1 className='text-xl sm:text-3xl font-bold text-gray-900 mb-2'>
                        {type === 'sign-in' ? 'Welcome Back' : 'Create Your Account'}
                    </h1>
                    <p className='text-gray-600 text-sm sm:text-lg'>
                        {type === 'sign-in'
                            ? 'Sign in to continue to your account'
                            : 'Get started with your personalized nutrition plan'}
                    </p>
                </header>

                {form.formState.errors.root && (
                    <div className='mb-6 p-4 bg-red-50 rounded-lg text-red-700'>
                        {form.formState.errors.root.message}
                    </div>
                )}

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        {type === 'sign-up' ? (
                            <>
                                {/* Step 1: Personal Info */}
                                {currentStep === 1 && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <CustomInput
                                            control={form.control}
                                            name="firstName"
                                            label="First Name"
                                            placeholder="John"
                                            error={form.formState.errors.firstName}
                                        />
                                        <CustomInput
                                            control={form.control}
                                            name="lastName"
                                            label="Last Name"
                                            placeholder="Doe"
                                            error={form.formState.errors.lastName}
                                        />
                                        <CustomInput
                                            control={form.control}
                                            name="email"
                                            label="Email"
                                            placeholder="john@example.com"
                                            type="email"
                                            error={form.formState.errors.email}
                                        />
                                        <CustomInput
                                            control={form.control}
                                            name="password"
                                            label="Password"
                                            placeholder="••••••••"
                                            type="password"
                                            error={form.formState.errors.password}
                                        />
                                    </div>
                                )}

                                {/* Step 2: Physical Stats */}
                                {currentStep === 2 && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <CustomInput
                                            control={form.control}
                                            name="age"
                                            label="Age"
                                            placeholder="25"
                                            type="number"
                                            error={form.formState.errors.age}
                                        />
                                        <CustomInput
                                            control={form.control}
                                            name="weight"
                                            label="Weight (kg)"
                                            placeholder="70"
                                            type="number"
                                            error={form.formState.errors.weight}
                                        />
                                        <CustomInput
                                            control={form.control}
                                            name="height"
                                            label="Height (cm)"
                                            placeholder="175"
                                            type="number"
                                            error={form.formState.errors.height}
                                        />
                                        <CustomSelect
                                            control={form.control}
                                            name="gender"
                                            label="Gender"
                                            options={GENDER_OPTIONS}
                                            placeholder="Select gender"
                                            error={form.formState.errors.gender}
                                        />
                                    </div>
                                )}

                                {/* Step 3: Health & Fitness */}
                                {currentStep === 3 && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <CustomInput
                                            control={form.control}
                                            name="healthIssues"
                                            label="Health Issues"
                                            placeholder="Comma separated values (e.g., GERD, Gastritis) or None"
                                            error={form.formState.errors.healthIssues}
                                        />
                                        <CustomSelect
                                            control={form.control}
                                            name="dietaryRestrictions"
                                            label="Dietary Restrictions"
                                            options={DIETARY_RESTRICTIONS}
                                            placeholder="Select restrictions"
                                            error={form.formState.errors.dietaryRestrictions}
                                        />
                                        <CustomSelect
                                            control={form.control}
                                            name="fitnessGoal"
                                            label="Fitness Goal"
                                            options={FITNESS_GOALS}
                                            placeholder="Select goal"
                                            error={form.formState.errors.fitnessGoal}
                                        />
                                        <CustomSelect
                                            control={form.control}
                                            name="activityLevel"
                                            label="Activity Level"
                                            options={ACTIVITY_LEVEL}
                                            placeholder="Select activity level"
                                            error={form.formState.errors.activityLevel}
                                        />
                                    </div>
                                )}

                                {/* Step 4: Lifestyle & Location */}
                                {currentStep === 4 && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <CustomSelect
                                            control={form.control}
                                            name="lifestyle"
                                            label="Lifestyle"
                                            options={LIFESTYLE_OPTIONS}
                                            placeholder="Select lifestyle"
                                            error={form.formState.errors.lifestyle}
                                        />
                                        <CustomInput
                                            control={form.control}
                                            name="country"
                                            label="Country"
                                            placeholder="Enter your country"
                                            error={form.formState.errors.country}
                                        />
                                        <CustomInput
                                            control={form.control}
                                            name="region"
                                            label="Region"
                                            placeholder="Enter your region"
                                            error={form.formState.errors.region}
                                        />
                                    </div>
                                )}

                                {/* Step 5: Food Preferences */}
                                {currentStep === 5 && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <CustomSelect
                                            control={form.control}
                                            name="mealType"
                                            label="Preferred Meal Type"
                                            options={MEAL_TYPE}
                                            placeholder="Select meal type"
                                            error={form.formState.errors.mealType}
                                        />
                                        <CustomSelect
                                            control={form.control}
                                            name="preferredCuisine"
                                            label="Preferred Cuisine"
                                            options={PREFERRED_CUISINE}
                                            placeholder="Select cuisine"
                                            error={form.formState.errors.preferredCuisine}
                                        />
                                        <CustomSelect
                                            control={form.control}
                                            name="cookingStyle"
                                            label="Cooking Style"
                                            options={COOKING_STYLE}
                                            placeholder="Select cooking style"
                                            error={form.formState.errors.cookingStyle}
                                        />
                                    </div>
                                )}

                                <div className="flex justify-between mt-8">
                                    {currentStep > 1 && (
                                        <Button
                                            type="button"
                                            onClick={handlePrev}
                                            variant="outline"
                                            className="px-6"
                                        >
                                            Previous
                                        </Button>
                                    )}

                                    {currentStep < steps ? (
                                        <Button
                                            type="button"
                                            onClick={handleNext}
                                            className="ml-auto px-8"
                                        >
                                            Next
                                        </Button>
                                    ) : (
                                        <Button
                                            type="submit"
                                            disabled={isLoading}
                                            className="px-8 bg-green-600 hover:bg-green-700 ml-auto"
                                        >
                                            {isLoading ? (
                                                <Loader2 className="animate-spin h-5 w-5" />
                                            ) : 'Complete Registration'}
                                        </Button>
                                    )}
                                </div>
                            </>
                        ) : (
                            /* Sign-in Form */
                            <div className="space-y-6">
                                <CustomInput
                                    control={form.control}
                                    name="email"
                                    label="Email"
                                    placeholder="john@example.com"
                                    type="email"
                                    error={form.formState.errors.email}
                                />
                                <CustomInput
                                    control={form.control}
                                    name="password"
                                    label="Password"
                                    placeholder="••••••••"
                                    type="password"
                                    error={form.formState.errors.password}
                                />
                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-green-600 hover:bg-green-700 text-white "
                                >
                                    {isLoading ? (
                                        <Loader2 className="animate-spin h-5 w-5" />
                                    ) : 'Sign In'}
                                </Button>
                            </div>
                        )}

                        <div className='text-center mt-6 text-sm text-gray-600'>
                            {type === 'sign-in'
                                ? "Don't have an account? "
                                : "Already have an account? "}
                            <Link
                                href={type === 'sign-in' ? '/sign-up' : '/sign-in'}
                                className="text-blue-600 hover:underline"
                            >
                                {type === 'sign-in' ? 'Create account' : 'Sign in'}
                            </Link>
                        </div>
                    </form>
                </Form>
            </div>
        </section>
    )
}

export default AuthForm