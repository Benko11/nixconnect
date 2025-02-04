import { createClient } from "@/utils/supabase/client";
import { z } from "zod";

export interface State {
  message?: string | null;
  errors: {
    nickname?: string[];
    email?: string[];
    password?: string[];
    passwordAgain?: string[];
    gender?: string[];
    pronouns?: string[];
  };
  formData: {
    nickname?: string;
    email?: string;
    gender?: string;
    pronouns?: string;
  };
}

export async function createAccount(prevState: State, formData: FormData) {
  const FormSchema = z
    .object({
      nickname: z.string().min(1, "Nickname is required"),
      email: z.string().email("Invalid email address"),
      password: z.string().min(1, "Password must be at least 8 characters"),
      passwordAgain: z.string(),
      pronouns: z
        .string()
        .min(1, "We need to refer to you! Please select your pronouns"),
    })
    .refine((data) => data.password === data.passwordAgain, {
      message: "Passwords do not match",
      path: ["passwordAgain"],
    });

  const rawData = {
    nickname: formData.get("nickname")?.toString(),
    email: formData.get("email")?.toString(),
    password: formData.get("password")?.toString(),
    passwordAgain: formData.get("password_again")?.toString(),
    gender: formData.get("gender")?.toString(),
    pronouns: formData.get("selectedPronouns")?.toString(),
  };

  const result = FormSchema.safeParse(rawData);
  if (!result.success) {
    return {
      message: "Something went wrong",
      errors: result.error.flatten().fieldErrors,
      formData: {
        nickname: rawData.nickname?.toString(),
        email: rawData.email?.toString(),
        gender: rawData.gender?.toString(),
      },
    };
  }

  const supabase = createClient();
  const { data } = await supabase.auth.signUp({
    email: result.data.email,
    password: result.data.password,
    options: {
      data: {
        first_name: result.data.nickname,
        last_name: "",
      },
    },
  });

  const id = data.user?.id;
  if (id == null) return;

  const pronouns = result.data.pronouns.split(",").map((n) => +n);
  pronouns.forEach(async (p) => {
    await supabase.from("user_pronouns").insert({ user_id: id, pronoun_id: p });
  });

  await supabase.from("users").insert({
    id,
    nickname: result.data.nickname,
    email: result.data.email,
    gender_id: rawData.gender?.toString(),
  });

  return {
    message:
      "Account created successfully. You will need to confirm your email, please check your inbox.",
    errors: {},
    formData: {},
  };
}
