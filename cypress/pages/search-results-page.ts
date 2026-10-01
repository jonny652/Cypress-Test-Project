import { BasePage } from "./base-page";

export class SearchResultsPage extends BasePage {

    // ==========================================================================
    // LOCATORS
    // store selectors here as readonly properties so they are defined once
    // ==========================================================================
    readonly manufacturerTab = '[data-cy="tabCategory"]'; 
    readonly manufacturerTile = '[title="View Dyson"]';
// ==========================================================================
    // METHODS
    // store reusable actions and assertions here, using the locators above
    // ==========================================================================
   // click the manufacturer tab and check the url
    clickManufacturerTab() {
        cy.contains(this.manufacturerTab, "Manufacturers").click( {timeout: 10000} ); 
    }
    // click the dyson manufacturer tile and check the url
    clickManufacturerTile() {
        cy.contains(this.manufacturerTile, "Dyson").click( {timeout: 10000} ); 
        cy.url ().should("include", "/manufacturer/dyson/nakAxHWxDZprdqkBaCdn4U/overview");
    }   
}