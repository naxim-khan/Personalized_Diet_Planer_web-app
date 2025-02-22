'use client'

import { Controller } from "react-hook-form"

type Option = {
  value: string;
  label: string;
};

const CustomSelect = ({ control, name, label, placeholder, options }: { control: any, name: string, label: string, placeholder: string, options: Option[] }) => {
  return (
    <div className='form-item'>
      <label className='form-label'>{label}</label>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <select {...field} className='form-input'>
            <option value="" disabled>{placeholder}</option>
            {options.map((option: Option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )}
      />
    </div>
  )
}

export default CustomSelect