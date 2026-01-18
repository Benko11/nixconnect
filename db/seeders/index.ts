import { seed as seedColourSchemes } from "./colour-schemes";
import { seed as seedPronouns } from "./pronouns";
import { seed as seedGenders } from "./genders";

async function run() {
  await seedColourSchemes();
  await seedPronouns();
  await seedGenders();
}

run();
