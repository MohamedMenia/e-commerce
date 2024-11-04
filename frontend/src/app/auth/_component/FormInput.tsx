"use client";
import { FC, memo } from "react";
import { UseFormRegisterReturn } from "react-hook-form";

interface FormInputProps {
  label: string;
  id: string;
  type: string;
  register: UseFormRegisterReturn;
  error?: string;
}

const FormInput: FC<FormInputProps> = ({
  label,
  id,
  type,
  register,
  error,
}) => {
  return (
    <div className="mb-4">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-primaryFont"
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        className="w-full rounded border border-thinBorder bg-inputBg p-2 text-primaryFont focus:outline-none focus:ring-2 focus:ring-accentFont"
        {...register}
      />
      {error && <span className="mt-1 text-sm text-red-500">{error}</span>}
    </div>
  );
};

export default memo(FormInput);
