"use client";
import { memo, useEffect } from "react";
import { useUser } from "@/hooks/useAuth";
import io from "socket.io-client";
import { useQueryClient } from "@tanstack/react-query";

const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL);

const FetchUser = () => {
  const data = useUser();
  const user = data?.data;
  const queryClient = useQueryClient();
  useEffect(() => {
    if (user && user._id) {
      console.log(`Joining room: ${user._id}`);
      // Join the user to their specific room
      socket.emit("joinRoom", user._id);

      // Handle user info updates
      socket.on("userInfoUpdated", () => {
        console.log("Received userInfoUpdated event");
        queryClient.invalidateQueries({ queryKey: ["user"] });
      });

      // Clean up the event listeners on component unmount
      return () => {
        socket.off("userInfoUpdated");
      };
    }
  }, [queryClient, user]);

  return null;
};

export default memo(FetchUser);
