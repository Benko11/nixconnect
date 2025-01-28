import { db } from "@vercel/postgres";

const client = await db.connect();

export async function getAllPronouns() {
  const pronouns: string[][] = [];
  const data = await client.sql`SELECT 
    p1.id AS pronoun_id, 
    p1.word AS pronoun, 
    p2.word AS master_pronoun
FROM 
    pronouns p1
LEFT JOIN 
    pronouns p2 ON p1.master_pronoun = p2.id
ORDER BY 
    COALESCE(p1.master_pronoun, p1.id),
    p1.master_pronoun IS NOT NULL,
    p1.word;
`;

  let addingPronouns: string[] = [];
  data.rows.map((row) => {
    if (row.master_pronoun == null) {
      if (addingPronouns.length > 0) {
        pronouns.push(addingPronouns);
        addingPronouns = [];
      }
    }
    addingPronouns.push(row.pronoun);
  });
  pronouns.push(addingPronouns);

  return pronouns;
}
