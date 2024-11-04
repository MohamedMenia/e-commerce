"use client";
import { useState } from "react";
import Logo from "./Logo";
import SearchBar from "./SearchBar";
import Links from "./Links";
import { FaBars, FaTimes } from "react-icons/fa";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-navbar-gradient text-primaryFont shadow-lg">
      <div className="container mx-auto flex items-center justify-between p-4">
        <Logo />
        <div className="hidden flex-grow items-center justify-center md:flex">
          <SearchBar />
        </div>
        <div className="hidden items-center space-x-4 md:flex">
          <Links />
        </div>
        <button
          className="text-primaryFont hover:text-accentFont md:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <FaTimes size="1.5em" /> : <FaBars size="1.5em" />}
        </button>
      </div>
      {isOpen && (
        <div className="bg-secondaryBg p-4 text-primaryFont md:hidden">
          <div className="space-y-4">
            <Links />
          </div>
        </div>
      )}
      <div className="mt-2 flex justify-center md:hidden">
        <SearchBar />
      </div>
    </nav>
  );
}
