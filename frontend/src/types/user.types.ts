export type IUser = {
  _id: string;
  username: string;
  email: string;
  img: string;
  imgPublicId: string;
  role: string;
  phone: string;
};
export interface IUserSlice extends IUser {
  isLoggedIn: boolean
  state: string
}



export type ILogin = {
  email: string;
  password: string;
};

export type IRegisterFormValues = {
  username?: string;
  email: string;
  password: string;
  phone?: string;
};

export interface IUserProfileUpdate {
  username?: string;
  email?: string;
  phone?: string;
  oldPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
} 
