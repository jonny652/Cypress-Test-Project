/// <reference types="cypress" />

context('Misc', () => {
  beforeEach(() => {
    cy.visit('https://example.cypress.io/commands/misc')
  })

  it('cy.task() - execute a system command', () => {
    // `cy.exec()` was removed in Cypress 16 - use cy.task() instead, which
    // runs in Node and does not depend on the OS or shell of the machine.
    // The 'exec' task is registered in cypress.config.ts.
    // https://on.cypress.io/task

    // we can use Cypress.platform string to
    // select appropriate command
    // https://on.cypress/io/platform
    cy.log(`Platform ${Cypress.platform} architecture ${Cypress.arch}`)

    cy.task('exec', 'echo Jane Lane')
      .its('stdout').should('contain', 'Jane Lane')

    const readConfig = Cypress.platform === 'win32' ? 'type' : 'cat'

    // quoted - the project path can contain spaces
    cy.task('exec', `${readConfig} "${Cypress.config('configFile')}"`)
      .its('stderr').should('be.empty')

    cy.log(`Cypress version ${Cypress.version}`)

    cy.task('exec', Cypress.platform === 'win32' ? 'cd' : 'pwd')
      .its('exitCode').should('eq', 0)
  })

  it('cy.focused() - get the DOM element that has focus', () => {
    // https://on.cypress.io/focused
    cy.get('.misc-form').find('#name').click()
    cy.focused().should('have.id', 'name')

    cy.get('.misc-form').find('#description').click()
    cy.focused().should('have.id', 'description')
  })

  context('Cypress.Screenshot', function () {
    it('cy.screenshot() - take a screenshot', () => {
      // https://on.cypress.io/screenshot
      cy.screenshot('my-image')
    })

    it('Cypress.Screenshot.defaults() - change default config of screenshots', function () {
      Cypress.Screenshot.defaults({
        blackout: ['.foo'],
        capture: 'viewport',
        clip: { x: 0, y: 0, width: 200, height: 200 },
        scale: false,
        disableTimersAndAnimations: true,
        screenshotOnRunFailure: true,
        onBeforeScreenshot () { },
        onAfterScreenshot () { },
      })
    })
  })

  it('cy.wrap() - wrap an object', () => {
    // https://on.cypress.io/wrap
    cy.wrap({ foo: 'bar' })
      .should('have.property', 'foo')
      .and('include', 'bar')
  })
})
