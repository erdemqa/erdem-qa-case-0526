import { Page } from 'playwright'; // Import the Page type from Playwright

export class BasePage {
    protected page: Page; // Use the correct type for the page property

    constructor(page: Page) {
        this.page = page;
    }

    async navigate(url: string) {
        await this.page.goto(url);
    }

    async waitForElement(selector: string) {
        await this.page.waitForSelector(selector);
    }
}