/// <reference types="cypress" />

import { BasePage } from "../../pages/base-page";
import { SearchResultsPage } from "../../pages/search-results-page";
import { ManufacturerPage } from "../../pages/manufacturer-page";

describe("My First Test", () => {
  beforeEach(() => {
    const basePage = new BasePage();
    const searchResultsPage = new SearchResultsPage();

    basePage.navigateToHomePage();
    basePage.searchFor("Dyson");
    searchResultsPage.clickManufacturerTab();
    searchResultsPage.clickManufacturerTile();
  });

  //01 check the h1 header paragraph
  it("check the h1 header paragraph", () => {
    const manufacturerPage = new ManufacturerPage();
    manufacturerPage.checkH1Header("Dyson");
  });

  //02 check the dyson telephone number
  it("check the dyson telephone number", () => {
    const manufacturerPage = new ManufacturerPage();
    manufacturerPage.checkTelephone(" 08003457788 ");
  });

  //03 check the dyson website link
  it("check the dyson website link", () => {
    const manufacturerPage = new ManufacturerPage();
    manufacturerPage.checkManufacturerWebsiteLink("https://www.dyson.co.uk/commercial/overview");
  });

  //04 check the contact manfacurer link
  it("check the contact manfacurer link", () => {
  const manufacturerPage = new ManufacturerPage();

    manufacturerPage.checkContactManufacturerLink();
  });
});
