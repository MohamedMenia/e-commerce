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
      state: "Loading",
    } as IUserSlice,
  },
  reducers: {
    setUser: (state, action: PayloadAction<IUserSlice>) => {
      state.user = action.payload;
      state.user.state = "fetched";
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
        state: "fetched",
      };
    },
  },
});
export const { setUser, resetUser } = userSlice.actions;

export default userSlice.reducer;
