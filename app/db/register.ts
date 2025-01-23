"use server";

import bcrypt from "bcrypt";
import { db } from "@vercel/postgres";

const client = await db.connect();

interface RegisterUserRequest {
  nickname: string;
  email: string;
  password: string;
  password_again: string;
  gender: string;
  selectedPronouns: string;
}
export async function createUserAccount(data: any) {
  const query = `INSERT INTO USERS(nickname, email, password, gender_id) VALUES($1, $2, $3, (SELECT id FROM genders WHERE name = $4)) RETURNING id;`;

  const hashedPassword = await bcrypt.hash(data.get("password"), 15);
  const values = [
    data.get("nickname"),
    data.get("email"),
    hashedPassword,
    data.get("gender"),
  ];
  const insertedUserId = (await client.query(query, values)).rows[0].id;

  const selectedPronouns: string[] = data.get("selectedPronouns").split(",");

  let queryPronouns = `INSERT INTO user_pronouns(user_id,pronoun_id) VALUES`;
  const pronounsItems: string[] = [];
  const pronounValues: string[] = [insertedUserId];

  selectedPronouns.forEach((selectedPronoun, index) => {
    pronounsItems.push(
      `($1,(SELECT id FROM pronouns WHERE word = $${index + 2}))`
    );
    pronounValues.push(selectedPronoun);
  });
  queryPronouns += pronounsItems.join(",");

  console.log(pronounValues);
  console.log(queryPronouns);

  await client.query(queryPronouns, pronounValues);
}
