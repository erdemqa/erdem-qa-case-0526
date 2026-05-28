Feature: Pet API Get Pet endpoint tests

  @pet @positive @contract
  Scenario Outline: Get a newly added pet
    Given I set URL and headers for Petstore API "pet" endpoint
    And I set "id" to "<id>" as "number" in request body
    And I set "category.id" to "<categoryId>" as "number" in request body
    And I set "category.name" to "<categoryName>" as "string" in request body
    And I set "name" to "<name>" as "string" in request body
    And I set "photoUrls[0]" to "<photoUrls1>" as "string" in request body
    And I set "photoUrls[1]" to "<photoUrls2>" as "string" in request body
    And I set "tags[0].id" to "<tagsId>" as "number" in request body
    And I set "tags[0].name" to "<tagsName>" as "string" in request body
    And I set "status" to "<status>" as "string" in request body
    And I check json body
    And I perform POST request
    And I should see response code is "200"
    And I get id value from "id" path in response body
    And I add "CREATED_PET_ID" value to url
    When I perform GET request
    Then I should see response code is "200"
    And I should see response body matches with the schema file "pet_response.json"
    And I should see response contains "<id>" value in "id" jmespath
    And I should see response contains "<categoryId>" value in "category.id" jmespath
    And I should see response contains "<categoryName>" value in "category.name" jmespath
    And I should see response contains "<photoUrls1>" value in "photoUrls[*]" jmespath
    And I should see response contains "<photoUrls2>" value in "photoUrls[*]" jmespath
    And I should see response contains "<tagsId>" value in "tags[0].id" jmespath
    And I should see response contains "<tagsName>" value in "tags[0].name" jmespath
    And I should see response contains "<status>" value in "status" jmespath

    Examples:
      | id | categoryId | categoryName | name   | photoUrls1       | photoUrls2        | tagsId | tagsName | status    |
      | 16 | 2          | cat 2        | pekmez | googlephotos.com | googlephotos2.com | 3      | tag 3    | available |


  @pet @negative
  Scenario Outline: trying to get a pet  with invalid id returns error
    Given I set URL and headers for Petstore API "pet" endpoint
    And I add "<id>" value to url
    When I perform GET request
    Then I should see response code is "<error_code>"

    Examples:
      | id       | error_code |
      | 12352323 | 404        |
      | asdasd   | 404        |
      | EMPTY    | 405        |
