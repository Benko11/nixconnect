"use server";

import bcrypt from "bcrypt";
import { sql } from "@vercel/postgres";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";

export async function createUserAccount(data: FormData) {
  const nickname = (data.get("nickname") as string) || "";
  const email = (data.get("email") as string) || "";
  const gender = (data.get("gender") as string) || "";
  const dataPassword = data.get("password");
  if (dataPassword == null) throw new Error("Password is empty");

  const hashedPassword = await bcrypt.hash(dataPassword.toString(), 15);

  const result =
    await sql`INSERT INTO USERS(nickname, email, password, gender_id) VALUES(${nickname}, ${email}, ${hashedPassword}, (SELECT id FROM genders WHERE name = ${gender})) RETURNING id;`;

  const values = [
    data.get("nickname"),
    data.get("email"),
    hashedPassword,
    data.get("gender"),
  ];

  try {
    // await client.query("BEGIN");

    // const result = await client.query(query, values);
    const insertedUserId = result.rows[0].id;

    const dataSelectedPronouns = data.get("selectedPronouns");
    if (dataSelectedPronouns == null) return;

    const selectedPronouns: string[] = dataSelectedPronouns
      .toString()
      .split(",");

    let queryPronouns = `INSERT INTO user_pronouns(user_id, pronoun_id) VALUES`;
    const pronounsItems: string[] = [];
    const pronounValues: string[] = [insertedUserId];

    selectedPronouns.forEach((selectedPronoun, index) => {
      pronounsItems.push(
        `($1, (SELECT id FROM pronouns WHERE word = $${index + 2}))`
      );
      pronounValues.push(selectedPronoun);
    });
    queryPronouns += pronounsItems.join(",");

    await client.query(queryPronouns, pronounValues);

    await client.query("COMMIT");
  } catch (err) {
    if (err instanceof Error) {
      console.error("Error occurred:", err.stack);
    } else {
      console.error("Something happened:", err);
    }

    await client.query("ROLLBACK");
  } finally {
    await client.end();
  }
}

export async function verifyCredentials(data: FormData) {
  const query = `SELECT password FROM users WHERE nickname = $1;`;
  const executed = await client.query(query, [data.get("nickname")]);
  if (executed.rows.length < 1) throw new Error("Kill yourself");

  const password = executed.rows[0].password;

  const x = await bcrypt.compare(
    data.get("password")?.toString() || "",
    password
  );

  if (!x) throw new Error("Kill yourself");
}

export async function authenticate(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid credentials";
        default:
          return "Something went wrong. Try again later.";
      }
    }
  }
}
