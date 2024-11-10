import axiosInstance from "./axiosInstance";
import { ILogin, IRegisterFormValues, IUserProfileUpdate } from "@/types/user.types";

export const googleLogin = async (token: string) => {
  const response = await axiosInstance.post("/user/google-login", {
    token,
  });
  return response.data;
};
export const login = async (data: ILogin) => {
  const response = await axiosInstance.post("/user/login", data);
  return response.data;
};
export const createUser = async (data: IRegisterFormValues) => {
  const response = await axiosInstance.post("/user", data);
  return response.data;
};
export const getUser = async () => {
  const response = await axiosInstance.get("/user");
  return response.data;
};

export const updateUser = async (data: IUserProfileUpdate| FormData, id : string) => {
  const response = await axiosInstance.patch(`/user/${id}`, data);
  return response.data;
};

export const deleteUser = async () => {
  const response = await axiosInstance.delete("/api/user/delete-user");
  return response.data;
};
export const logout = async () => {
  const response = await axiosInstance.post("/user/logout");
  return response.data;
};
