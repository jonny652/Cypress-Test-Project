// Waits for the page's above-the-fold content to be visible, so the
// comparison doesn't flake on a still-loading viewport.
function waitForPageToSettle(): void {
  cy.contains("Contact manufacturer").should("be.visible");
}

// Compares the current page to its committed baseline screenshot and fails
// the test if they differ by more than the project's configured tolerance
// (see addCompareSnapshotCommand defaults in cypress/support/e2e.ts).
export function checkVisualRegression(name: string): void {
  waitForPageToSettle();
  cy.compareSnapshot(name);
}
