import "cypress-axe";

// Runs an axe-core accessibility scan on the current page.
// Violations are written to a report file (via the writeAccessibilityReport
// task) instead of failing the test.
export function checkAccessibility(): void {
  cy.injectAxe();
  cy.checkA11y(
    undefined,
    undefined,
    (violations) => {
      cy.task(
        "writeAccessibilityReport",
        { testTitle: Cypress.currentTest.title, violations },
        { log: false },
      );
    },
    true,
  );
}
