# Playwright Test Project

This project is a test automation framework using Playwright and TypeScript, designed to automate the testing of the website insiderone.com. It implements the Page Object Model (POM) for better organization and maintainability of test scripts.

## Project Structure

```
playwright-test-project
├── src
│   ├── pages
│   │   ├── BasePage.ts       # Base class for page objects
│   │   └── HomePage.ts       # Home page specific actions and elements
│   ├── tests
│   │   └── homePage.spec.ts   # Test suite for the home page
│   └── utils
│       └── helpers.ts        # Utility functions for tests
├── playwright.config.ts       # Playwright configuration file
├── package.json               # NPM configuration file
├── tsconfig.json              # TypeScript configuration file
└── README.md                  # Project documentation
```

## Setup Instructions

1. **Clone the repository:**
   ```
   git clone <repository-url>
   cd playwright-ui-automation-careers
   ```

2. **Install dependencies:**
   ```
   npm install
   ```

3. **Run the tests:**
   ```
   npx playwright test
   ```

## Writing Tests

- Tests are located in the `src/tests` directory.
- Each test file should correspond to a specific page or feature.
- Use the Page Object Model to organize your tests and page interactions.

## Utilities

- Utility functions can be found in `src/utils/helpers.ts`. These can be used across different test files to avoid code duplication.

## Contributing

Feel free to submit issues or pull requests for improvements or bug fixes.