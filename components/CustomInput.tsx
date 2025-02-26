import React, { useState } from "react";
import { Button } from "./ui/button";
import { z } from 'zod';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "./ui/form";
import { Input } from "./ui/input";
import { Control, FieldError, FieldPath } from "react-hook-form";
import { authformSchema } from "../lib/utils";
import { LuEyeClosed } from "react-icons/lu";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { cn } from "../lib/utils";

const formSchema = authformSchema('sign-up');

interface CustomInput {
  control: Control<z.infer<typeof formSchema>>;
  name: FieldPath<z.infer<typeof formSchema>>;
  label: string;
  placeholder: string;
  type?: string;
  error?: FieldError;
  className?: string;
}

const CustomInput = ({ 
  control, 
  name, 
  label, 
  placeholder, 
  type = 'text',
  error,
  className 
}: CustomInput) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const handleNumberInput = (e: React.ChangeEvent<HTMLInputElement>, field: any) => {
    const value = e.target.value;
    if (type === 'number') {
      const numValue = parseFloat(value);
      field.onChange(isNaN(numValue) ? '' : numValue);
    } else {
      field.onChange(value);
    }
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("space-y-1 w-full", className)}>
          <FormLabel className="text-sm font-medium text-gray-700">
            {label}
          </FormLabel>
          <FormControl>
            <div className="relative">
              <Input
                placeholder={placeholder}
                type={
                  name === 'password' 
                    ? (showPassword ? 'text' : 'password')
                    : type
                }
                className={cn(
                  "rounded-lg border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors",
                  error && "border-red-500 focus:border-red-500 focus:ring-red-500",
                  name === 'password' && "pr-10"
                )}
                {...field}
                onChange={(e) => handleNumberInput(e, field)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                min={type === 'number' ? 0 : undefined}
                step={type === 'number' ? (name === 'age' ? 1 : 0.1) : undefined}
              />
              {name === 'password' && (
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
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
          {error && (
            <p className="text-red-600 text-sm mt-1 animate-fade-in">
              {error.message}
            </p>
          )}
        </FormItem>
      )}
    />
  );
};

export default CustomInput;