Feature: DysonManufacturePage

    Feature Description - regression tests on the Dyson manufacture page.

    Background:
    Given I am on the Dyson manufacturer page

    # 01 check the h1 header paragraph
    Scenario: the page heading show the manufacurer name
    Then the page heading is "Dyson"

    # 02 check the dyson telephone number
    Scenario: check the Dyson telephone number
    Then the telephone number is "08003457788"

    # 03 check the dyson website link
    Scenario: check the Dyson website link
    Then the website link should be visible
    And to have text " Website "
    And to have href "https://www.dyson.co.uk/commercial/overview"
    And opens up a new tab when clicked
    And has title "Visit https://www.dyson.co.uk/commercial/overview"

    # 05 check the login works as expected
    Scenario: check the login works as expected
    Given I click the sign in button
    When I enter valid credntials and click the login button
    Then I should be signed in and redirected to the original page


    




