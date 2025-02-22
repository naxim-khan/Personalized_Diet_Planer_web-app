import React, { useState } from "react";
import { Button } from "./ui/button";
import { z } from 'zod'
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { UseFormReturn, Control } from "react-hook-form";
import { FieldPath } from "react-hook-form";
import { authformSchema } from "../lib/utils"
import { LuEyeClosed } from "react-icons/lu";
import { MdOutlineRemoveRedEye } from "react-icons/md";

const formSchema = authformSchema('sign-up')

interface CustomInput {
    control: Control<z.infer<typeof formSchema>>,
    name: FieldPath<z.infer<typeof formSchema>>,
    label: string,
    placeholder: string,
    type?: string;
}

const CustomInput = ({ control, name, label, placeholder, type = 'text' }: CustomInput) => {
    const [showPassword, setShowPassword] = useState(false);

    // Handle number inputs specifically
    const handleNumberInput = (e: React.ChangeEvent<HTMLInputElement>, field: any) => {
        const value = e.target.value;
        if (type === 'number') {
            field.onChange(Number(value));
        } else {
            field.onChange(value);
        }
    };

    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <div className='form-item'>
                    <FormLabel className='form-label'>{label}</FormLabel>
                    <div className="flex w-full flex-col">
                        <FormControl>
                            <div className="relative w-full">
                                <Input
                                    placeholder={placeholder}
                                    type={
                                        name === 'password' 
                                            ? (showPassword ? 'text' : 'password')
                                            : type
                                    }
                                    className='input-class w-full pr-10'
                                    {...field}
                                    onChange={(e) => handleNumberInput(e, field)}
                                    // Add number input attributes if needed
                                    min={type === 'number' ? 0 : undefined}
                                    step={type === 'number' ? (name === 'age' ? 1 : 0.1) : undefined}
                                />
                                {name === 'password' && (
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                    >
                                        {showPassword ? (
                                            <MdOutlineRemoveRedEye className="h-5 w-5" />
                                        ) : (
                                            <LuEyeClosed className="h-5 w-5" />
                                        )}
                                    </button>
                                )}
                            </div>
                        </FormControl>
                        <FormMessage className='form-message mt-2' />
                    </div>
                </div>
            )}
        />
    );
};

export default CustomInput;