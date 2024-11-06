"use client";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import FormInput from "./_component/FormInput";
import { CredentialResponse } from "@react-oauth/google";
import GoogleLoginButton from "./_component/GoogleLoginButton";
import { createUser, googleLogin, login } from "@/axios/userAPIS";
import { toast } from "react-toastify";
import { IErrorResponse } from "@/types/genral.types";
import handleErrors from "@/utils/handleErrors";
import { AxiosError } from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type FormValues = {
  username?: string;
  email: string;
  password: string;
  phone?: string;
};

export default function AuthForm() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");
  const isLogin = mode ? mode === "login" : true;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setError,
    reset,
  } = useForm<FormValues>();

  const toggleMode = () => {
    reset();
    const newMode = isLogin ? "signup" : "login";
    router.push(`/auth?mode=${newMode}`);
  };
  const { mutate: loginHandler } = useMutation({
    mutationFn: async (data: FormValues) => {
      return login({ email: data.email, password: data.password });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (error) => {
      console.error("Login failed:", error);
    },
  });
  const onSubmit: SubmitHandler<FormValues> = async (data: FormValues) => {
    try {
      const res = isLogin
        ? loginHandler(data)
        : await createUser({
            username: data.username ?? "",
            email: data.email,
            password: data.password,
            phone: data.phone ?? "",
          });

      if (res.success) {
        toast.success(isLogin ? "Login successful!" : "Signup successful!");

        if (isLogin) {
          queryClient.invalidateQueries({ queryKey: ["user"] });
          router.push("/");
        } else {
          toggleMode();
        }
      } else {
        toast.error(res.error.message);
      }
    } catch (err: AxiosError | unknown) {
      if (err instanceof AxiosError && err.response) {
        const error = err.response.data as IErrorResponse;
        handleErrors(error, setError);
      }
    }
  };

  const responseGoogle = async (response: CredentialResponse) => {
    try {
      const res = await googleLogin(response.credential as string);
      if (res.success) {
        toast.success("Google login successful!");
        queryClient.invalidateQueries({ queryKey: ["user"] });
        router.push("/");
      } else {
        toast.error(res.error.message);
      }
    } catch (err) {
      const error = err as IErrorResponse;
      handleErrors(error, setError);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-mainBg p-4 text-primaryFont">
      <div className="w-full max-w-md space-y-6 rounded-lg bg-cardBg p-8 shadow-lg">
        <h2 className="text-center text-3xl font-bold">
          {isLogin ? "Login" : "Sign Up"}
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {!isLogin && (
            <>
              <FormInput
                label="Username"
                id="username"
                type="text"
                register={register("username", {
                  required: "Username is required",
                })}
                error={errors.username?.message}
              />
              <div>
                <label htmlFor="phone" className="block text-sm font-medium">
                  Phone Number
                </label>
                <Controller
                  name="phone"
                  control={control}
                  rules={{ required: "Phone number is required" }}
                  render={({ field }) => (
                    <PhoneInput
                      {...field}
                      country={"eg"}
                      containerClass="w-full rounded border border-thinBorder bg-inputBg"
                      buttonClass="border-none"
                      inputClass="bg-inputBg w-full p-2 rounded focus:ring-2 focus:ring-accentFont"
                      dropdownClass="bg-cardBg text-primaryFont"
                    />
                  )}
                />
                {errors.phone && (
                  <span className="text-sm text-red-500">
                    {errors.phone.message}
                  </span>
                )}
              </div>
            </>
          )}
          <FormInput
            label="Email"
            id="email"
            type="email"
            register={register("email", { required: "Email is required" })}
            error={errors.email?.message}
          />
          <FormInput
            label="Password"
            id="password"
            type="password"
            register={register("password", {
              required: "Password is required",
            })}
            error={errors.password?.message}
          />
          <button
            type="submit"
            className="w-full rounded bg-buttonBg p-2 font-bold text-buttonText transition-colors hover:bg-accentBorder"
          >
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>
        {isLogin && <GoogleLoginButton onSuccess={responseGoogle} />}

        <div className="text-center">
          <button
            className="text-accentFont hover:text-accentBorder"
            onClick={toggleMode}
          >
            {isLogin
              ? "Need an account? Sign Up"
              : "Already have an account? Login"}
          </button>
        </div>
      </div>
    </div>
  );
}
