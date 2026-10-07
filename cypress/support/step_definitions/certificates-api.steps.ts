// Steps for the Certificates API scenarios.
// The "Given" steps set up how the certificates API should behave, so they
// must run BEFORE the Certificates tab is opened.
// Every helper gives the certificates request the alias "@certificates".

import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import type { Interception } from "cypress/types/net-stubbing";
import { ManufacturerPage } from "../../pages/manufacturer-page";
import {
  delayCertificates,
  isCertificatesQuery,
  modifyCertificates,
  spyOnCertificates,
  stubCertificates,
} from "../../../util/graphql";

const manufacturerPage = new ManufacturerPage();

// The made-up responses used by the "fails with a ..." steps
const FAILURES: Record<string, Parameters<typeof stubCertificates>[0]> = {
  "server error": { statusCode: 500, body: "Internal Server Error" },
  // GraphQL APIs usually report failures as status 200 with an "errors" list
  "GraphQL error": {
    statusCode: 200,
    body: [{ errors: [{ message: "Something went wrong" }], data: { certifications: null } }],
  },
  "network error": { forceNetworkError: true }, // connection dropped, no response
};

// Gets the last certificates request/response the page made
function lastCertificatesCall() {
  return cy.get<Interception>("@certificates");
}

// ---------- Given: set up the API ----------

// let the real request through but empty the list
Given("the certificates API returns no certificates", () => {
  modifyCertificates((certificates) => {
    certificates.items = [];
    certificates.totalItems = 0;
  });
});

Given("the certificates API fails with a {string}", (failure: string) => {
  stubCertificates(FAILURES[failure]);
});

Given("the certificates API takes {int} seconds to respond", (seconds: number) => {
  delayCertificates(seconds * 1000);
});

// swap the real certificates for one fake one (cypress/fixtures/certificate.json)
Given("the certificates API returns only the fake certificate", () => {
  cy.fixture("certificate").then((fake) => {
    modifyCertificates((certificates) => {
      // copy a real certificate so every field the page needs is present,
      // then change its name and type so we know what to look for
      const real = certificates.items[0] as Record<string, any>;
      certificates.items = [
        { ...real, name: fake.name, certificationType: { ...real.certificationType, name: fake.type } },
      ];
      certificates.totalItems = 1;
    });
  });
});

// watch the real request and response without changing them
Given("I am watching the certificates API", () => {
  spyOnCertificates();
});

// ---------- When: open the tab ----------

// click the tab and wait for the certificates response
When("I open the Certificates tab", () => {
  manufacturerPage.clickCertificatesTab();
  cy.wait("@certificates");
});

// click the tab but DON'T wait, so we can check what shows while loading
When("I click the Certificates tab", () => {
  manufacturerPage.clickCertificatesTab();
});

When("the certificates finish loading", () => {
  cy.wait("@certificates");
});

// ---------- Then: check the result ----------

Then("I see the message {string}", (message: string) => {
  cy.contains(message).should("be.visible");
});

// proves our fake failure really reached the page
Then("the certificates request failed with a {string}", (failure: string) => {
  lastCertificatesCall().then(({ response, error }) => {
    if (failure === "server error") expect(response?.statusCode).to.eq(500);
    if (failure === "GraphQL error") expect(response?.body[0].errors).to.have.length(1);
    if (failure === "network error") expect(error).to.exist;
  });
});

// no cards, and not stuck loading
Then("no certificates are shown", () => {
  manufacturerPage.checkNoCertificatesShown();
});

Then("the loading spinner is shown", () => {
  manufacturerPage.getLoadingSpinner().should("be.visible");
});

Then("the loading spinner is hidden", () => {
  manufacturerPage.getLoadingSpinner().should("not.be.visible");
});

Then("no certificate cards are shown yet", () => {
  manufacturerPage.getCertificateCards().should("not.exist");
});

Then("certificate cards are shown", () => {
  manufacturerPage.getCertificateCards().should("have.length.greaterThan", 0);
});

Then("one certificate card shows the fake certificate's name and type", () => {
  cy.fixture("certificate").then((fake) => {
    manufacturerPage.getCertificateCards().should("have.length", 1).first().within(() => {
      cy.get(manufacturerPage.certificateTitle).should("have.text", ` ${fake.name} `);
      cy.get(manufacturerPage.certificateType).should("contain.text", fake.type);
    });
  });
});

// checks what the page asked the API for
Then("the certificates request is for brand {string} starting from the first page", (brandId: string) => {
  lastCertificatesCall().then(({ request }) => {
    // the request body is a list of queries; find the certificates one
    const queries = Array.isArray(request.body) ? request.body : [request.body];
    const certificatesQuery = queries.find(isCertificatesQuery);

    expect(certificatesQuery.variables.brandId).to.eq(brandId);
    expect(certificatesQuery.variables.skip).to.eq(0);
    expect(certificatesQuery.variables.take).to.be.greaterThan(0);
  });
});

// one card per certificate, and the "Showing" text matches the API's total
Then("the number of certificate cards matches the API response", () => {
  lastCertificatesCall().then(({ response }) => {
    const results = Array.isArray(response?.body) ? response.body : [response?.body];
    const certificates = results.find((result) => result?.data?.certifications)
      .data.certifications.byBrandId.paginatedResponse;

    manufacturerPage.getCertificateCards().should("have.length", certificates.items.length);
    cy.contains(`Showing 1-${certificates.items.length} of ${certificates.totalItems}`).should("be.visible");
  });
});
