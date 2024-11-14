import React from "react";
import { Controller, Control, FieldValues, FieldErrors } from "react-hook-form";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

interface PhoneInputFieldProps {
  name: string;
  control: Control<FieldValues>;
  rules?: object;
  errors: FieldErrors;
  defaultCountry?: string;
}

const PhoneInputField = ({
  name,
  control,
  rules,
  errors,
  defaultCountry = "eg",
}: PhoneInputFieldProps) => {
  return (
    <div>
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field }) => (
          <PhoneInput
            {...field}
            country={defaultCountry}
            containerClass="w-full rounded border border-thinBorder bg-inputBg"
            buttonClass="border-none"
            inputClass="bg-inputBg w-full p-2 rounded focus:ring-2 focus:ring-accentFont"
            dropdownClass="bg-cardBg text-primaryFont"
          />
        )}
      />
      {errors[name] && (
        <span className="text-sm text-red-500">
          {errors[name].message as string}
        </span>
      )}
    </div>
  );
};

export default PhoneInputField;
