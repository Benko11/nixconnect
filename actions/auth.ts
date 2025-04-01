import { ConfirmDataClient } from "@/types/ConfirmDataClient";
import LoginClient from "@/types/LoginClient";
import RegisterClient from "@/types/RegisterClient";
import { createClient } from "@/utils/supabase/server";
import { z } from "zod";
import { getAllPronouns } from "./pronouns";

export async function signIn({ nickname, password }: LoginClient) {
  const supabase = await createClient();
  const { data: user } = await supabase
    .from("users")
    .select("email")
    .eq("nickname", nickname)
    .maybeSingle();
  if (user == null) {
    throw new Error("This set of credentials does not match our records");
  }

  const { error } = await supabase.auth.signInWithPassword({
    email: user.email,
    password,
  });

  if (error) {
    const message = error.message.includes("confirm")
      ? "Please check your inbox to verify your email"
      : "This set of credentials does not match our records";
    throw new Error(message);
  }
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
}

export async function signUp({
  nickname,
  password,
  passwordAgain,
  email,
  pronouns,
  gender,
}: RegisterClient) {
  const formSchema = z
    .object({
      nickname: z.string().min(2, {
        message:
          "Please use more than one character in your nickname, singular characters are characters, not names",
      }),
      password: z
        .string()
        .min(8, { message: "Password must be at least 8  characters" }),
      passwordAgain: z.string(),
      email: z.string().email({ message: "Please use valid email address" }),
      pronouns: z.array(z.string()).min(1, {
        message:
          "We need to refer to you! Please select at least one of your pronouns",
      }),
    })
    .refine((data) => data.password === data.passwordAgain, {
      message: "Passwords do not match",
      path: ["password_again"],
    });

  const result = formSchema.safeParse({
    nickname,
    password,
    passwordAgain,
    email,
    gender,
    pronouns,
  });
  if (!result.success) {
    const errors = result.error.format();
    return { errors };
  }

  const supabase = await createClient();
  const { data: userExists } = await supabase
    .from("users")
    .select("*")
    .ilike("nickname", nickname.toLowerCase())
    .maybeSingle();

  if (userExists != null)
    throw new Error(
      "User with selected nickname already exists, please try something else"
    ).message;

  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { first_name: nickname, last_name: "" } },
  });
  if (signUpError) throw new Error(signUpError.message).message;

  const userId = signUpData.user!.id;

  const { error: userError } = await supabase
    .from("users")
    .insert({ id: userId, nickname, email, gender_id: gender });
  if (userError) throw new Error(userError.message);

  const pronounsRaw = await getAllPronouns();

  const pronounIds = pronouns.flatMap((word) =>
    pronounsRaw.flatMap((group) =>
      group.filter((pronoun) => pronoun.word === word).flatMap((w) => w.id)
    )
  );

  pronounIds.forEach(async (p) => {
    await supabase
      .from("user_pronouns")
      .insert({ user_id: userId, pronoun_id: p });
  });
}

export async function confirmInformation({
  nickname,
  pronouns,
  gender,
}: ConfirmDataClient) {
  const formSchema = z.object({
    nickname: z.string().min(2, {
      message:
        "Please use more than one character in your nickname, singular characters are characters, not names",
    }),
    pronouns: z.array(z.string()).min(1, {
      message:
        "We need to refer to you! Please select at least one of your pronouns",
    }),
  });

  const result = formSchema.safeParse({ nickname, pronouns, gender });
  if (!result.success) {
    const errors = result.error.format();
    return { errors };
  }

  const supabase = await createClient();
  const auth = await supabase.auth.getUser();
  const user = auth.data.user;
  if (user == null) return null;

  const email = user.email;
  const id = user.id;
  if (email == null || id == null) return null;

  const { error } = await supabase.from("users").insert({
    id,
    email,
    nickname,
    gender,
  });

  if (error) throw new Error(error.message);

  const pronounsRaw = await getAllPronouns();

  const pronounIds = pronouns.flatMap((word) =>
    pronounsRaw.flatMap((group) =>
      group.filter((pronoun) => pronoun.word === word).flatMap((w) => w.id)
    )
  );

  pronounIds.forEach(async (p) => {
    await supabase.from("user_pronouns").insert({ user_id: id, pronoun_id: p });
  });
}
