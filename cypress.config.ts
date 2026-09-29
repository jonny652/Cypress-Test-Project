import { defineConfig } from "cypress";
import { exec } from "node:child_process";
import * as fs from "node:fs";
import * as path from "node:path";

interface ExecResult {
  stdout: string;
  stderr: string;
  exitCode: number;
}

// On-disk cache of the OIDC session storage token, so `ensureLoggedIn()` can
// skip the UI sign-in flow on a fresh `cypress run` if a still-valid token
// was cached by an earlier run. Gitignored - contains live credentials.
const AUTH_CACHE_PATH = path.join(__dirname, "cypress", ".auth", "session.json");

// Cypress only auto-imports system env vars prefixed with `CYPRESS_`, so a
// plain `.env` file (EMAIL, PASSWORD, ...) is invisible to cy.env() unless
// we load it into process.env and forward it into the `env` block below.
try {
  process.loadEnvFile();
} catch {
  // No .env file present (e.g. CI providing real env vars directly) - ignore.
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
         * Returns the previously cached auth token blob, or `null` if none
         * has been saved yet (or it can't be parsed).
         */
        readAuthCache(): Record<string, string> | null {
          try {
            return JSON.parse(fs.readFileSync(AUTH_CACHE_PATH, "utf8"));
          } catch {
            return null;
          }
        },

        /**
         * Persists the auth token blob to disk for reuse by a future
         * `cypress run`/`cypress open` invocation.
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
