/// <reference types="cypress" />

describe("My First Test", () => {
  it("navigate to the dyson homepage and do stuff", () => {
    cy.visit("https://source.thenbs.com/en/gb/");
    cy.get('[data-cy="searchFieldSearch"]')
      .first()
      .type("Dyson")
      .type("{enter}");

    cy.contains('[data-cy="tabCategory"]', "Manufacturers").click();
    // Page title changed. The page should have `title` value
    cy.title().should("eq", 'Manufacturers matching "Dyson" | NBS Source');

    cy.contains("cirrus-search-result-tile-container a", "Dyson").click();
    cy.url().should("include", "/manufacturer/dyson");
  });
  // check the h1 header paragraph
  it("check the h1 header paragraph", () => {
        cy.visit("https://source.thenbs.com/en/gb/");
    cy.get('[data-cy="searchFieldSearch"]')
      .first()
      .type("Dyson")
      .type("{enter}");

    cy.contains('[data-cy="tabCategory"]', "Manufacturers").click();
    // Page title changed. The page should have `title` value
    cy.title().should("eq", 'Manufacturers matching "Dyson" | NBS Source');

    cy.contains("cirrus-search-result-tile-container a", "Dyson").click();
    cy.url().should("include", "/manufacturer/dyson");
    cy.get(".brand-title-container + p")
      .should("be.visible")
      .and("have.text", "Technology for business");
  });

 // check the dyson telephone number 
  it("check the dyson telephone number", () => {
        cy.visit("https://source.thenbs.com/en/gb/");
            cy.get('[data-cy="searchFieldSearch"]')
              .first()
              .type("Dyson")
              .type("{enter}");
        
            cy.contains('[data-cy="tabCategory"]', "Manufacturers").click();
            // Page title changed. The page should have `title` value
            cy.title().should("eq", 'Manufacturers matching "Dyson" | NBS Source');
        
            cy.contains("cirrus-search-result-tile-container a", "Dyson").click();
            cy.url().should("include", "/manufacturer/dyson");
          
        cy.get('a[action="telephone"]').should('have.text', ' 08003457788 ');
        cy.get('a[action="telephone"]').should('have.attr', 'title', 'Call 08003457788');
        cy.get('a[action="telephone"]').should('have.attr', 'href', 'tel:08003457788');
  });

 // check the dyson website link
  it("check the dyson website link", () => {
        cy.visit("https://source.thenbs.com/en/gb/");
            cy.get('[data-cy="searchFieldSearch"]')
              .first()
              .type("Dyson")
              .type("{enter}");
        
            cy.contains('[data-cy="tabCategory"]', "Manufacturers").click();
            // Page title changed. The page should have `title` value
            cy.title().should("eq", 'Manufacturers matching "Dyson" | NBS Source');
        
            cy.contains("cirrus-search-result-tile-container a", "Dyson").click();
            cy.url().should("include", "/manufacturer/dyson");
          
        cy.get('a[action="company-website"]').should('have.text', ' Website ');
        cy.get('a[action="company-website"]').should('have.attr', 'href', 'https://www.dyson.co.uk/commercial/overview');
        cy.get('a[action="company-website"]').should('have.attr', 'target', '_blank');
        cy.get('a[action="company-website"]').should('be.visible');
        cy.get('a[action="company-website"]').should('have.attr', 'title', 'Visit https://www.dyson.co.uk/commercial/overview');
  });

  // check the contact manfacurer link
  it("check the contact manfacurer link", () => {
        cy.visit("https://source.thenbs.com/en/gb/");
            cy.get('[data-cy="searchFieldSearch"]')
              .first()
              .type("Dyson")
              .type("{enter}");
        
            cy.contains('[data-cy="tabCategory"]', "Manufacturers").click();
            // Page title changed. The page should have `title` value
            cy.title().should("eq", 'Manufacturers matching "Dyson" | NBS Source');
        
            cy.contains("cirrus-search-result-tile-container a", "Dyson").click();
            cy.url().should("include", "/manufacturer/dyson");
        cy.get('button.contact-button span.mdc-button__label').should('have.text', ' Contact manufacturer ');
        cy.get('button.contact-button span.mdc-button__label').should('be.visible');
  });

});
