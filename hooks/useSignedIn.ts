import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";

export const useSignedIn = () => {
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const supabase = createClient();
      const { data } = await supabase.auth.getUser();
      setSignedIn(data.user != null);
    };

    checkUser();
  }, []);

  return signedIn;
};
