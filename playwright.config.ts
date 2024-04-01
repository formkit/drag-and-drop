import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./playwright",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 3,
  timeout: 20000,
  reporter: "list",
  use: {
    baseURL: "http://127.0.0.1:5173",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "Desktop Chrome Drag Tests",
      testMatch: "tests/drag/**/*.spec.ts",
      use: {
        ...devices["Desktop Chrome"],
      },
    },
    {
      name: "Desktop Firefox Drag Tests",
      testMatch: "tests/drag/**/*.spec.ts",
      use: {
        ...devices["Desktop Firefox"],
      },
    },
    {
      name: "Mobile Chrome Touch Tests",
      testMatch: "tests/touch/**/*.spec.ts",
      use: {
        ...devices["Mobile Chrome"],
      },
    },
    {
      name: "Mobile Safari Touch Tests",
      testMatch: "tests/touch/**/*.spec.ts",
      use: {
        ...devices["Mobile Safari"],
      },
    },
    {
      name: "Mobile Firefox Touch Tests",
      testMatch: "tests/touch/**/*.spec.ts",
      use: {
        ...devices["Mobile Firefox"],
      },
    },
    {
      name: "Framework Tests",
      testMatch: "tests-frameworks/**/*.spec.ts",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
