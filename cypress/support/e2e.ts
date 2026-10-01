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

// 'fullPage' is NOT used here: Cypress's scroll-and-stitch fullPage capture
// has a confirmed bug on this page (and reproduces on both Electron and
// Edge/Chromium) where it duplicates the header partway down the stitched
// image, even though only one header element ever exists in the DOM -
// verified directly, not just a CSS/sticky-positioning issue. 'viewport'
// captures the above-the-fold area in one shot with no stitching involved.
addCompareSnapshotCommand({
  capture: 'viewport',
  errorThreshold: 1, // % of differing pixels tolerated before a test fails
  pixelmatchOptions: { threshold: 0.2 }, // per-pixel sensitivity, absorbs minor anti-aliasing noise
})
