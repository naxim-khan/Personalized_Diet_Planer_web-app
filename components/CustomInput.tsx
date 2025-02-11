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
import { UseFormReturn } from "react-hook-form";
import { Form } from "react-hook-form";
import { Control } from "react-hook-form";
import { authformSchema } from "../lib/utils"
import { FieldPath } from "react-hook-form";

import { LuEyeClosed } from "react-icons/lu";
import { MdOutlineRemoveRedEye } from "react-icons/md";



interface CustomInput {
    control: Control<z.infer<typeof authformSchema>>,
    name: FieldPath<z.infer<typeof authformSchema>>,
    label: string,
    placeholder: string,
}

const CustomInput = ({ control, name, label, placeholder }: CustomInput) => {
    const [showPassword, setShowPassword] = useState(false);

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
                                    type={name === 'password' ? (showPassword ? 'text' : 'password') : 'text'}
                                    className='input-class w-full pr-10'
                                    {...field}
                                />
                                {name === 'password' && (
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                    >
                                        {showPassword ? (
                                            <MdOutlineRemoveRedEye />
                                        ) : (
                                            <LuEyeClosed />
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