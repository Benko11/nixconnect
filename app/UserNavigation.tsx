"use client";

import { useAuthUser } from "@/contexts/UserContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import SearchIcon from "@/public/assets/icons/Search.png";
import Image from "next/image";
import { usePreference } from "@/contexts/PreferencesContext";

async function logout() {
  await fetch("/api/auth/logout", { method: "POST" });
}
export default function UserNavigation() {
  const menuRef = useRef<HTMLDivElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const { user: authUser, refetchUser } = useAuthUser();
  const { colourScheme } = usePreference();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  if (!authUser) {
    return (
      <div className="flex gap-2 ml-auto items-center">
        <Link href="/login" className="p-1 top-link">
          Log in
        </Link>
        <Link href="/register" className="p-1 top-link">
          Sign up
        </Link>
      </div>
    );
  }

  const handleLogout = async () => {
    await logout();
    setIsMenuOpen(false);
    colourScheme.apply(1);
    refetchUser();
    router.push("/login");
  };

  const handleGoToProfile = async () => {
    router.push("/profile");
    setIsMenuOpen(false);
  };

  const handleGoToSettings = async () => {
    router.push("/settings");
    setIsMenuOpen(false);
  };

  if (authUser.nickname == null) {
    return (
      <div className="flex gap-2 ml-auto items-center">
        <Link href="#" onClick={handleLogout} className="top-link">
          Log out
        </Link>
      </div>
    );
  }

  if (authUser == null) return;

  return (
    <div
      className="ml-auto relative select-none flex items-center"
      ref={menuRef}
    >
      <Link
        href="/search"
        className="opacity-90 hover:opacity-100 focus:opacity-100 text-neutral flex items-center p-1 top-link search-button"
      >
        <div className="bg-dark p-1">
          <Image src={SearchIcon} alt="Search" width={16} height={16} />
        </div>
        <div className="bg-light px-3">Search</div>
      </Link>
      <div
        className="bg-secondary text-light p-1 cursor-pointer top-link"
        onClick={() => setIsMenuOpen((prev) => !prev)}
      >
        ~{authUser.nickname}
      </div>

      {isMenuOpen && (
        <nav className="absolute right-0 top-10 select-none top-navigation">
          <ul className="bg-dark text-light py-4">
            <li
              className="p-2 px-6 min-w-52 cursor-pointer hover:bg-secondary focus:bg-accent active:bg-accent"
              onClick={handleGoToProfile}
            >
              Profile
            </li>
            <li
              className="p-2 px-6 min-w-52 cursor-pointer hover:bg-secondary focus:bg-accent active:bg-accent"
              onClick={handleGoToSettings}
            >
              Settings
            </li>
            <li
              className="p-2 px-6 min-w-52 cursor-pointer hover:bg-secondary focus:bg-accent active:bg-accent"
              onClick={handleLogout}
            >
              Log out
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
}
