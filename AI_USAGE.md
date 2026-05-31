## 1. definitions:

context: the specialization space provided to ai agent in which the task domain is better understood and implicit details are provided to agent
prompt: task specific details provided in text
skill: capabilities that an agent possess to achieve the prompt in context. such as executing codes or commands
agent: ai model that utilizes its skills to achieve provided prompt in given context without human interaction. it may take decisions and provide feedback for given context

## 2. validation:

after i got the ai output I have read the steps it generated and evaluated the approach first. After that I have checked the offered coverage for those approach. After that I have checked the tests for coverage and their implementation by executing them

I have rejected the parts in which there were invalid class or functions or that fails due to invalid locators.

For rejected parts I have tried to fix them by ai however at some point free usage has ended and I have removed the low impact scenarios.

## AI weakness and fix

In this task AI was weak verifying the initially generated scenarios. Agent suggested that the newly added scenarios are valid however there were some tests that has invalid page methods. I have added specific fix steps after that such as "you have used abc method in this step however there is no method in page class". after that i have run debug and made manual fixes

## AI or Manual

When the task is too broad, too much implicit domain info or flow is too complex. i prefer to split task manually and construct the backbone manually after that I prefer to use AI for small fixes or repetative tasks.



