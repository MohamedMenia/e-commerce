"use client";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useState } from "react";
import EditField from "./_components/EditField";
import EditImage from "./_components/EditImage";

const ProfilePage = () => {
  const { user } = useSelector((state: RootState) => state.user);
  const [activeTab, setActiveTab] = useState("main");

  const renderMainInfo = () => (
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
      />
    </>
  );

  const renderChangePassword = () => (
    <div className="mt-4">
      <h3 className="text-xl font-bold text-primaryFont">Change Password</h3>
    </div>
  );

  return (
    <div className="container mx-auto mt-10 p-4 text-primaryFont">
      <div className="flex gap-8">
        <div className="w-1/4 rounded-lg bg-secondaryBg p-4">
          <h2 className="mb-4 text-2xl font-bold text-primaryFont">Profile</h2>
          <ul>
            <li>
              <button
                onClick={() => setActiveTab("main")}
                className={`block w-full rounded px-4 py-2 text-left ${
                  activeTab === "main"
                    ? "bg-highlightBg text-accentFont"
                    : "text-primaryFont"
                }`}
              >
                Main Info
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab("password")}
                className={`mt-2 block w-full rounded px-4 py-2 text-left ${
                  activeTab === "password"
                    ? "bg-highlightBg text-accentFont"
                    : "text-primaryFont"
                }`}
              >
                Change Password
              </button>
            </li>
          </ul>
        </div>
        <div className="w-3/4 rounded-lg bg-cardBg p-4">
          {activeTab === "main" ? renderMainInfo() : renderChangePassword()}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
