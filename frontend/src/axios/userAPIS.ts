import axiosInstance from "./axiosInstance";
import { IUser, ILogin, IRegister } from "@/types/user.types";

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
export const createUser = async (data: IRegister) => {
  const response = await axiosInstance.post("/user", data);
  return response.data;
};
export const getUser = async () => {
  const response = await axiosInstance.get("/api/user/get-user");
  return response.data;
};

export const updateUser = async (data: IUser) => {
  const response = await axiosInstance.put("/api/user/update-user", data);
  return response.data;
};

export const deleteUser = async () => {
  const response = await axiosInstance.delete("/api/user/delete-user");
  return response.data;
};
export const logout = async () => {
  const response = await axiosInstance.get("/api/user/logout");
  return response.data;
};

