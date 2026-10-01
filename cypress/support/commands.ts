// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

// Signs the user in by clicking through the real login pages.
Cypress.Commands.add("loginUser", () => {
  // Remember which page we're on, so we can check we land back here after logging in
  cy.url().as("currentUrl");

  // Click the "Sign in" button on the main site
  cy.contains("button", "Sign in", { timeout: 10000 }).click();

  // Get the email and password from the .env file
  cy.env(["EMAIL", "PASSWORD"]).then(({ EMAIL, PASSWORD }) => {
    // The login form lives on a different website (login.thenbs.com), and Cypress
    // needs cy.origin() to run commands there. We pass the email/password in as args.
    cy.origin(
      "https://login.thenbs.com",
      { args: { EMAIL, PASSWORD } },
      ({ EMAIL, PASSWORD }) => {
        cy.get("#Identification_Email").type(EMAIL);
        cy.contains("Next", { timeout: 10000 }).click();
        cy.get("#Authentication_Password").type(PASSWORD, { log: false }); // log: false hides the password in the Cypress log
        cy.contains("button", "Sign in", { timeout: 10000 }).click();
      },
    );

    // Check we've been sent back to the page we started on (login worked)
    cy.get("@currentUrl").then((currentUrl) => {
      cy.url().should("include", currentUrl);
    });
  });
});

// Once logged in, the site keeps its login token in the browser's sessionStorage
// (a small key/value store the website can read). If we save that token to a file,
// we can put it back later and skip logging in.

// Reads the saved token from the file (via a Node task in cypress.config.ts).
// Gives back null if no token has been saved yet.
function readAuthTokenFromDisk() {
  return cy.task<Record<string, string> | null>("readAuthCache", null, {
    log: false,
  });
}

// Copies everything in sessionStorage (including the token) and saves it to the file.
function writeAuthTokenToDisk() {
  cy.window()
    .then((win) => {
      // Loop through every item in sessionStorage and copy it into a plain object
      const dump: Record<string, string> = {};
      for (let i = 0; i < win.sessionStorage.length; i++) {
        const key = win.sessionStorage.key(i)!;
        dump[key] = win.sessionStorage.getItem(key)!;
      }
      return dump;
    })
    .then((dump) => {
      // Hand the object to Node to write to the file
      cy.task("writeAuthCache", dump, { log: false });
    });
}

// Makes sure we're logged in, using the quickest option available:
//   1. A session Cypress already has in memory (from earlier in this run)
//   2. A token saved to file (from a previous run)
//   3. Logging in for real with loginUser()
Cypress.Commands.add("ensureLoggedIn", () => {
  // cy.session() remembers the login under the name "nbsUserSession".
  // The first time, it runs the setup function below. After that, it restores
  // the remembered login instead - unless validate() shows it no longer works.
  cy.session(
    "nbsUserSession",
    // Setup function - only runs when Cypress doesn't already have a working login
    () => {
      cy.visit("/");

      // Check if a token was saved to file by a previous run
      readAuthTokenFromDisk().then((cachedToken) => {
        // No saved token - log in the normal way
        if (!cachedToken) {
          cy.loginUser();
          return;
        }

        // Saved token found - put it back into sessionStorage
        cy.window().then((win) => {
          Object.entries(cachedToken).forEach(([key, value]) =>
            win.sessionStorage.setItem(key, value),
          );
        });
        // Reload the page so the site notices the token and logs us in
        cy.reload();

        // Wait for the app to finish hydrating before checking whether we're
        // logged in. Right after reload() the page can still be rendering, so
        // an immediate check here could miss a token that's actually invalid.
        cy.get('[data-cy="searchFieldSearch"]', { timeout: 10000 }).should("exist");

        // The saved token might have expired. If "Sign in" is still showing,
        // it didn't work, so log in the normal way instead.
        cy.get("body").then(($body) => {
          if ($body.find('button:contains("Sign in")').length) {
            cy.loginUser();
          }
        });
      });

      // Save the current token to file so the next run can reuse it
      writeAuthTokenToDisk();
    },
    {
      // Checks the login still works: if "Sign in" isn't shown, we're logged in
      validate() {
        cy.visit("/");
        cy.contains("button", "Sign in", { timeout: 10000 }).should("not.exist");
      },
      // Share the login between all test files in the same run
      cacheAcrossSpecs: true,
    },
  );
});
