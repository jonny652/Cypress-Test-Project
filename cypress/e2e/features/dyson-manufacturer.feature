Feature: Dyson manufacturer page
  Cucumber version of cypress/e2e/1-getting-started/first-test.cy.ts.
  Each "Rule" matches a describe() block in that file, and its "Background"
  runs before every scenario in the rule (like beforeEach).
  The code behind each step is in cypress/support/step_definitions.

  Rule: Manufacturer details

    Background:
      Given I am on the Dyson manufacturer page

    Scenario: The page heading shows the manufacturer name
      Then the page heading is "Dyson"

    Scenario: The telephone number is shown and can be called
      Then the telephone number "08003457788" is shown

    Scenario: The website link opens the Dyson website in a new tab
      Then the website link goes to "https://www.dyson.co.uk/commercial/overview"

    Scenario: The contact manufacturer button is shown
      Then the contact manufacturer button is shown

    Scenario: A user can log in
      Then I can log in

  Rule: Authentication session

    Background:
      Given I am logged in

    Scenario: A saved login is reused instead of signing in again
      When I visit the home page
      Then I am not asked to sign in

  Rule: Accessibility

    Background:
      Given I am logged in
      And I am on the Dyson manufacturer page

    Scenario: The manufacturer page is checked for accessibility issues
      Then the page is checked for accessibility issues and saved as "dyson manufacturer page"

  Rule: Visual regression

    Background:
      Given I am logged in
      And I am on the Dyson manufacturer page

    Scenario: The manufacturer page looks the same as its baseline
      Then the page matches the "dyson-manufacturer-page" baseline screenshot

  Rule: Certificates API

    Background:
      Given I am on the Dyson manufacturer page

    Scenario: An empty list of certificates shows a "no results" message
      Given the certificates API returns no certificates
      When I open the Certificates tab
      Then I see the message "Sorry, no results were found"

    # When loading certificates fails, the site currently shows an empty tab
    # with no error message, so these check the page copes without crashing.
    Scenario Outline: The page copes when the certificates API fails with <failure>
      Given the certificates API fails with a <failure>
      When I open the Certificates tab
      Then the certificates request failed with a <failure>
      And no certificates are shown
      And the page heading is "Dyson"

      Examples:
        | failure         |
        | "server error"  |
        | "GraphQL error" |
        | "network error" |

    Scenario: A loading spinner shows while certificates load
      Given the certificates API takes 3 seconds to respond
      When I click the Certificates tab
      Then the loading spinner is shown
      And no certificate cards are shown yet
      When the certificates finish loading
      Then certificate cards are shown
      And the loading spinner is hidden

    Scenario: A certificate from the API is shown with the right details
      Given the certificates API returns only the fake certificate
      When I open the Certificates tab
      Then one certificate card shows the fake certificate's name and type
      And I see the message "Showing 1-1 of 1"

    Scenario: The page asks the API for Dyson's certificates
      Given I am watching the certificates API
      When I open the Certificates tab
      Then the certificates request is for brand "nakAxHWxDZprdqkBaCdn4U" starting from the first page

    Scenario: The page shows every certificate the API returns
      Given I am watching the certificates API
      When I open the Certificates tab
      Then the number of certificate cards matches the API response
