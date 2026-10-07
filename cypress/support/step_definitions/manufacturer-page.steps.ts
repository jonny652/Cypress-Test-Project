// Steps for the manufacturer details, login, accessibility and
// visual regression scenarios.

import { Then } from "@badeball/cypress-cucumber-preprocessor";
import { ManufacturerPage } from "../../pages/manufacturer-page";
import { checkAccessibility } from "../../../util/accessibility";
import { checkVisualRegression } from "../../../util/visual-regression";

const manufacturerPage = new ManufacturerPage();

// the number is shown and the link dials it
Then("the telephone number is {string}", (number: string) => {
  manufacturerPage
    .checkTelephone()
    .should("be.visible")
    .and("include.text", number)
    .and("have.attr", "href", `tel:${number}`);
});

// check the dyson website link  
Then("the website link should be visible", () => {
  manufacturerPage
    .checkManufacturerWebsiteLink()
    .should("be.visible")
});

// check the dyson website link  
Then("to have text {string}", (websiteText: string) => {
  manufacturerPage
    .checkManufacturerWebsiteLink()
    .should("have.text", websiteText);
});

// check the dyson website link  
Then("to have href {string}", (websiteLink: string) => {
  manufacturerPage
    .checkManufacturerWebsiteLink()
    .should("have.attr", "href", websiteLink);
});

// check the dyson website link  
Then("opens up a new tab when clicked", () => {
  manufacturerPage
    .checkManufacturerWebsiteLink()
    .should("have.attr", "target", "_blank");
});

// check the dyson website link  
Then("has title {string}", (title: string) => {
  manufacturerPage
    .checkManufacturerWebsiteLink()
    .should("have.attr", "title", title);
});