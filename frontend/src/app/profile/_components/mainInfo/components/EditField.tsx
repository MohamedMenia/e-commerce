"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FaEdit, FaSave, FaTimes } from "react-icons/fa";
import { useAuth } from "@/hooks/useAuth";
import PhoneInputField from "@/components/PhoneInputField";

interface EditFieldProps {
  label: string;
  name: string;
  value: string;
  rules?: object;
  userId: string;
  isPhoneInput?: boolean;
}

const EditField = ({
  label,
  name,
  value,
  rules,
  userId,
  isPhoneInput = false,
}: EditFieldProps) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors },
  } = useForm({ defaultValues: { [name]: value } });
  const [isEditing, setIsEditing] = useState(false);
  const { updateProfile } = useAuth();

  useEffect(() => {
    setValue(name, value);
  }, [value, name, setValue]);

  const handleSave = (data: { [name: string]: string }) => {
    updateProfile({
      data: { [name]: data[name] },
      id: userId,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    reset({ [name]: value });
    setIsEditing(false);
  };

  return (
    <div className="mb-4">
      <div className="flex gap-4">
        <label className="block text-sm font-medium">{label}</label>
        {!isEditing && (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="text-blue-500 hover:text-blue-700"
          >
            <FaEdit />
          </button>
        )}
      </div>
      {isEditing ? (
        <form
          onSubmit={handleSubmit(handleSave)}
          className="flex items-center space-x-2  w-full max-w-60"
        >
          {isPhoneInput ? (
            <PhoneInputField
              name={name}
              control={control}
              rules={rules}
              errors={errors}
              defaultCountry="eg"
            />
          ) : (
            <input
              type="text"
              className="main-input"
              {...register(name, rules)}
            />
          )}
          <button type="submit" className="text-green-500 hover:text-green-700">
            <FaSave />
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="text-red-500 hover:text-red-700"
          >
            <FaTimes />
          </button>
          {errors[name] && (
            <span className="text-red-600">{errors[name]?.message}</span>
          )}
        </form>
      ) : (
        <div className="flex items-center space-x-2">
          <span>{value}</span>
        </div>
      )}
    </div>
  );
};

export default EditField;
