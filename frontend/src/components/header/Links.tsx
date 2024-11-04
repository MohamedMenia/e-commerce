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

export default function Links() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useSelector((state: RootState) => state.user);
  const isLoggedIn = user.isLoggedIn;
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
              <div className="absolute right-0 mt-2 w-48 rounded-md border-thinBorder bg-secondaryBg shadow-lg">
                <Link
                  href="/profile"
                  className="block px-4 py-2 text-primaryFont hover:bg-cardBg"
                >
                  Profile
                </Link>
                <Link
                  href="/orders"
                  className="block px-4 py-2 text-primaryFont hover:bg-cardBg"
                >
                  Orders
                </Link>
                <button className="block px-4 py-2 text-primaryFont hover:bg-cardBg">
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
