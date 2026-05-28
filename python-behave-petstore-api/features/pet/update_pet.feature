Feature: Pet API Update endpoint tests

  @pet @positive @contract
  Scenario Outline: Update a new pet via filling various fields
    Given I set URL and headers for Petstore API "pet" endpoint
    And I get prefilled json body from file "create_pet_request.json"
    And I check json body
    And I perform POST request
    And I should see response code is "200"
    And I set "id" to "<id>" as "number" in request body
    And I set "category.id" to "<categoryId>" as "number" in request body
    And I set "category.name" to "<categoryName>" as "string" in request body
    And I set "name" to "<name>" as "string" in request body
    And I set "photoUrls[0]" to "<photoUrls1>" as "string" in request body
    And I set "photoUrls[1]" to "<photoUrls2>" as "string" in request body
    And I set "tags[0].id" to "<tagsId>" as "number" in request body
    And I set "tags[0].name" to "<tagsName>" as "string" in request body
    And I set "status" to "<status>" as "string" in request body
    When I perform PUT request
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

    # examples for updating any of json input fields one by one and all together
    Examples:
      | id | categoryId | categoryName | name   | photoUrls1         | photoUrls2         | tagsId | tagsName | status  |
      | 1  | 3          | cat 3        | pekmez | googlephotos12.com | googlephotos22.com | 32     | tag 32   | pending |
      | 1  | 3          | SKIP         | SKIP   | SKIP               | SKIP               | SKIP   | SKIP     | SKIP    |
      | 1  | SKIP       | cat 3        | SKIP   | SKIP               | SKIP               | SKIP   | SKIP     | SKIP    |
      | 1  | SKIP       | SKIP         | pekmez | SKIP               | SKIP               | SKIP   | SKIP     | SKIP    |
      | 1  | SKIP       | SKIP         | SKIP   | googlephotos12.com | SKIP               | SKIP   | SKIP     | SKIP    |
      | 1  | SKIP       | SKIP         | SKIP   | googlephotos.com   | googlephotos22.com | SKIP   | SKIP     | SKIP    |
      | 1  | SKIP       | SKIP         | SKIP   | SKIP               | SKIP               | 32     | SKIP     | SKIP    |
      | 1  | SKIP       | SKIP         | SKIP   | SKIP               | SKIP               | SKIP   | tag 32   | SKIP    |
      | 1  | SKIP       | SKIP         | SKIP   | SKIP               | SKIP               | SKIP   | SKIP     | pending |


  @pet @negative
  Scenario Outline: Try to update a pet with invalid id
    Given I set URL and headers for Petstore API "pet" endpoint
    And I get prefilled json body from file "create_pet_request.json"
    And I check json body
    And I perform POST request
    And I should see response code is "200"
    And I set "id" to "<id>" as "number" in request body
    And I set "category.id" to "<categoryId>" as "number" in request body
    And I set "category.name" to "<categoryName>" as "string" in request body
    And I set "name" to "<name>" as "string" in request body
    And I set "photoUrls[0]" to "<photoUrls1>" as "string" in request body
    And I set "photoUrls[1]" to "<photoUrls2>" as "string" in request body
    And I set "tags[0].id" to "<tagsId>" as "number" in request body
    And I set "tags[0].name" to "<tagsName>" as "string" in request body
    And I set "status" to "<status>" as "string" in request body
    When I perform PUT request
    Then I should see response code is "<http_code>"

    Examples:
      | id        | http_code | categoryId | categoryName | name   | photoUrls1         | photoUrls2         | tagsId | tagsName | status  |
      | -1        | 400       | 3          | cat 3        | pekmez | googlephotos12.com | googlephotos22.com | 32     | tag 32   | pending |
      | 234234234 | 404       | 3          | cat 3        | pekmez | googlephotos12.com | googlephotos22.com | 32     | tag 32   | pending |


  @pet @negative
  Scenario Outline: Try to update a pet with invalid values
    Given I set URL and headers for Petstore API "pet" endpoint
    And I get prefilled json body from file "create_pet_request.json"
    And I perform POST request
    And I should see response code is "200"
    And I set "id" to "<id>" as "number" in request body
    And I set "category.id" to "<categoryId>" as "number" in request body
    And I set "category.name" to "<categoryName>" as "string" in request body
    And I set "name" to "<name>" as "string" in request body
    And I set "photoUrls[0]" to "<photoUrls1>" as "string" in request body
    And I set "photoUrls[1]" to "<photoUrls2>" as "string" in request body
    And I set "tags[0].id" to "<tagsId>" as "number" in request body
    And I set "tags[0].name" to "<tagsName>" as "string" in request body
    And I set "status" to "<status>" as "string" in request body
    When I perform PUT request
    Then I should see response code is "<http_code>"

    Examples:
      | id        | http_code | categoryId | categoryName | name   | photoUrls1         | photoUrls2         | tagsId | tagsName | status  |
      | 1        | 400       | 3          | cat 3        | pekmez | googlephotos12.com | googlephotos22.com | 32     | tag 32   | pending |


  # TODO: fine tune the scenarios. I have added these scenarios to show the coverage approach.
  @todo @negative
  Scenario Outline: Try to update a pet with invalid values
    Given I want to check "<testReason>"
    And I set URL and headers for Petstore API "pet" endpoint
    And I get prefilled json body from file "create_pet_request.json"
    And I perform POST request
    And I should see response code is "200"
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
    When I perform PUT request
    Then I should see response code is "405"

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
