/// <reference types="cypress" />

import { BasePage } from "../../pages/base-page";
import { SearchResultsPage } from "../../pages/search-results-page";
import { ManufacturerPage } from "../../pages/manufacturer-page";
import { checkAccessibility } from "../../../util/accessibility";
import { checkVisualRegression } from "../../../util/visual-regression";
import {
  delayCertificates,
  isCertificatesQuery,
  modifyCertificates,
  spyOnCertificates,
  stubCertificates,
} from "../../../util/graphql";

// describe("My First Test", () => {
//   const manufacturerPage = new ManufacturerPage();
//   const basePage = new BasePage();
//   const searchResultsPage = new SearchResultsPage();

//   beforeEach(() => {
//     basePage.navigateToHomePage();
//     basePage.searchFor("Dyson");
//     searchResultsPage.clickManufacturerTab();
//     searchResultsPage.clickManufacturerTile();
//   });

//   //01 check the h1 header paragraph
//   it("check the h1 header paragraph", () => {
//     manufacturerPage
//       .checkH1Header()
//       .should("be.visible")
//       .and("have.text", "Dyson");
//   });

//   //02 check the dyson telephone number
//   it("check the dyson telephone number", () => {
//     manufacturerPage
//       .checkTelephone()
//       .should("be.visible")
//       .and("include.text", "08003457788")
//       .and("have.attr", "href", "tel:08003457788");
//   });

//   //03 check the dyson website link
//   it("check the dyson website link", () => {
//     manufacturerPage
//       .checkManufacturerWebsiteLink()
//       .should("be.visible")
//       .and("have.text", " Website ")
//       .and("have.attr", "href", "https://www.dyson.co.uk/commercial/overview")
//       .and("have.attr", "target", "_blank")
//       .and(
//         "have.attr",
//         "title",
//         "Visit https://www.dyson.co.uk/commercial/overview",
//       );
//   });

//   //04 check the contact manfacurer link
//   it("check the contact manfacurer link", () => {
//     manufacturerPage
//       .checkContactManufacturerLink()
//       .should("be.visible")
//       .and("contain.text", " Contact manufacturer ")
//       .and("have.attr", "title", "Contact Dyson");
//   });

//   //05 check the login works as expected
//   it("check the login works as expected", () => {
//     cy.loginUser();
//   });
// });

// describe("Authentication session", () => {
//   // Before each test, make sure we're logged in (reusing a saved login if possible)
//   beforeEach(() => {
//     cy.ensureLoggedIn();
//   });

//   //06 check the authentication session/token is reused instead of signing in again
//   it("reuses the cached authentication session on repeat visits", () => {
//     cy.visit("/");
//     cy.contains("button", "Sign in", { timeout: 10000 }).should("not.exist");
//   });
// });

// describe("Accessibility", () => {
//   const basePage = new BasePage();
//   const searchResultsPage = new SearchResultsPage();

//   // Before each test, make sure we're logged in (reusing a saved login if possible)
//   beforeEach(() => {
//     cy.ensureLoggedIn();
//     basePage.navigateToHomePage();
//     basePage.searchFor("Dyson");
//     searchResultsPage.clickManufacturerTab();
//     searchResultsPage.clickManufacturerTile();
//   });

//   //07 check accesability of the dyson manufacturer page with axe-core plugin
//   it("checks accessibility of the dyson manufacturer page", () => {
//     checkAccessibility("dyson manufacturer page");
//   });
// });

// describe("Visual Regression", () => {
//   const basePage = new BasePage();
//   const searchResultsPage = new SearchResultsPage();

//   // Before each test, make sure we're logged in (reusing a saved login if possible)
//   beforeEach(() => {
//     cy.ensureLoggedIn();
//     basePage.navigateToHomePage();
//     basePage.searchFor("Dyson");
//     searchResultsPage.clickManufacturerTab();
//     searchResultsPage.clickManufacturerTile();
//   });

//   //08 check visual regression of the dyson manufacturer page
//   it("checks visual regression of the dyson manufacturer page", () => {
//     checkVisualRegression("dyson-manufacturer-page");
//   });
// });

