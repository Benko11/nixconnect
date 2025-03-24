"use client";

import ColourScheme from "@/types/ColourScheme";
import { useQuery } from "@tanstack/react-query";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
} from "react";

interface UserObject {
  id: string;
  nickname: string;
  email: string;
  avatarUrl: string | null;
  gender: {
    id: number;
    name: string;
    description: string;
  };
  pronouns: string[];
  preferences: {
    colourScheme: number;
  };
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
  const {
    data: userData,
    isPending: isUserLoading,
    refetch,
  } = useQuery({
    queryKey: ["users", "auth"],
    queryFn: fetchAuthUser,
  });

  const refetchUser = useCallback(async () => {
    await refetch();
  }, [refetch]);

  const success = userData?.message == null;
  const user = success ? mapUserData(userData) : null;

  const { data: colourSchemeData, isPending } = useQuery({
    queryKey: ["colour-scheme", "id"],
    queryFn: () => fetchColourScheme(userData.preferences.colourScheme),
    enabled: !!user?.preferences?.colourScheme,
  });

  useEffect(() => {
    if (colourSchemeData) {
      applyColours(colourSchemeData);
    }
  }, [colourSchemeData]);

  if (isUserLoading || isPending) return null;

  return (
    <UserContext.Provider value={{ user: success ? user : null, refetchUser }}>
      {children}
    </UserContext.Provider>
  );
}

function applyColours(colourSchemeData: {
  primary_colour: string;
  secondary_colour: string;
  accent_colour: string;
  error_colour: string;
  neutral_colour: string;
  light_colour: string;
  dark_colour: string;
}) {
  if (colourSchemeData == null) return;

  document.documentElement.style.setProperty(
    "--primary-colour",
    colourSchemeData.primary_colour
  );

  document.documentElement.style.setProperty(
    "--secondary-colour",
    colourSchemeData.secondary_colour
  );

  document.documentElement.style.setProperty(
    "--accent-colour",
    colourSchemeData.accent_colour
  );

  document.documentElement.style.setProperty(
    "--error-colour",
    colourSchemeData.error_colour
  );

  document.documentElement.style.setProperty(
    "--neutral-colour",
    colourSchemeData.neutral_colour
  );

  document.documentElement.style.setProperty(
    "--light-colour",
    colourSchemeData.light_colour
  );

  document.documentElement.style.setProperty(
    "--dark-colour",
    colourSchemeData.dark_colour
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

export async function fetchColourScheme(id: number) {
  return await fetch(`/api/colour-schemes/${id}`).then((res) => res.json());
}
