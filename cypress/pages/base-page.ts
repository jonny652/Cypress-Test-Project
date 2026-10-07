/// <reference types="cypress" />
// BasePage holds the locators and methods shared by every page in the app
// other page objects should extend this class, e.g. `class HomePage extends BasePage`
 
export class BasePage {
 
  // ==========================================================================
  // LOCATORS
  // store selectors here as readonly properties so they are defined once
  // ==========================================================================
 
  readonly searchField = '[data-cy="searchFieldSearch"]';
  readonly signInButton = "Sign in";
 
  // ==========================================================================
  // METHODS
  // store reusable actions and assertions here, using the locators above
  // ==========================================================================
 
  // type a search term into the visible search box and hit enter
  searchFor(term: string) {
    cy.get(this.searchField)
      .filter(':visible')
      .type(`${term}{enter}`, { timeout: 10000 });
  }

  // click the sign in button
  clickSignInButton() {
    cy.get(this.signInButton).click();
  }

    // navigate to nbs homepage
  navigateToHomePage() {
    cy.visit('/');
    cy.url().should('eq', 'https://source.thenbs.com/en/gb');
  }

 
}