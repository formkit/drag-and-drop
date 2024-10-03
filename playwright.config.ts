import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./playwright",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  timeout: 20000,
  reporter: "list",
  use: {
    baseURL: "http://127.0.0.1:5173",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "Desktop Chrome",
      testMatch: "tests/drag/**/*.spec.ts",
      use: {
        ...devices["Desktop Chrome"],
      },
    },
    {
      name: "Desktop Firefox",
      testMatch: "tests/drag/**/*.spec.ts",
      use: {
        ...devices["Desktop Firefox"],
      },
    },
    {
      name: "Desktop Webkit",
      testMatch: "tests/drag/**/*.spec.ts",
      use: {
        ...devices["Desktop Webkit"],
      },
    },
    {
      name: "iPhone 13 Chromium",
      testMatch: "tests/synthetic-drag/**/*.spec.ts",
      use: {
        ...devices["iPhone 13"],
        browserName: "chromium",
      },
    },
  ],
});
