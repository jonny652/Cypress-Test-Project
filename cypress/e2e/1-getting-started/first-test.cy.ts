/// <reference types="cypress" />

describe("My First Test", () => {
  beforeEach(() => {
    const searchField = '[data-cy="searchFieldSearch"]';
    const manufacturerTabCategory = '[data-cy="tabCategory"]';
    const dysonTile = "cirrus-search-result-tile-container a";

    cy.visit("https://source.thenbs.com/en/gb/");
    cy.get(searchField).first().type("Dyson{enter}");

    cy.contains(manufacturerTabCategory, "Manufacturers").click();
    cy.title().should("eq", 'Manufacturers matching "Dyson" | NBS Source');

    cy.contains(dysonTile, "Dyson").click();
    cy.url().should("include", "/manufacturer/dyson");
  });

  //01 check the h1 header paragraph
  it("check the h1 header paragraph", () => {
    const h1Header = "h1";
    cy.get(h1Header).should("be.visible").and("have.text", "Dyson");
  });

  //02 check the dyson telephone number
  it("check the dyson telephone number", () => {
    const dysonTelephone = 'a[action="telephone"]';
    cy.get(dysonTelephone).should("be.visible");

    cy.get(dysonTelephone).should("have.text", " 08003457788 ");
    cy.get(dysonTelephone).should("have.attr", "title", "Call 08003457788");
    cy.get(dysonTelephone).should("have.attr", "href", "tel:08003457788");
  });

  //03 check the dyson website link
  it("check the dyson website link", () => {
    const dysonWebsite = 'a[action="company-website"]';
    cy.get(dysonWebsite).should("have.text", " Website ");
    cy.get(dysonWebsite).should(
      "have.attr",
      "href",
      "https://www.dyson.co.uk/commercial/overview",
    );
    cy.get(dysonWebsite).should("have.attr", "target", "_blank");
    cy.get(dysonWebsite).should("be.visible");
    cy.get(dysonWebsite).should(
      "have.attr",
      "title",
      "Visit https://www.dyson.co.uk/commercial/overview",
    );
  });

  //04 check the contact manfacurer link
  it("check the contact manfacurer link", () => {
    const contactManufacturer = "button.contact-button span.mdc-button__label";

    cy.get(contactManufacturer).should("have.text", " Contact manufacturer ");
    cy.get(contactManufacturer).should("be.visible");
  });
});
