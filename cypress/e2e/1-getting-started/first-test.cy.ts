/// <reference types="cypress" />


describe("My First Test", () => {
  it("navigate to the dyson homepage and do stuff", () => {
    cy.visit("https://source.thenbs.com/en/gb/");
    cy.get('[data-cy="searchFieldSearch"]')
      .first()
      .type("Dyson")
      .type("{enter}");

    cy.contains('[data-cy="tabCategory"]', 'Manufacturers').click();
    // Page title changed. The page should have `title` value
    cy.title()
      .should('eq', 'Manufacturers matching "Dyson" | NBS Source')
    
    cy.contains('cirrus-search-result-tile-container a', 'Dyson').click();
    cy.url().should('include', '/manufacturer/dyson');
   
  });
});