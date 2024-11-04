export type IUser = {
  _id: string;
  username: string;
  email: string;
  img: string;
  imgPublicId: string;
  role: string;
};

export type IRegister = {
  username: string;
  email: string;
  password: string;
  phone: string;
};

export type ILogin = {
  email: string;
  password: string;
};
