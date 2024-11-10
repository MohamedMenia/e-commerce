"use client";
import { useState } from "react";
import { useSelector } from "react-redux";
import Link from "next/link";
import {
  FaUserCircle,
  FaShoppingCart,
  FaBell,
  FaSignInAlt,
} from "react-icons/fa";
import { RootState } from "@/redux/store";
import { useAuth } from "@/hooks/useAuth";

export default function Links() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useSelector((state: RootState) => state.user);
  const isLoggedIn = user.isLoggedIn;

  const { logoutHandler } = useAuth();
  const handleLogout = () => {
    logoutHandler();
    setIsOpen(false);
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
              <span className="ml-2 group-hover:inline md:inline">Account</span>
            </button>
            {isOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-md border-thinBorder bg-secondaryBg text-center shadow-lg md:left-0 md:right-auto">
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
                  className="block w-full px-4 py-2 text-left text-primaryFont hover:bg-cardBg md:pl-10"
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
