"use client";

import { Gender } from "@/types/Gender";
import { useQuery } from "@tanstack/react-query";
import { createContext, ReactNode, useCallback, useContext } from "react";

interface UserObject {
  id: string;
  nickname: string;
  email: string;
  avatarUrl: string | null;
  gender: Gender;
  pronouns: string[];
  preferences: {
    colourScheme: number;
  };
}

interface UserContextType {
  user: UserObject | null;
  refetchUser: () => Promise<UserObject>;
}

async function fetchAuthUser() {
  return await fetch("/api/auth/user")
    .then((res) => res.json())
    .catch((err) => console.error(err));
}

const UserContext = createContext<UserContextType | null>(null);
export function UserProvider({ children }: { children: ReactNode }) {
  const {
    data: userData,
    isPending: isUserLoading,
    refetch,
  } = useQuery({
    queryKey: ["users", "auth"],
    queryFn: fetchAuthUser,
  });

  const refetchUser = useCallback(async () => {
    const { data } = await refetch();
    return data;
  }, [refetch]);

  const success = userData?.message == null;
  const user = success ? mapUserData(userData) : null;
  if (isUserLoading) return null;

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

function mapUserData(userData: any): UserObject | null {
  if (!userData) return null;

  return {
    id: userData.id,
    nickname: userData.nickname,
    email: userData.email,
    avatarUrl: userData.avatar_url,
    gender: userData.gender,
    pronouns: userData.pronouns,
    preferences: userData.preferences,
  };
}
