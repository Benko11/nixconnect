"use client";

import { useQuery } from "@tanstack/react-query";
import { createContext, ReactNode, useCallback, useContext } from "react";

interface UserObject {
  id: string;
  nickname: string;
  email: string;
  avatar_url: string | null;
  gender: {
    id: number;
    name: string;
    description: string;
  };
  pronouns: string[];
}

interface UserContextType {
  user: UserObject | null;
  refetchUser: () => void;
}

async function fetchAuthUser() {
  return await fetch("/api/auth/user").then((res) => res.json());
}

const UserContext = createContext<UserContextType | null>(null);
export function UserProvider({ children }: { children: ReactNode }) {
  const { data, isPending, refetch } = useQuery({
    queryKey: ["users", "auth"],
    queryFn: fetchAuthUser,
  });

  const refetchUser = useCallback(() => {
    refetch();
  }, [refetch]);

  if (isPending) return null;
  const success = data?.message == null;

  const user: UserObject = {
    id: data.id,
    nickname: data.nickname,
    email: data.email,
    avatar_url: data.avatar_url,
    gender: data.gender,
    pronouns: data.pronouns,
  };

  return (
    <UserContext.Provider value={{ user: success ? user : null, refetchUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useAuthUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useAuthUser must be used within a UserProvider");
  }
  return context;
}
