Feature: DysonManufacturePage

    Feature Description - regression tests on the Dyson manufacture page.

    Rule: Manufacturer details

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

    Rule: Authentication session

        Background:
            Given I am signed in

        # 06 check the authentication session/token is reused instead of signing in again
        Scenario: check the authentication session/token is reused instead of signing in again
            When I visit the home page
            Then the sign in button should not be visible

    Rule: Accessability

        Background:
            Given I am on the Dyson manufacturer page

        #07 check accesability of the dyson manufacturer page with axe-core
        Scenario: check accesability of the dyson manufacturer page with axe-core
            Then then accessability violation will be output to the report

    Rule: Visual Regression

        Background:
            Given I am on the Dyson manufacturer page

        #08 check visual regression of the dyson manufacturer page
        Scenario: check visual regression of the dyson manufacturer page
            Then the visual regression test will be output to the report

    Rule: API Testing

        Background:
            Given I am on the Dyson manufacturer page

        #09 check no results message when no certificates are returned from the API
        Scenario: check a no results message is displayed when the certificates payload is empty
            When I intercept the API call to get the certificates and return an empty payload
            Then the page should display a no results message

        #10 check the page copes when the certificates API returns a server error
        Scenario: check the page handles API errors gracefully
            When I intercept the API call to get the certificates and return a server error
            Then the page should display an error message

        #11 check the page copes when the certificates API returns a graphql error
        Scenario: check the page handles graphql errors gracefully
            When I intercept the API call to get the certificates and return a graphql error
            Then the page should handle the graphql error gracefully

        #12 check the load spinner is displayed while pages are loading
        Scenario: check the load spinner is displayed while pages are loading
            When I intercept the API call to get the certificates and delay the response
            Then the load spinner should be displayed while the page is loading

        #13 check the page copes when the connection to the API fails
        Scenario: check the page copes when the connection to the API fails
            When I intercept the API call to get the certificates and simulate a network failure
            Then the page should display and handle the network failure gracefully

        #14 check a certificate from the API is shown with the right details
        Scenario: check a certificate from the API is shown with amended details
            When I intercept the API call to get the certificates and return a certificate with amended details
            Then the page should display the certificate details correctly

        #15 check API response includes the dyson certicicate 
        Scenario:request for certificates includes the Dyson brand

        #16 check the page shows every certificate the API returns
        Scenario: check the page shows every certificate the API returns
            When I intercept the API call to get the certificates and return multiple certificates
            Then the page should display all the certificates correctly