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

  it("ensure the paragraph under title is correct", () => {
    const paragraphUnderTitle = cy.get(".brand-title-container + p");

    paragraphUnderTitle
      .should("be.visible")
      .and("have.text", "Technology for business");
  });

  // check the dyson telephone number
  it("check the dyson telephone number", () => {
    const telephoneNumber = cy.get('a[action="telephone"]');

    telephoneNumber.should("have.text", " 08003457788 ");
    telephoneNumber.should("have.attr", "title", "Call 08003457788");
    telephoneNumber.should("have.attr", "href", "tel:08003457788");
  });

  // check the dyson website link
  it("check the dyson website link", () => {
    const companyWebsiteLink = cy.get('a[action="company-website"]');

    companyWebsiteLink.should("have.text", " Website ");
    companyWebsiteLink.should(
      "have.attr",
      "href",
      "https://www.dyson.co.uk/commercial/overview",
    );
    companyWebsiteLink.should("have.attr", "target", "_blank");
    companyWebsiteLink.should("be.visible");
    companyWebsiteLink.should(
      "have.attr",
      "title",
      "Visit https://www.dyson.co.uk/commercial/overview",
    );
  });

  // check the contact manfacurer link
  it("check the contact manfacurer button", () => {
    const contactManufacturerButton = cy.get("button.contact-button");

    contactManufacturerButton.should("have.text", " Contact manufacturer ");
    contactManufacturerButton.should("be.visible");
  });
});
