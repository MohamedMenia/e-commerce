import { RootState } from "@/redux/store";
import React, { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useAuth } from "@/hooks/useAuth";

interface PasswordCriteria {
  lowerCase: boolean;
  upperCase: boolean;
  digit: boolean;
  specialChar: boolean;
  minLength: boolean;
}

export default function ChangePassword() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ mode: "all" });
  const [criteria, setCriteria] = useState<PasswordCriteria>({
    lowerCase: false,
    upperCase: false,
    digit: false,
    specialChar: false,
    minLength: false,
  });
  const { user } = useSelector((state: RootState) => state.user);
  const { updateProfile } = useAuth();

  const validatePassword = (password: string) => {
    setCriteria({
      lowerCase: /(?=.*[a-z])/.test(password),
      upperCase: /(?=.*[A-Z])/.test(password),
      digit: /(?=.*\d)/.test(password),
      specialChar: /(?=.*[\W_])/.test(password),
      minLength: /.{8,}/.test(password),
    });
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(password);
  };

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    updateProfile({
      data: {
        oldPassword: data.oldPassword as string,
        newPassword: data.newPassword as string,
        confirmPassword: data.confirmPassword as string,
      },
      id: user._id,
    });
  };

  const newPassword = watch("newPassword", "");

  return (
    <div className="mt-4">
      <h3 className="text-xl font-bold text-primaryFont">Change Password</h3>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
        <div className="mb-4 flex flex-col">
          <label className="mb-1 block text-sm font-medium text-primaryFont">
            Old Password
          </label>
          <input
            type="password"
            {...register("oldPassword", {
              required: "Old password is required",
            })}
            className="main-input max-w-52"
          />
          {errors.oldPassword && (
            <span className="text-red-600">
              {String(errors.oldPassword.message)}
            </span>
          )}
        </div>

        <div className="mb-4 flex flex-col">
          <label className="mb-1 block text-sm font-medium text-primaryFont">
            New Password
          </label>
          <input
            type="password"
            {...register("newPassword", {
              required: "New password is required",
              validate: validatePassword,
            })}
            className="main-input max-w-52"
          />
          {errors.newPassword && (
            <span className="text-red-600">
              {String(errors.newPassword.message)}
            </span>
          )}
          <ul className="mt-2 text-primaryFont">
            <li
              className={criteria.lowerCase ? "text-green-500" : "text-red-500"}
            >
              {criteria.lowerCase ? "✓" : "✗"} At least one lowercase letter
            </li>
            <li
              className={criteria.upperCase ? "text-green-500" : "text-red-500"}
            >
              {criteria.upperCase ? "✓" : "✗"} At least one uppercase letter
            </li>
            <li className={criteria.digit ? "text-green-500" : "text-red-500"}>
              {criteria.digit ? "✓" : "✗"} At least one digit
            </li>
            <li
              className={
                criteria.specialChar ? "text-green-500" : "text-red-500"
              }
            >
              {criteria.specialChar ? "✓" : "✗"} At least one special character
            </li>
            <li
              className={criteria.minLength ? "text-green-500" : "text-red-500"}
            >
              {criteria.minLength ? "✓" : "✗"} Minimum 8 characters
            </li>
          </ul>
        </div>

        <div className="mb-4 flex flex-col">
          <label className="mb-1 block text-sm font-medium text-primaryFont">
            Re-enter New Password
          </label>
          <input
            type="password"
            {...register("confirmPassword", {
              required: "Please confirm your new password",
              validate: (value) =>
                value === newPassword || "Passwords do not match",
            })}
            className="main-input max-w-52"
          />
          {errors.confirmPassword && (
            <span className="text-red-600">
              {String(errors.confirmPassword.message)}
            </span>
          )}
        </div>

        <button
          type="submit"
          className="mt-2 rounded bg-buttonBg p-2 text-buttonText"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
