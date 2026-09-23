/// <reference types="cypress" />

/**
 * Local type declarations for this project.
 */
declare namespace Cypress {
  interface Chainable<Subject = any> {
    /**
     * Custom command added in `cypress_api.cy.ts` - logs the current subject
     * to the browser console and yields it unchanged.
     */
    console(method?: 'log' | 'info' | 'warn' | 'error'): Chainable<Subject>
  }
}
