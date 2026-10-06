import { BasePage } from "./base-page";

export class ManufacturerPage extends BasePage {

    // ==========================================================================       
    // LOCATORS
    // store selectors here as readonly properties so they are defined once
    // ==========================================================================
    readonly h1Header = "h1";
    readonly telephone = 'a[action="telephone"]';
    readonly website = 'a[action="company-website"]';
    readonly contactManufacturer = "button.contact-button";
    readonly certificatesTab = '[data-cy="certificatesTab"]';
    readonly certificateCard = "cirrus-search-result-tile-container"; // one card per certificate
    readonly certificateTitle = '[data-cy="searchResultTileTitle"]'; // the certificate name on a card
    readonly certificateType = "cirrus-certificate-type"; // e.g. "ISO 9001 Quality Management System"
    readonly loadingSpinner = "#spinner-loading"; // the "Loading..." text shown while data loads

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
    // click the certificates tab
    clickCertificatesTab() {
        cy.get(this.certificatesTab).click();
    }
    // get every certificate card on the Certificates tab
    getCertificateCards() {
        return cy.get(this.certificateCard);
    }
    // get the "Loading..." spinner
    getLoadingSpinner() {
        return cy.get(this.loadingSpinner);
    }
    // check the Certificates tab shows no cards and isn't stuck loading
    checkNoCertificatesShown() {
        cy.get(this.certificateCard).should("not.exist");
        cy.get(this.loadingSpinner).should("not.be.visible");
    }
}   