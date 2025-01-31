import { NextResponse } from "next/server";
import fs from "fs/promises";
import { createClient } from "@/utils/supabase/server";
import path from "path";

export async function GET() {
  const supabase = await createClient();
  try {
    const migrationsDir = process.cwd() + "/migrations";
    const files = await fs.readdir(migrationsDir);
    const sqlFiles = files
      .filter((file) => file.endsWith(".sql"))
      .sort(function (a, b) {
        if (a < b) return -1;
        if (a > b) return 1;
        return 0;
      });

    console.log(sqlFiles);

    sqlFiles.forEach(async (file) => {
      const filePath = path.join(migrationsDir, file);
      const sql = await fs.readFile(filePath, "utf-8");

      const { data, error } = await supabase.rpc("execute_sql", { sql });

      if (error) {
        console.error(`Error executing migration ${file}:`, error);
        return NextResponse.json(
          { message: `Error executing migration ${file}` },
          { status: 500 }
        );
      }

      console.log(`Migration ${file} executed successfully`);
    });

    return NextResponse.json({ message: "Migrations executed succeessfully!" });
  } catch (error) {
    if (error instanceof Error) console.error(error.stack);
    return NextResponse.json(
      { message: "Error migrating..." },
      { status: 500 }
    );
  }
}
