/// <reference types="cypress" />
/// <reference types="cypress-axe" />

import type { ElementContext, Result } from "axe-core";

// Folder (from the project root) where the accessibility reports are saved
const REPORT_FOLDER = "cypress/reports/accessibility";

// Checks the current page for accessibility problems using axe-core, then saves
// an HTML report listing them. The test does NOT fail if problems are found -
// the page has known issues we can't fix, so we just record them in the report.
//   reportName - used for the report's title and file name
//   context    - optional: only check part of the page (e.g. "main"). Leave out to check the whole page.
export function checkAccessibility(
  reportName: string,
  context?: ElementContext,
) {
  // Filled in by checkA11y below if any problems are found
  let violations: Result[] = [];

  // Load axe-core (the accessibility checking library) into the page
  cy.injectAxe();

  // Run the check. The last argument `true` means "don't fail the test on problems".
  // cypress-axe also lists each problem in the Cypress log for us.
  cy.checkA11y(context, undefined, (found) => (violations = found), true);

  // Build the report and save it to a file
  cy.url({ log: false }).then((pageUrl) => {
    const filePath = `${REPORT_FOLDER}/${toFileName(reportName)}.html`;
    cy.writeFile(filePath, buildHtmlReport(reportName, pageUrl, violations), {
      log: false,
    });
    cy.log(
      `Accessibility: ${violations.length} issue(s) found. Report saved to ${filePath}`,
    );
  });
}

// Turns "Dyson manufacturer page" into "dyson-manufacturer-page" so it's safe as a file name
function toFileName(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// Makes text safe to put inside HTML (so things like "<div>" show as text, not as real HTML)
function escapeHtml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Creates the HTML for the report page
function buildHtmlReport(
  reportName: string,
  pageUrl: string,
  violations: Result[],
) {
  // Count how many problems there are of each severity
  const impacts = ["critical", "serious", "moderate", "minor"];
  const counts = impacts
    .map(
      (impact) =>
        `<li>${impact}: ${violations.filter((v) => v.impact === impact).length}</li>`,
    )
    .join("");

  // One section per problem, listing every element on the page that has it
  const sections = violations
    .map((v) => {
      const elements = v.nodes
        .map(
          (node) => `
          <tr>
            <td><code>${escapeHtml(node.target.join(" "))}</code></td>
            <td><code>${escapeHtml(node.html)}</code></td>
            <td>${escapeHtml(node.failureSummary ?? "").replace(/\n/g, "<br>")}</td>
          </tr>`,
        )
        .join("");

      return `
      <section>
        <h2><span class="impact ${v.impact}">${v.impact}</span> ${escapeHtml(v.help)}</h2>
        <p>${escapeHtml(v.description)}</p>
        <p>Rule: <code>${v.id}</code> - <a href="${v.helpUrl}">How to fix</a> - ${v.nodes.length} element(s)</p>
        <table>
          <tr><th>Element</th><th>HTML</th><th>What's wrong</th></tr>
          ${elements}
        </table>
      </section>`;
    })
    .join("");

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Accessibility report - ${escapeHtml(reportName)}</title>
  <style>
    body { font-family: sans-serif; margin: 2rem; color: #222; }
    table { border-collapse: collapse; width: 100%; }
    th, td { border: 1px solid #ccc; padding: 0.4rem; text-align: left; vertical-align: top; }
    code { word-break: break-all; }
    section { margin-bottom: 2rem; }
    .impact { padding: 0.1rem 0.5rem; border-radius: 4px; color: #fff; font-size: 0.8em; }
    .critical { background: #b00020; }
    .serious { background: #d9480f; }
    .moderate { background: #b58100; }
    .minor { background: #5c6b7a; }
  </style>
</head>
<body>
  <h1>Accessibility report - ${escapeHtml(reportName)}</h1>
  <p>Page: <a href="${escapeHtml(pageUrl)}">${escapeHtml(pageUrl)}</a><br>Checked: ${new Date().toLocaleString()}</p>
  <p><strong>${violations.length} accessibility issue(s) found</strong></p>
  <ul>${counts}</ul>
  ${sections || "<p>No accessibility issues found.</p>"}
</body>
</html>`;
}
