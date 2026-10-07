Feature: DysonManufacturePage

    Feature Description - regression tests on the Dyson manufacture page.

    Background:
    Given I am on the Dyson manufacturer page

    Scenario: the page heading show the manufacurer name
    Then the page heading is "Dyson"
    
    Scenario: check the Dyson telephone number
    Then the telephone number is "0800 298 0298"

    Scenario: check the Dyson website link
    Then the website link should be visible
    And to have text " website "
    And to have href "https://www.dyson.co.uk/commercial/overview"
    And opens up a new tab when clicked
    And has title "visit https://www.dyson.co.uk/commercial/overview"




