"use client";

import { useAuthUser } from "@/contexts/UserContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

async function logout() {
  const raw = await fetch("/api/auth/logout", { method: "POST" });
  return raw;
}
export default function UserNavigation() {
  const menuRef = useRef<HTMLDivElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const { user: authUser, refetchUser } = useAuthUser();

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
        <Link href="/login" className="p-1">
          Log in
        </Link>
        <Link href="/register" className="p-1">
          Sign up
        </Link>
      </div>
    );
  }

  const handleLogout = async () => {
    router.push("/login");
    await logout();
    setIsMenuOpen(false);
    refetchUser();
  };

  const handleGoToProfile = async () => {
    router.push("/profile");
    setIsMenuOpen(false);
  };

  if (authUser.nickname == null) {
    return (
      <div className="flex gap-2 ml-auto items-center">
        <Link href="#" onClick={handleLogout}>
          Log out
        </Link>
      </div>
    );
  }

  if (authUser == null) return;

  return (
    <div className="ml-auto relative select-none" ref={menuRef}>
      <div
        className="bg-default-secondary text-default-light p-1 cursor-pointer"
        onClick={() => setIsMenuOpen((prev) => !prev)}
      >
        ~{authUser.nickname}
      </div>

      {isMenuOpen && (
        <nav className="absolute right-0 top-10 select-none">
          <ul className="bg-default-dark text-default-light py-4">
            <li
              className="p-2 px-6 min-w-52 cursor-pointer hover:bg-default-secondary focus:bg-default-accent active:bg-default-accent"
              onClick={handleGoToProfile}
            >
              Profile
            </li>
            <li className="p-2 px-6 min-w-52 cursor-pointer hover:bg-default-secondary focus:bg-default-accent active:bg-default-accent">
              Settings
            </li>
            <li
              className="p-2 px-6 min-w-52 cursor-pointer hover:bg-default-secondary focus:bg-default-accent active:bg-default-accent"
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
