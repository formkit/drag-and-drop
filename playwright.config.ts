import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./playwright",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 6,
  timeout: 20000,
  reporter: "list",
  use: {
    baseURL: "http://127.0.0.1:5173",
    trace: "on-first-retry",
  },

  projects: [
    {
      name: "Tests",
      testMatch: "tests/**/*.spec.ts",
    },
    {
      name: "Framework Tests",
      testMatch: "tests-frameworks/**/*.spec.ts",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
