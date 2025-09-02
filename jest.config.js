export default {
  preset: "ts-jest/presets/default-esm",
  extensionsToTreatAsEsm: [".ts"],
  testEnvironment: "node",
  roots: ["<rootDir>/src", "<rootDir>/tests"],
  transform: {
    "^.+\\.[t|j]sx?$": "babel-jest",
  },

  testMatch: ["**/__tests__/**/*.(ts|js)", "**/*.(test|spec).(ts|js)"],

  testPathIgnorePatterns: ["/node_modules/", "/dist/", "/tests/mocks/"],

  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.d.ts",
    "!src/index.ts",
    "!src/deploy-commands.ts",
    "!src/config.ts",
  ],
};