describe("API - Certificates", () => {
  const manufacturerPage = new ManufacturerPage();
  const basePage = new BasePage();
  const searchResultsPage = new SearchResultsPage();

  beforeEach(() => {
    basePage.navigateToHomePage();
    basePage.searchFor("Dyson");
    searchResultsPage.clickManufacturerTab();
    searchResultsPage.clickManufacturerTile();
  });

  //09 check the "no results" message when no certificates are returned
  it("shows no results when the certificates payload is empty", () => {
    // let the real request through, then empty the list before the page sees it
    modifyCertificates((certificates) => {
      certificates.items = []; // remove all certificates
      certificates.totalItems = 0; // update the count to match
    });

    manufacturerPage.clickCertificatesTab();
    cy.wait("@certificates");

    // check the empty state message is shown
    cy.contains("Sorry, no results were found").should("be.visible");
  });

  // NOTE for tests 10, 11 and 13: when loading certificates fails, the site
  // currently shows an empty tab with no error message. These tests check the
  // page copes (no crash, no stuck spinner, header still works). If the site
  // adds an error message later, add a check for it here.

  //10 check the page copes when the certificates API returns a server error
  it("handles a 500 server error from the certificates API", () => {
    // reply with a 500 error instead of calling the real API
    stubCertificates({ statusCode: 500, body: "Internal Server Error" });

    manufacturerPage.clickCertificatesTab();
    // check the page really got our 500 response
    cy.wait("@certificates").its("response.statusCode").should("eq", 500);

    manufacturerPage.checkNoCertificatesShown();
    manufacturerPage.checkH1Header().should("have.text", "Dyson"); // rest of the page still works
  });

  //11 check the page copes when the API returns a GraphQL error
  it("handles a GraphQL errors response from the certificates API", () => {
    // GraphQL APIs usually report failures as status 200 with an "errors" list
    stubCertificates({
      statusCode: 200,
      body: [
        {
          errors: [{ message: "Something went wrong" }],
          data: { certifications: null },
        },
      ],
    });

    manufacturerPage.clickCertificatesTab();
    // check the page really got our GraphQL error response
    cy.wait("@certificates").its("response.body.0.errors").should("have.length", 1);

    manufacturerPage.checkNoCertificatesShown();
    manufacturerPage.checkH1Header().should("have.text", "Dyson");
  });

  //12 check a loading spinner shows while certificates are loading
  it("shows a loading spinner while certificates load", () => {
    // hold the real response back for 3 seconds to simulate a slow API
    delayCertificates(3000);

    manufacturerPage.clickCertificatesTab();

    // while waiting: spinner shown, no cards yet
    manufacturerPage.getLoadingSpinner().should("be.visible");
    manufacturerPage.getCertificateCards().should("not.exist");

    // once the response arrives: cards shown, spinner gone
    cy.wait("@certificates");
    manufacturerPage.getCertificateCards().should("have.length.greaterThan", 0);
    manufacturerPage.getLoadingSpinner().should("not.be.visible");
  });

  //13 check the page copes when the connection to the API fails
  it("handles a network failure when loading certificates", () => {
    // simulate a dropped connection (no response at all)
    stubCertificates({ forceNetworkError: true });

    manufacturerPage.clickCertificatesTab();
    // check the request really failed with no response
    cy.wait("@certificates").its("error").should("exist");

    manufacturerPage.checkNoCertificatesShown();
    manufacturerPage.checkH1Header().should("have.text", "Dyson");
  });

  //14 check a certificate from the API is shown with the right details
  it("shows the details of a certificate returned by the API", () => {
    // fake certificate name and type, from cypress/fixtures/certificate.json
    cy.fixture("certificate").then((fake) => {
      modifyCertificates((certificates) => {
        // copy a real certificate so every field the page needs is present,
        // then swap in our fake name and type so we know what to look for
        const real = certificates.items[0] as Record<string, any>;
        const fakeCertificate = {
          ...real,
          name: fake.name,
          certificationType: { ...real.certificationType, name: fake.type },
        };
        certificates.items = [fakeCertificate]; // show only our fake certificate
        certificates.totalItems = 1;
      });

      manufacturerPage.clickCertificatesTab();
      cy.wait("@certificates");

      // exactly one card, showing the fake name and type
      manufacturerPage.getCertificateCards().should("have.length", 1).first().within(() => {
        cy.get(manufacturerPage.certificateTitle).should("have.text", ` ${fake.name} `);
        cy.get(manufacturerPage.certificateType).should("contain.text", fake.type);
      });
      cy.contains("Showing 1-1 of 1").should("be.visible");
    });
  });

  //15 check the page asks the API for Dyson's certificates
  it("requests certificates for the Dyson brand", () => {
    // watch the request without changing it
    spyOnCertificates();

    manufacturerPage.clickCertificatesTab();

    cy.wait("@certificates").then(({ request }) => {
      // the request body is a list of queries; find the certificates one
      const queries = Array.isArray(request.body) ? request.body : [request.body];
      const certificatesQuery = queries.find(isCertificatesQuery);

      // it should ask for Dyson's ID, starting from the first page
      expect(certificatesQuery.variables.brandId).to.eq("nakAxHWxDZprdqkBaCdn4U");
      expect(certificatesQuery.variables.skip).to.eq(0);
      expect(certificatesQuery.variables.take).to.be.greaterThan(0);
    });
  });

  //16 check the page shows every certificate the API returns
  it("shows the same number of certificates as the API returns", () => {
    // watch the real response without changing it
    spyOnCertificates();

    manufacturerPage.clickCertificatesTab();

    cy.wait("@certificates").then(({ response }) => {
      // the response is a list of results; find the certificates one
      const results = Array.isArray(response?.body) ? response.body : [response?.body];
      const certificates = results.find((result) => result?.data?.certifications)
        .data.certifications.byBrandId.paginatedResponse;

      // one card per certificate, and the count text matches the API's total
      manufacturerPage.getCertificateCards().should("have.length", certificates.items.length);
      cy.contains(`Showing 1-${certificates.items.length} of ${certificates.totalItems}`).should("be.visible");
    });
  });
});
