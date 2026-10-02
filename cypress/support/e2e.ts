// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'
import 'cypress-axe'
import { addCompareSnapshotCommand } from 'cypress-visual-regression/dist/command'

// 'fullPage' captures the whole page, top to bottom. checkVisualRegression
// (util/visual-regression.ts) stops the site's sticky header repeating in it.
addCompareSnapshotCommand({
  capture: 'fullPage',
  errorThreshold: 0.0001, // fraction of pixels allowed to differ before a test fails (0.001 = 0.1%)
  pixelmatchOptions: { threshold: 0.2 }, // per-pixel sensitivity, absorbs minor anti-aliasing noise
})
