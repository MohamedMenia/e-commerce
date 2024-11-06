import { PayloadAction, createSlice } from "@reduxjs/toolkit";
interface IUser {
  _id: string;
  username: string;
  email: string;
  img: string;
  imgPublicId: string;
  googleId?: string;
  role: "user" | "admin";
  isLoggedIn: boolean;
}
export const userSlice = createSlice({
  name: "user",
  initialState: {
    user: {
      _id: "",
      username: "",
      email: "",
      img: "",
      imgPublicId: "",
      role: "user",
      isLoggedIn: false,
    } as IUser,
  },
  reducers: {
    setUser: (state, action: PayloadAction<IUser>) => {
      state.user = action.payload;
      state.user.isLoggedIn = true;
    },
    resetUser: (state) => {
      state.user = {
        _id: "",
        username: "",
        email: "",
        img: "",
        imgPublicId: "",
        role: "user",
        isLoggedIn: false,
      };
    },
  },
});
export const { setUser, resetUser } = userSlice.actions;

export default userSlice.reducer;
