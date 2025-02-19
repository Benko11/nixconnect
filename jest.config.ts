import { pathsToModuleNameMapper } from "ts-jest";
import { compilerOptions } from "./tsconfig.json";

export default {
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest", // Transform TypeScript using ts-jest
    "^.+\\.js$": "babel-jest", // Transform JavaScript using babel-jest
  },
  moduleFileExtensions: ["ts", "tsx", "js", "json", "node"],
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.(ts|tsx|js)$",
  transformIgnorePatterns: ["<rootDir>/node_modules/"],

  // Resolve TypeScript path aliases
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: "<rootDir>/",
  }),
};
