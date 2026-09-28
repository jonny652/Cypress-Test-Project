import { BasePage } from "./base-page";

export class ManufacturerPage extends BasePage {

    // ==========================================================================       
    // LOCATORS
    // store selectors here as readonly properties so they are defined once
    // ==========================================================================
    readonly h1Header = "h1";
    readonly telephone = 'a[action="telephone"]';
    readonly website = 'a[action="website"]';
    readonly contactManufacturer = "button.contact-button";

    // ==========================================================================
    // METHODS
    // store reusable actions and assertions here, using the locators above
    // ==========================================================================
    checkH1Header() {
        return cy.get(this.h1Header);
    //    cy.get(this.h1Header).should("be.visible").and("have.text", expectedText);
    }
    checkTelephone() {
        return cy.get(this.telephone)

    }
    checkManufacturerWebsiteLink() {
        return cy.get(this.website);
    }
    checkContactManufacturerLink() {
        return cy.get(this.contactManufacturer);
    }
}   