"use client";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import {
  FaUserCircle,
  FaShoppingCart,
  FaBell,
  FaSignInAlt,
} from "react-icons/fa";
import { RootState } from "@/redux/store";
import { logout } from "@/axios/userAPIS";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { resetUser } from "@/redux/userSlice";

export default function Links() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useSelector((state: RootState) => state.user);
  const isLoggedIn = user.isLoggedIn;
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  const { mutate } = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      dispatch(resetUser());
      queryClient.removeQueries({ queryKey: ["user"] });
    },
  });

  const handleLogout = () => {
    mutate();
    setIsOpen(false);
    queryClient.invalidateQueries({ queryKey: ["user"] });
    window.location.reload();
  };

  return (
    <>
      <Link
        href="/cart"
        className="group flex items-center text-primaryFont hover:text-accentFont"
      >
        <FaShoppingCart size="1.5em" />
        <span className="ml-2 group-hover:inline md:inline">Cart</span>
      </Link>
      <Link
        href="/notifications"
        className="group flex items-center text-primaryFont hover:text-accentFont"
      >
        <FaBell size="1.5em" />
        <span className="ml-2 group-hover:inline md:inline">Notifications</span>
      </Link>
      <div className="relative">
        {isLoggedIn ? (
          <>
            <button
              className="group flex items-center text-primaryFont hover:text-accentFont"
              onClick={() => setIsOpen(!isOpen)}
            >
              <FaUserCircle size="1.5em" />
              <span className="ml-2 group-hover:inline md:inline">Profile</span>
            </button>
            {isOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-md border-thinBorder bg-secondaryBg shadow-lg text-center md:left-0 md:right-auto">
                <Link
                  href="/profile"
                  className="block px-4 py-2 text-primaryFont hover:bg-cardBg md:pl-10"
                >
                  Profile
                </Link>
                <Link
                  href="/orders"
                  className="block px-4 py-2 text-primaryFont hover:bg-cardBg md:pl-10"
                >
                  Orders
                </Link>
                <button
                  className="block px-4 py-2 text-primaryFont hover:bg-cardBg w-full text-left md:pl-10"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            )}
          </>
        ) : (
          <Link
            href="/auth"
            className="group flex items-center text-primaryFont hover:text-accentFont"
          >
            <FaSignInAlt size="1.5em" />
            <span className="ml-2 group-hover:inline md:inline">Login</span>
          </Link>
        )}
      </div>
    </>
  );
}
