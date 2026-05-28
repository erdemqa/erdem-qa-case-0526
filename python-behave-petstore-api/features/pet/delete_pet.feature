Feature: Pet API Delete endpoint tests

  @pet @positive @contract
  Scenario Outline: Delete a new pet
    Given I set URL and headers for Petstore API "pet" endpoint
    And I get prefilled json body from file "create_pet_request.json"
    And I set "id" to "<id>" as "number" in request body
    And I check json body
    And I perform POST request
    And I should see response code is "200"
    And I get id value from "id" path in response body
    And I add "CREATED_PET_ID" value to url
    When I perform DELETE request
    Then I should see response code is "200"
    And I should see response body matches with the schema file "delete_pet_response.json"
    And I should see response contains "<code>" value in "code" jmespath
    And I should see response contains "<type>" value in "type" jmespath
    And I should see response contains "<id>" value in "message" jmespath

    Examples:
      | id | code | type    |
      | 5  | 200  | unknown |


  @pet @negative @wip
  Scenario Outline: Try to delete a new pet with invalid/not existing id
    Given I set URL and headers for Petstore API "pet" endpoint
    And I add "<id>" value to url
    When I perform DELETE request
    Then I should see response code is "<error_code>"

    Examples:
      | id       | error_code |
      | 12352323 | 404        |
      | asdasd   | 404        |
      | EMPTY    | 405        |


