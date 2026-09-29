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
