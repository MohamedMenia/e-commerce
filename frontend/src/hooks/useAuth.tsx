"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import {
  login,
  logout,
  createUser,
  googleLogin,
  updateUser,
} from "@/axios/userAPIS";
import { setUser, resetUser } from "@/redux/userSlice";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { IErrorResponse } from "@/types/genral.types";
import { IRegisterFormValues, IUserProfileUpdate } from "@/types/user.types";
import handleErrors from "@/utils/handleErrors";
import { FieldValues, UseFormSetError } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { getUser } from "@/axios/userAPIS";
import { useEffect } from "react";

export const useAuth = <T extends FieldValues>({
  setError = null,
}: {
  setError?: UseFormSetError<T> | null;
} = {}) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const router = useRouter();

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async (data: IRegisterFormValues) =>
      login({ email: data.email, password: data.password }),
    onSuccess: (data) => {
      dispatch(setUser({ ...data, isLoggedIn: true }));
      queryClient.invalidateQueries({ queryKey: ["user"] });
      toast.success("Login successful!");
      router.push("/");
    },
    onError: (err) => {
      if (err instanceof AxiosError && err.response) {
        const error = err.response.data as IErrorResponse;
        if (setError) handleErrors(error, setError);
      }
    },
  });
  // Google login mutation
  const googleLoginMutation = useMutation({
    mutationFn: async (credential: string) => googleLogin(credential),
    onSuccess: (data) => {
      if (data.success) {
        dispatch(setUser({ ...data, isLoggedIn: true }));
        // Set the user state in Redux
        queryClient.invalidateQueries({ queryKey: ["user"] });
        toast.success("Google login successful!");
        router.push("/");
      } else {
        toast.error(data.error.message);
      }
    },
    onError: (err) => {
      if (err instanceof AxiosError && err.response) {
        const error = err.response.data as IErrorResponse;
        if (setError) handleErrors(error, setError);
      }
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      dispatch(resetUser());
      queryClient.removeQueries({ queryKey: ["user"] });
      window.location.reload();
    },
    onError: (err) => {
      if (err instanceof AxiosError && err.response) {
        const error = err.response.data as IErrorResponse;
        if (setError) handleErrors(error, setError);
      }
    },
  });

  // Create user mutation
  const createUserMutation = useMutation({
    mutationFn: async (data: IRegisterFormValues) =>
      createUser({
        username: data.username ?? "",
        email: data.email,
        password: data.password,
        phone: data.phone ?? "",
      }),
    onSuccess: () => {
      toast.success("Signup successful!");
    },
    onError: (err) => {
      if (err instanceof AxiosError && err.response) {
        const error = err.response.data as IErrorResponse;
        if (setError) handleErrors(error, setError);
      }
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: ({
      data,
      id,
    }: {
      data: IUserProfileUpdate | FormData;
      id: string;
    }) => updateUser(data, id),
    onSuccess: () => {
      toast.success("Profile updated successfully");
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (error) => {
      toast.error("Failed to update profile");
      console.error("Error updating profile:", error);
    },
  });

  return {
    loginHandler: loginMutation.mutate,
    logoutHandler: logoutMutation.mutate,
    createUserHandler: createUserMutation.mutate,
    googleLoginHandler: googleLoginMutation.mutate,
    updateProfile: updateProfileMutation.mutate,
  };
};

export const useUser = () => {
  const dispatch = useDispatch();

  // Fetch user data
  const {
    data: fetchedUser,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["user"],
    queryFn: getUser,
    retry: false,
    refetchOnWindowFocus: false,
  });

  // Manage user state based on query results
  useEffect(() => {
    if (fetchedUser && !isLoading && !error) {
      dispatch(setUser({ ...fetchedUser.data, isLoggedIn: true }));
    } else if (error) {
      dispatch(resetUser());
    }
  }, [fetchedUser, isLoading, error, dispatch]);
  return fetchedUser;
};
