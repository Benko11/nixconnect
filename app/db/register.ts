"use server";

import bcrypt from "bcrypt";
import { db } from "@vercel/postgres";

const client = await db.connect();

export async function createUserAccount(data: FormData) {
  const query = `INSERT INTO USERS(nickname, email, password, gender_id) VALUES($1, $2, $3, (SELECT id FROM genders WHERE name = $4)) RETURNING id;`;

  const dataPassword = data.get("password");
  if (dataPassword == null) return;

  const hashedPassword = await bcrypt.hash(dataPassword.toString(), 15);
  const values = [
    data.get("nickname"),
    data.get("email"),
    hashedPassword,
    data.get("gender"),
  ];
  const insertedUserId = (await client.query(query, values)).rows[0].id;

  const dataSelectedPronouns = data.get("selectedPrononus");
  if (dataSelectedPronouns == null) return;

  const selectedPronouns: string[] = dataSelectedPronouns.toString().split(",");

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
