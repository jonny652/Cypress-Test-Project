// Steps shared by several scenarios: getting to the page, logging in,
// and checking the page heading.

import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import { BasePage } from "../../pages/base-page";
import { SearchResultsPage } from "../../pages/search-results-page";
import { ManufacturerPage } from "../../pages/manufacturer-page";
import { checkAccessibility } from "../../../util/accessibility";
import { checkVisualRegression } from "../../../util/visual-regression";
import { modifyCertificates, spyOnCertificates,isCertificatesQuery, stubCertificates, CertificatesPage } from "../../../util/graphql";
import { delayCertificates } from "../../../util/graphql";

const basePage = new BasePage();
const searchResultsPage = new SearchResultsPage();
const manufacturerPage = new ManufacturerPage();

// search for Dyson and open its manufacturer page
Given("I am on the Dyson manufacturer page", () => {
  basePage.navigateToHomePage();
  basePage.searchFor("Dyson");
  searchResultsPage.clickManufacturerTab();
  searchResultsPage.clickManufacturerTile();
});

// log in, reusing a saved login if there is one
Given("I am logged in", () => {
  cy.ensureLoggedIn();
});

When("I visit the home page", () => {
  cy.visit("/");
});

Then("the page heading is {string}", (heading: string) => {
  manufacturerPage
    .checkH1Header()
    .should("be.visible")
    .and("have.text", heading);
});

Then("I click the sign in button", () => {
  basePage.clickSignInButton();
});

Then("I enter valid credntials and click the login button", () => {
  cy.loginUser();
});

Then("I should be signed in and redirected to the original page", () => {
  cy.get("@currentUrl").then((currentUrl) => {
    cy.url().should("include", currentUrl);
  });
});

Given("I am signed in", () => {
  cy.ensureLoggedIn();
});

Then("the sign in button should not be visible", () => {
  cy.get(basePage.signInButton).should("not.exist");
});

Then("then accessability violation will be output to the report", () => {
  checkAccessibility("dyson manufacturer page");
});

Then("the visual regression test will be output to the report", () => {
  checkVisualRegression("dyson-manufacturer-page");
});

When(
  "I intercept the API call to get the certificates and return an empty payload",
  () => {
    // let the real request through, then empty the list before the page sees it
    modifyCertificates((certificates) => {
      certificates.items = []; // remove all certificates
      certificates.totalItems = 0; // update the count to match
    });

    manufacturerPage.clickCertificatesTab();
    cy.wait("@certificates");
  },
);

Then("the page should display a no results message", () => {
  cy.contains("Sorry, no results were found").should("be.visible");
});
Then(
  "I intercept the API call to get the certificates and return a server error",
  () => {
    // reply with a 500 error instead of calling the real API
    stubCertificates({ statusCode: 500, body: "Internal Server Error" });

    manufacturerPage.clickCertificatesTab();
    // check the page really got our 500 response
    cy.wait("@certificates").its("response.statusCode").should("eq", 500);
  },
);

Then("the page should display an error message", () => {
  manufacturerPage.checkNoCertificatesShown();
  manufacturerPage.checkH1Header().should("have.text", "Dyson"); // rest of the page still works
});

When(
  "I intercept the API call to get the certificates and return a graphql error",
  () => {
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
  },
);

Then("the page should handle the graphql error gracefully", () => {
  // Implementation for handling GraphQL errors gracefully
  // check the page really got our GraphQL error response
  cy.wait("@certificates")
    .its("response.body.0.errors")
    .should("have.length", 1);

  manufacturerPage.checkNoCertificatesShown();
  manufacturerPage.checkH1Header().should("have.text", "Dyson");
});

When("the load spinner should be displayed while the page is loading", () => {
  manufacturerPage.getCertificateCards().should("have.length.greaterThan", 0);
  manufacturerPage.getLoadingSpinner().should("not.be.visible");
});

When(
  "I intercept the API call to get the certificates and delay the response",
  () => {
    // hold the real response back for 3 seconds to simulate a slow API
    delayCertificates(3000);

    manufacturerPage.clickCertificatesTab();

    // while waiting: spinner shown, no cards yet
    manufacturerPage.getLoadingSpinner().should("be.visible");
    manufacturerPage.getCertificateCards().should("not.exist");

    // once the response arrives: cards shown, spinner gone
    cy.wait("@certificates");
  },
);

When("I intercept the API call to get the certificates and simulate a network failure",() => {
    // simulate a dropped connection (no response at all)
    stubCertificates({ forceNetworkError: true });

    manufacturerPage.clickCertificatesTab();
    // check the request really failed with no response
    cy.wait("@certificates").its("error").should("exist");
  },
);

When("the page should display and handle the network failure gracefully",() => {
    // Implementation for handling network failure gracefully
    manufacturerPage.checkNoCertificatesShown();
    manufacturerPage.checkH1Header().should("have.text", "Dyson");
  },
);

When("I intercept the API call to get the certificates and return a certificate with amended details", () => {
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

      // save the fixture data so the following Then step can read it back
      cy.wrap(fake).as("fakeCertificate");

      manufacturerPage.clickCertificatesTab();
      cy.wait("@certificates");
    });
});

Then("the page should display the certificate details correctly", () => {
  cy.get<{ name: string; type: string }>("@fakeCertificate").then((fake) => {
    // exactly one card, showing the fake name and type
    manufacturerPage.getCertificateCards().should("have.length", 1).first().within(() => {
      cy.get(manufacturerPage.certificateTitle).should("have.text", ` ${fake.name} `);
      cy.get(manufacturerPage.certificateType).should("contain.text", fake.type);
    });
    cy.contains("Showing 1-1 of 1").should("be.visible");
  });
});

When("request for certificates includes the Dyson brand", () => {
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

When("I intercept the API call to get the certificates and return multiple certificates", () => {
  // watch the real response without changing it
  spyOnCertificates();

  manufacturerPage.clickCertificatesTab();

  cy.wait("@certificates").then(({ response }) => {
    // the response is a list of results; find the certificates one
    const results = Array.isArray(response?.body) ? response.body : [response?.body];
    const certificates: CertificatesPage = results.find((result) => result?.data?.certifications)
      .data.certifications.byBrandId.paginatedResponse;

    // save the real certificates so the following Then step can read them back
    cy.wrap(certificates).as("multipleCertificates");
  });
});

Then("the page should display all the certificates correctly", () => {
  cy.get<CertificatesPage>("@multipleCertificates").then((certificates) => {
    // one card per certificate returned, each showing the right name and type
    manufacturerPage.getCertificateCards().should("have.length", certificates.items.length);

    certificates.items.forEach((certificate: Record<string, any>, index: number) => {
      manufacturerPage.getCertificateCards().eq(index).within(() => {
        cy.get(manufacturerPage.certificateTitle).should("have.text", ` ${certificate.name} `);
        cy.get(manufacturerPage.certificateType).should("contain.text", certificate.certificationType.name);
      });
    });

    cy.contains(`Showing 1-${certificates.items.length} of ${certificates.totalItems}`).should("be.visible");
  });
});