/// <reference types="cypress" />

import { BasePage } from "../../pages/base-page";
import { SearchResultsPage } from "../../pages/search-results-page";
import { ManufacturerPage } from "../../pages/manufacturer-page";
import { checkAccessibility } from "../../../util/accessability";
import { checkVisualRegression } from "../../../util/visual-regression";

describe("My First Test", () => {
  const manufacturerPage = new ManufacturerPage();
  const basePage = new BasePage();
  const searchResultsPage = new SearchResultsPage();

  beforeEach(() => {
    basePage.navigateToHomePage();
    basePage.searchFor("Dyson");
    searchResultsPage.clickManufacturerTab();
    searchResultsPage.clickManufacturerTile();
  });

//   //01 check the h1 header paragraph
//   it("check the h1 header paragraph", () => {
//     manufacturerPage
//       .checkH1Header()
//       .should("be.visible")
//       .and("have.text", "Dyson");
//   });

//   //02 check the dyson telephone number
//   it("check the dyson telephone number", () => {
//     manufacturerPage.checkTelephone()
//     .should("be.visible")
//     .and("include.text", "08003457788")
//     .and("have.attr", "href", "tel:08003457788");

//   });

//   //03 check the dyson website link
//   it("check the dyson website link", () => {
//     manufacturerPage
//       .checkManufacturerWebsiteLink()
//       .should('be.visible')
//       .and('have.text', ' Website ')
//       .and('have.attr', 'href', 'https://www.dyson.co.uk/commercial/overview')
//       .and('have.attr', 'target', '_blank')
//       .and(
//         'have.attr',
//         'title',
//         'Visit https://www.dyson.co.uk/commercial/overview',
//       );
//   });

//   //04 check the contact manfacurer link
//   it("check the contact manfacurer link", () => {
//     manufacturerPage.checkContactManufacturerLink()
//     .should("be.visible")
//     .and("contain.text", " Contact manufacturer ")
//     .and("have.attr", "title", "Contact Dyson");
//   });

//   //05 check the login works as expected
//   it('check the login works as expected', () => {
//     cy.loginUser();
//   })
});

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
//     checkAccessibility();
//   });
// });

describe("Visual Regression", () => {
  const basePage = new BasePage();
  const searchResultsPage = new SearchResultsPage();

  // Before each test, make sure we're logged in (reusing a saved login if possible)
  beforeEach(() => {
    cy.ensureLoggedIn();
    basePage.navigateToHomePage();
    basePage.searchFor("Dyson");
    searchResultsPage.clickManufacturerTab();
    searchResultsPage.clickManufacturerTile();
  });

  //08 check visual regression of the dyson manufacturer page
  it("checks visual regression of the dyson manufacturer page", () => {
    checkVisualRegression("dyson-manufacturer-page");
  });
});