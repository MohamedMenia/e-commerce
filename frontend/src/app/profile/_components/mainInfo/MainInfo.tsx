import React from "react";
import EditImage from "./components/EditImage";
import EditField from "./components/EditField";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

export default function MainInfo() {
  const { user } = useSelector((state: RootState) => state.user);

  return (
    <>
      <EditImage imgUrl={user.img || "/profile.png"} userId={user._id} />
      <EditField
        label="Username"
        name="username"
        value={user.username}
        rules={{ required: "Username is required" }}
        userId={user._id}
      />
      <EditField
        label="Email"
        name="email"
        value={user.email}
        rules={{ required: "Email is required" }}
        userId={user._id}
      />
      <EditField
        label="Phone"
        name="phone"
        value={user.phone || ""}
        rules={{ required: "Phone number is required" }}
        userId={user._id}
        isPhoneInput={true}
      />
    </>
  );
}
