/// <reference types="cypress" />

import type { StaticResponse } from "cypress/types/net-stubbing";

// The website loads its data from a GraphQL API. Every query is sent as a
// POST to this URL, so we tell queries apart by their "operationName".
const GRAPHQL_URL = "**/graphql";

// The operationName the Certificates tab uses to load its certificates
const CERTIFICATES_OPERATION = "certifications";

// The part of the certificates response that holds the list of certificates
export interface CertificatesPage {
  items: Record<string, unknown>[];
  totalItems: number;
}

// Returns true if this single query is the one that loads the certificates list.
// Two different queries are named "certifications" (the other one loads
// certificate issuers), so we also check it asks for the paginated list.
export function isCertificatesQuery(query: any): boolean {
  return (
    query?.operationName === CERTIFICATES_OPERATION &&
    String(query?.query).includes("paginatedResponse")
  );
}

// The site batches queries, so a request body is either one query or a list of them.
// Returns true if any query in the request is the certificates list query.
function isCertificatesRequest(body: unknown): boolean {
  const queries = Array.isArray(body) ? body : [body];
  return queries.some(isCertificatesQuery);
}

// Watches the certificates request and lets it through unchanged.
// Use it to check the request or the real response, e.g. cy.wait("@certificates").
export function spyOnCertificates(alias = "certificates"): void {
  cy.intercept("POST", GRAPHQL_URL, (req) => {
    if (isCertificatesRequest(req.body)) {
      req.alias = alias; // only the certificates request gets the alias
    }
  });
}

// Lets the certificates request reach the real API, then changes the
// response before the page sees it. `modify` receives the list of
// certificates and can change it (e.g. empty it or swap in fake data).
export function modifyCertificates(
  modify: (certificates: CertificatesPage) => void,
  alias = "certificates",
): void {
  cy.intercept("POST", GRAPHQL_URL, (req) => {
    if (!isCertificatesRequest(req.body)) return; // leave other queries alone
    req.alias = alias;

    req.continue((res) => {
      // the response is a list of results, one per query in the batch
      const results = Array.isArray(res.body) ? res.body : [res.body];

      results.forEach((result) => {
        const certificates = result?.data?.certifications?.byBrandId?.paginatedResponse;
        if (certificates) {
          modify(certificates);
        }
      });
    });
  });
}

// Answers the certificates request with a made-up response instead of
// calling the real API, e.g. a 500 error or a dropped connection.
// Only the certificates request is affected; the rest of the page loads normally.
export function stubCertificates(response: StaticResponse, alias = "certificates"): void {
  cy.intercept("POST", GRAPHQL_URL, (req) => {
    if (!isCertificatesRequest(req.body)) return;
    req.alias = alias;
    req.reply(response);
  });
}

// Lets the certificates request through, but holds the response back
// for `delayMs` milliseconds, to simulate a slow API.
export function delayCertificates(delayMs: number, alias = "certificates"): void {
  cy.intercept("POST", GRAPHQL_URL, (req) => {
    if (!isCertificatesRequest(req.body)) return;
    req.alias = alias;
    req.on("response", (res) => {
      res.setDelay(delayMs);
    });
  });
}
