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

Cypress.Commands.add("loginUser", () => {
  // Store the current url to compare after login
  cy.url().as("currentUrl");

  // Click the sign in button
  cy.contains("button", "Sign in", { timeout: 10000 }).click();

  // Perform the cross origin login steps, using the EMAIL/PASSWORD
  // env vars sourced from .env
  cy.env(["EMAIL", "PASSWORD"]).then(({ EMAIL, PASSWORD }) => {
    cy.origin(
      "https://login.thenbs.com",
      { args: { EMAIL, PASSWORD } },
      ({ EMAIL, PASSWORD }) => {
        cy.get("#Identification_Email").type(EMAIL);
        cy.contains("Next", { timeout: 10000 }).click();
        cy.get("#Authentication_Password").type(PASSWORD, { log: false });
        cy.contains("button", "Sign in", { timeout: 10000 }).click();
      },
    );

    // Simple post-login assertion to verify we are redirected back to the expected url after login
    cy.get("@currentUrl").then((currentUrl) => {
      cy.url().should("include", currentUrl);
    });
  });
});

// The app's auth token (an OIDC user blob) lives in sessionStorage on the
// app's OWN origin (source.thenbs.com) - the key name embeds the identity
// provider's URL, but that's just the oidc-client library's naming
// convention, not where the value is stored.
function readAuthTokenFromDisk() {
  return cy.task<Record<string, string> | null>("readAuthCache", null, {
    log: false,
  });
}

function writeAuthTokenToDisk() {
  cy.window()
    .then((win) => {
      const dump: Record<string, string> = {};
      for (let i = 0; i < win.sessionStorage.length; i++) {
        const key = win.sessionStorage.key(i)!;
        dump[key] = win.sessionStorage.getItem(key)!;
      }
      return dump;
    })
    .then((dump) => {
      cy.task("writeAuthCache", dump, { log: false });
    });
}

Cypress.Commands.add("ensureLoggedIn", () => {
  // cy.session caches whatever the setup callback below produces (keyed on
  // "nbsUserSession") and restores it on subsequent calls within the same
  // `cypress run`/`cypress open` process, instead of re-running setup. If
  // validate() fails - or no session has been cached yet this run - Cypress
  // clears the cache and re-runs setup to obtain a fresh token.
  cy.session(
    "nbsUserSession",
    () => {
      // Before falling back to a full UI sign-in, check whether a still-valid
      // token was cached to disk by an earlier `cypress run` invocation and,
      // if so, drop it straight into sessionStorage instead of driving the
      // login form.
      cy.visit("/");

      readAuthTokenFromDisk().then((cachedToken) => {
        if (!cachedToken) {
          cy.loginUser();
          return;
        }

        cy.window().then((win) => {
          Object.entries(cachedToken).forEach(([key, value]) =>
            win.sessionStorage.setItem(key, value),
          );
        });
        // Reload so the app's JS re-bootstraps and picks up the token that
        // was just injected into sessionStorage.
        cy.reload();

        // The cached token may have expired since it was written. If
        // restoring it didn't leave us logged in, fall back to a real
        // sign-in rather than letting cy.session's post-setup validate()
        // fail outright.
        cy.get("body").then(($body) => {
          if ($body.find('button:contains("Sign in")').length) {
            cy.loginUser();
          }
        });
      });

      // Persist whatever token we ended up with (freshly signed-in or
      // restored from disk) so the next `cypress run` can reuse it too.
      writeAuthTokenToDisk();
    },
    {
      validate() {
        cy.visit("/");
        cy.contains("button", "Sign in", { timeout: 10000 }).should("not.exist");
      },
      cacheAcrossSpecs: true,
    },
  );
});
