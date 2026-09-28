/// <reference types="cypress" />

import { BasePage } from "../../pages/base-page";
import { SearchResultsPage } from "../../pages/search-results-page";
import { ManufacturerPage } from "../../pages/manufacturer-page";

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

  //01 check the h1 header paragraph
  it("check the h1 header paragraph", () => {
    manufacturerPage
      .checkH1Header()
      .should("be.visible")
      .and("have.text", "Dyson");
  });

  //02 check the dyson telephone number
  it("check the dyson telephone number", () => {
    manufacturerPage.checkTelephone()
    .should("be.visible")
    .and("have.text", "0800 298 0298")
    .and("have.attr", "href", "tel:08002980298");

  });

  //03 check the dyson website link
  it("check the dyson website link", () => {
    manufacturerPage.checkManufacturerWebsiteLink()
    .should("be.visible")
    .and("have.text", "www.dyson.co.uk")
    .and("have.attr", "href", "https://www.dyson.co.uk/")
    .and("have.attr", "target", "_blank")
    .and("have.attr", "title", "Visit https://www.dyson.co.uk/commercial/overview");
    
  });

  //04 check the contact manfacurer link
  it("check the contact manfacurer link", () => {
    manufacturerPage.checkContactManufacturerLink()
    .should("be.visible")
    .and("have.text", "Contact Manufacturer")
    .and("have.attr", "title", "Contact Manufacturer");
  });
});
