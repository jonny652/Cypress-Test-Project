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
// 1. Waits for the top of the page and the Overview tab content to show.
// 2. Scrolls slowly to the bottom so lazy-loaded images start loading,
//    then waits for every image to finish.
// 3. Stops the sticky header / floating button repeating in the screenshot.
function preparePageForScreenshot(): void {
  cy.contains("Contact manufacturer").should("be.visible");
  // The Overview content loads after the header. "Trade names" is its last
  // section, so once it shows, the content above it has loaded too.
  cy.contains("Trade names").should("be.visible");

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
// The baseline name includes:
// - the operating system, because screenshots render slightly differently on each OS.
// - the display scale, because a visible browser (UI mode, --headed) uses the
//   screen's scaling, so on a laptop set to 150% screenshots are 1.5x the size.
// e.g. "dyson-manufacturer-page-win32-1x" (headless), "...-win32-1.5x" (UI mode).
// CI runs headless on Linux, so only the "-linux" baselines are committed (see .gitignore).
export function checkVisualRegression(name: string): void {
  preparePageForScreenshot();
  cy.window().then((win) => {
    cy.compareSnapshot(`${name}-${Cypress.platform}-${win.devicePixelRatio}x`);
  });
}
