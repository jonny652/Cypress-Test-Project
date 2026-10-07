// Steps for the manufacturer details, login, accessibility and
// visual regression scenarios.

import { Then } from "@badeball/cypress-cucumber-preprocessor";
import { ManufacturerPage } from "../../pages/manufacturer-page";
import { checkAccessibility } from "../../../util/accessibility";
import { checkVisualRegression } from "../../../util/visual-regression";

const manufacturerPage = new ManufacturerPage();

// the number is shown and the link dials it
Then("the telephone number {string} is shown", (number: string) => {
  manufacturerPage
    .checkTelephone()
    .should("be.visible")
    .and("include.text", number)
    .and("have.attr", "href", `tel:${number}`);
});

// the link goes to the website and opens in a new tab
Then("the website link goes to {string}", (url: string) => {
  manufacturerPage
    .checkManufacturerWebsiteLink()
    .should("be.visible")
    .and("have.text", " Website ")
    .and("have.attr", "href", url)
    .and("have.attr", "target", "_blank")
    .and("have.attr", "title", `Visit ${url}`);
});

Then("the contact manufacturer button is shown", () => {
  manufacturerPage
    .checkContactManufacturerLink()
    .should("be.visible")
    .and("contain.text", " Contact manufacturer ")
    .and("have.attr", "title", "Contact Dyson");
});

// signs in with the EMAIL and PASSWORD from the .env file
Then("I can log in", () => {
  cy.loginUser();
});

// if the saved login worked, there's no "Sign in" button
Then("I am not asked to sign in", () => {
  cy.contains("button", "Sign in", { timeout: 10000 }).should("not.exist");
});

// runs axe-core and saves a report (doesn't fail on known issues)
Then("the page is checked for accessibility issues and saved as {string}", (reportName: string) => {
  checkAccessibility(reportName);
});

// compares a full-page screenshot with the saved baseline
Then("the page matches the {string} baseline screenshot", (name: string) => {
  checkVisualRegression(name);
});
