"use client";
import { memo } from "react";
import { useUser } from "@/hooks/useAuth";

const FetchUser = () => {
  useUser();
  return null;
};

export default memo(FetchUser);
