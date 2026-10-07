// Steps shared by several scenarios: getting to the page, logging in,
// and checking the page heading.

import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import { BasePage } from "../../pages/base-page";
import { SearchResultsPage } from "../../pages/search-results-page";
import { ManufacturerPage } from "../../pages/manufacturer-page";

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
  manufacturerPage.checkH1Header().should("be.visible").and("have.text", heading);
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




