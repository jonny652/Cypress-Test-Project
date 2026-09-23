import { defineConfig } from "cypress";
import { exec } from "node:child_process";

interface ExecResult {
  stdout: string;
  stderr: string;
  exitCode: number;
}

export default defineConfig({
  projectId: "7jh9s1",

  e2e: {
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
      });

      return config;
    },
  },
});
