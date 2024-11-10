import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IUserSlice } from "../types/user.types";


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
      phone: "",
      isLoggedIn: false,
    } as IUserSlice,
  },
  reducers: {
    setUser: (state, action: PayloadAction<IUserSlice>) => {
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
        phone: "",
        isLoggedIn: false,
      };
    },
  },
});
export const { setUser, resetUser } = userSlice.actions;

export default userSlice.reducer;
