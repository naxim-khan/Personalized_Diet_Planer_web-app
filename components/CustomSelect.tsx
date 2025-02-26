'use client'

import { Controller } from "react-hook-form";
import { Control } from "react-hook-form";
import { FieldError } from "react-hook-form";

type Option = {
  value: string;
  label: string;
};

interface CustomSelectProps {
  control: Control<any>;
  name: string;
  label: string;
  placeholder: string;
  options: readonly Option[]; // Use readonly for immutability
  error?: FieldError; // Add error prop for validation
}

const CustomSelect = ({ control, name, label, placeholder, options, error }: CustomSelectProps) => {
  return (
    <div className="form-item space-y-2">
      <label className="form-label text-sm font-medium text-gray-700">
        {label}
      </label>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <div className="relative">
            <select
              {...field}
              className={`
                form-input w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500
                ${error ? "border-red-500 focus:ring-red-500" : "border-gray-300"}
              `}
            >
              <option value="" disabled>
                {placeholder}
              </option>
              {options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        )}
      />
      {error && (
        <p className="text-red-500 text-sm mt-1">
          {error.message}
        </p>
      )}
    </div>
  );
};

export default CustomSelect;