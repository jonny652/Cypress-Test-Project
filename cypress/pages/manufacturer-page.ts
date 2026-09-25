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
    checkH1Header(expectedText: string) {
        cy.get(this.h1Header).should("be.visible").and("have.text", expectedText);
    }
    checkTelephone(expectedText: string) {
        cy.get(this.telephone).should("be.visible").and("have.text", expectedText);
    }
    checkManufacturerWebsiteLink(expectedUrl: string) {
        cy.get(this.website).should("be.visible").and("have.attr", "href", expectedUrl);
    }
    checkContactManufacturerLink() {
        cy.get(this.contactManufacturer).should("be.visible").and("have.text", " Contact manufacturer ");
    }
}   