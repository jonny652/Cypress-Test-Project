import { defineConfig } from "cypress";
import { exec } from "node:child_process";
import * as fs from "node:fs";
import * as path from "node:path";

interface ExecResult {
  stdout: string;
  stderr: string;
  exitCode: number;
}

// The file where we save the login token, so later test runs can skip logging in.
// It's in .gitignore because it contains a real, working login.
const AUTH_CACHE_PATH = path.join(__dirname, "cypress", ".auth", "session.json");

// Load EMAIL and PASSWORD from the .env file. Cypress won't read a .env file
// by itself, so we load it here and pass the values into the `env` block below.
// We point at the .env next to this file, so it works whichever folder Cypress starts from.
try {
  process.loadEnvFile(path.join(__dirname, ".env"));
} catch {
  // No .env file (e.g. on CI, where the values are set another way) - that's fine
}

export default defineConfig({
  projectId: "7jh9s1",
    defaultCommandTimeout: 10000,

  e2e: {
    baseUrl: "https://source.thenbs.com/en/gb",
    env: {
      EMAIL: process.env.EMAIL,
      PASSWORD: process.env.PASSWORD,
    },
    setupNodeEvents(on, config) {
      on("task", {
        /**
         * Runs a system command in Node and resolves with its output.
         * Replaces `cy.exec()`, which was removed in Cypress 16.
         * @see https://on.cypress.io/task
         */
        exec(command: string): Promise<ExecResult> {
          return new Promise((resolve) => {
            exec(command, (error, stdout, stderr) => {
              resolve({
                stdout,
                stderr,
                // ExecException.code is a number, but the inherited
                // ErrnoException widens it to `string | number`.
                exitCode: typeof error?.code === "number" ? error.code : error ? 1 : 0,
              });
            });
          });
        },

        /**
         * Reads the saved login token from the file.
         * Returns `null` if the file doesn't exist yet or can't be read.
         * (Tasks run in Node, which can access files - the browser can't.)
         */
        readAuthCache(): Record<string, string> | null {
          try {
            return JSON.parse(fs.readFileSync(AUTH_CACHE_PATH, "utf8"));
          } catch {
            return null;
          }
        },

        /**
         * Saves the login token to the file (creating the folder if needed),
         * so the next test run can reuse it.
         */
        writeAuthCache(data: Record<string, string>): null {
          fs.mkdirSync(path.dirname(AUTH_CACHE_PATH), { recursive: true });
          fs.writeFileSync(AUTH_CACHE_PATH, JSON.stringify(data));
          return null;
        },
      });

      return config;
    },
  },
});
