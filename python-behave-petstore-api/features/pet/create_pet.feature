Feature: Pet API Create endpoint tests

  @pet @positive @contract
  Scenario Outline: Create a new pet via filling various fields
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
    When I perform POST request
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

    # examples for all fields filled and cases of missing any of json input fields
    Examples:
      | id   | categoryId | categoryName | name  | photoUrls1       | photoUrls2        | tagsId | tagsName | status    |
      | 1    | 2          | cat 2        | tahin | googlephotos.com | googlephotos2.com | 3      | tag 3    | available |
      | SKIP | 2          | cat 2        | tahin | googlephotos.com | googlephotos2.com | 3      | tag 3    | available |
      | 1    | SKIP       | cat 2        | tahin | googlephotos.com | googlephotos2.com | 3      | tag 3    | available |
      | 1    | 2          | SKIP         | tahin | googlephotos.com | googlephotos2.com | 3      | tag 3    | available |
      | 1    | 2          | cat 2        | SKIP  | googlephotos.com | googlephotos2.com | 3      | tag 3    | available |
      | 1    | 2          | cat 2        | tahin | SKIP             | SKIP              | 3      | tag 3    | available |
      | 1    | 2          | cat 2        | tahin | googlephotos.com | SKIP              | 3      | tag 3    | available |
      | 1    | 2          | cat 2        | tahin | googlephotos.com | googlephotos2.com | SKIP   | tag 3    | available |
      | 1    | 2          | cat 2        | tahin | googlephotos.com | googlephotos2.com | 3      | SKIP     | available |
      | 1    | 2          | cat 2        | tahin | googlephotos.com | googlephotos2.com | 3      | tag 3    | SKIP      |


  @pet @negative
  Scenario: try to create a new pet with empty body
    Given I set URL and headers for Petstore API "pet" endpoint
    And I check json body
    When I perform POST request
    Then I should see response code is "400"


  @pet @negative
  Scenario Outline: try to add a duplicate pet with same id
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
    And I set "name" to "duplicateName" as "string" in request body
    When I perform POST request
    Then I should see response code is "400"

    Examples:
      | id | categoryId | categoryName | name  | photoUrls1       | photoUrls2        | tagsId | tagsName | status    |
      | 1  | 2          | cat 2        | tahin | googlephotos.com | googlephotos2.com | 3      | tag 3    | available |


  # TODO: fine tune the scenarios. I have added these scenarios to show the coverage approach.
  @todo @negative
  Scenario Outline: try to add a pet with invalid values
    Given I want to check "<testReason>"
    And I set URL and headers for Petstore API "pet" endpoint
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
    When I perform POST request
    Then I should see response code is "400"

    Examples:
      | testReason     | id  | categoryId | categoryName | name                                                    | photoUrls1                       | photoUrls2        | tagsId | tagsName | status            |
      | invalidId      | -1  | 2          | cat 2        | tahin                                                   | googlephotos.com                 | googlephotos2.com | 3      | tag 3    | available         |
      | invalidId      | asd | 2          | cat 2        | tahin                                                   | googlephotos.com                 | googlephotos2.com | 3      | tag 3    | available         |
      | invalidCatId   | 1   | -1         | cat 2        | tahin                                                   | googlephotos.com                 | googlephotos2.com | 3      | tag 3    | available         |
      | invalidCatId   | 1   | asd        | cat 2        | tahin                                                   | googlephotos.com                 | googlephotos2.com | 3      | tag 3    | available         |
      | invalidCatName | 1   | 2          | NULL         | tahin                                                   | googlephotos.com                 | googlephotos2.com | 3      | tag 3    | available         |
      | InjectionName  | 1   | 2          | cat 2        | <script>alert('Your account is compromised!');</script> | googlephotos.com                 | googlephotos2.com | 3      | tag 3    | available         |
      | InjectionURL   | 1   | 2          | cat 2        | tahin                                                   | <script>alert('boom!');</script> | googlephotos2.com | 3      | tag 3    | available         |
      | duplicateURL   | 1   | 2          | cat 2        | tahin                                                   | googlephotos2.com                | googlephotos2.com | 3      | tag 3    | available         |
      | invalidTagId   | 1   | 2          | cat 2        | tahin                                                   | googlephotos.com                 | googlephotos2.com | -1     | tag 3    | available         |
      | invalidTagId   | 1   | 2          | cat 2        | tahin                                                   | googlephotos.com                 | googlephotos2.com | asd    | tag 3    | available         |
      | invalidStatus  | 1   | 2          | cat 2        | tahin                                                   | googlephotos.com                 | googlephotos2.com | 3      | tag 3    | notExistingStatus |

