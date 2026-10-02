// The site has a sticky header and a floating "back to top" button. When
// Cypress takes a full-page screenshot it scrolls down the page taking
// several pictures and joins them together, so these would appear again in
// every picture. This CSS stops them following the page as it scrolls.
const HIDE_STICKY_ELEMENTS_CSS = `
  cirrus-header-wrapper-static, app-sticky-footer { position: relative !important; }
  cirrus-header-wrapper-sliding, cirrus-transient-navbar, .overlay-buttons { display: none !important; }
`;

// Waits until every <img> on the page has finished loading.
function waitForAllImages(): void {
  cy.get("img").each(($img) => {
    cy.wrap($img).should(($el) => {
      const img = $el[0] as HTMLImageElement;
      expect(img.complete, `image loaded: ${img.src}`).to.be.true;
    });
  });
}

// Gets the page ready for a full-page screenshot:
// 1. Waits for the top of the page to show.
// 2. Scrolls slowly to the bottom so lazy-loaded images start loading,
//    then waits for every image to finish.
// 3. Stops the sticky header / floating button repeating in the screenshot.
function preparePageForScreenshot(): void {
  cy.contains("Contact manufacturer").should("be.visible");

  cy.scrollTo("bottom", { duration: 2000 });
  waitForAllImages();
  cy.scrollTo("top");

  cy.document().then((doc) => {
    const style = doc.createElement("style");
    style.textContent = HIDE_STICKY_ELEMENTS_CSS;
    doc.head.appendChild(style);
  });
}

// Takes a screenshot of the whole page and compares it to its committed
// baseline, failing the test if they differ by more than the project's
// configured tolerance (see addCompareSnapshotCommand in cypress/support/e2e.ts).
// The operating system is added to the name (e.g. "dyson-manufacturer-page-linux"),
// because screenshots render slightly differently on each OS. CI runs on Linux,
// so only the "-linux" baselines are committed (see .gitignore).
export function checkVisualRegression(name: string): void {
  preparePageForScreenshot();
  cy.compareSnapshot(`${name}-${Cypress.platform}`);
}
