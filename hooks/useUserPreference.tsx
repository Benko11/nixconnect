"use client";

import { useQuery } from "@tanstack/react-query";

async function fetchUserPref(userId: string, identifier: string) {
  return await fetch(`/api/preferences/user/${identifier}/${userId}`).then(
    (res) => res.json()
  );
}

export default function useUserPreference(userId: string, identifier: string) {
  const { data, error } = useQuery({
    queryKey: ["preferences", "user", identifier, userId],
    queryFn: () => fetchUserPref(userId, identifier),
    enabled: !!userId && userId !== "undefined",
  });
  if (error) return {};

  return data;
}
