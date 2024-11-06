"use client";
import { useQuery } from "@tanstack/react-query";
import { getUser } from "@/axios/userAPIS";

const useUser = () => {
  return useQuery({
    retry: false,
    queryKey: ["user"],
    queryFn: getUser,
    refetchOnWindowFocus: false,
  });
};
export default useUser;
