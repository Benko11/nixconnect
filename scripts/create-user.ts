import {
  gendersTable,
  pronounsTable,
  pronounUserTable,
  usersTable,
} from "@/db";
import { db } from "@/db/db";
import {
  confirm,
  intro,
  password,
  spinner,
  text,
  isCancel,
  cancel,
  select,
} from "@clack/prompts";
import * as bcrypt from "bcrypt";
import { inArray } from "drizzle-orm";
import { config } from "dotenv";

interface User {
  nickname: string;
  password: string;
  email: string;
  pronouns: string[];
  gender?: number;
  firstName?: string;
  lastName?: string;
}

config();
if (!process.env.ENCRYPTION_ROUNDS) {
  console.log(
    "⚠️ ENCRYPTION_ROUNDS not provided in environment, falling back to default value.",
  );
}

async function createUser(data: User) {
  return await db.transaction(async (tx) => {
    // 1. Create the user
    const hashedPassword = await bcrypt.hash(
      data.password,
      +process.env.ENCRYPTION_ROUNDS || 10,
    );

    const [newUser] = await tx
      .insert(usersTable)
      .values({
        nickname: data.nickname,
        email: data.email,
        password: hashedPassword,
        name: data.firstName,
        lastName: data.lastName,
        genderId: +data.gender,
      })
      .returning();

    // 2. Assign pronouns
    const matchedPronouns = await tx
      .select()
      .from(pronounsTable)
      .where(
        inArray(
          pronounsTable.word,
          data.pronouns.map((p: string) => p.trim().toLowerCase()),
        ),
      );

    await tx
      .insert(pronounUserTable)
      .values(
        matchedPronouns.map((p) => ({ userId: newUser.id, pronounId: p.id })),
      );
  });
}

async function run() {
  const data = await retrieveInput();

  const s = spinner();
  s.start("🕰 Creating user");
  await createUser(data);
  s.stop("✅ User created");
}

run();

function terminate(value: unknown) {
  if (isCancel(value)) {
    cancel();
    process.exit(1);
  }
}

async function retrieveInput() {
  const data = {} as Partial<User>;

  do {
    intro("Create administrator user");
    const nickname = await text({
      message: "Nickname:",
      defaultValue: "throwaway",
      placeholder: "throwaway",
    });

    terminate(nickname);

    const email = await text({
      message: "Email:",
      validate(value) {
        if (value.length === 0 || value.trim().length === 0)
          return "Email is required";
        if (!value.includes("@") || !value.includes("."))
          return "Please enter a valid email";
      },
    });

    terminate(email);

    const rawPronouns = await text({
      message: "Pronouns (divided by forward slash):",
      placeholder: "they/them",
      initialValue: "they/them",
      validate(value) {
        if (value.trim().length === 0) return "Pronouns are required";
        if (!value.includes("/"))
          return "Please enter at least two pronouns for the user";
      },
    });

    terminate(rawPronouns);
    const pronouns = rawPronouns.toString().split("/");

    const pass = await password({
      message: "Password:",
      validate(value) {
        if (value.trim().length === 0) return "Password is required";
      },
    });
    terminate(pass);

    const rawGenders = await db.select().from(gendersTable);
    const gender = await select({
      message: "Gender:",
      options: rawGenders.map((item) => ({ value: item.id, label: item.name })),
    });
    terminate(gender);

    const firstName = await text({
      message: "First name:",
    });
    terminate(firstName);

    const lastName = await text({ message: "Last name:" });
    terminate(lastName);

    data.nickname = nickname.toString();
    data.email = email.toString();
    data.pronouns = pronouns;
    data.gender = (gender as number) ?? 0;
    data.firstName = firstName?.toString() ?? "";
    data.lastName = lastName?.toString() ?? "";
    data.password = pass.toString();

    const summary = `
  Nickname:   ${data.nickname}
  Pronouns:   ${data.pronouns}
  Gender:     ${data.gender}
  Email:      ${data.email}
  First name: ${data.firstName}
  Last name:  ${data.lastName}
  Password:   ${data.password}
  `;

    const confirmation = await confirm({
      message: `Are you satisfied with the following data?\n${summary}\n\n`,
    });
    if (confirmation) break;
  } while (1);

  return data as User;
}
