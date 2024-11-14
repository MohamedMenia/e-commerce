"use client";
import { useEffect, useState } from "react";
import MainInfo from "./_components/mainInfo/MainInfo";
import ChangePassword from "./_components/changePassword/ChangePassword";
import TabList from "./_components/TapList";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useRouter } from "next/navigation";

const ProfilePage = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("main");
  const { user } = useSelector((state: RootState) => state.user);

  const tabs = [
    { id: "main", label: "Main Info" },
    { id: "password", label: "Change Password" },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "main":
        return <MainInfo />;
      case "password":
        return <ChangePassword />;
      default:
        return null;
    }
  };
  useEffect(() => {
    if (user?.state !== "Loading" && !user?.isLoggedIn) {
      router.push(`/auth?mode=login`);
    }
  }, [user, router]);

  if (user?.state === "Loading") {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto mt-10 p-4 text-primaryFont">
      <div className="flex gap-8">
        <TabList
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          tabs={tabs}
        />
        <div className="w-3/4 rounded-lg bg-cardBg p-4">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
