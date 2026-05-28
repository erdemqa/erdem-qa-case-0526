import { Locator } from 'playwright';
import { expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
    private headerSelector = 'h1';
    private cookieConsentSelector = this.page.getByRole('dialog', { name: 'cookieconsent' });
    private cookieConsentAcceptButtonSelector = this.cookieConsentSelector.getByRole('button', { name: 'Accept All' });
    private sections = this.page.locator('section');

    async getHeaderText(): Promise<string> {
        return (await this.page.textContent(this.headerSelector)) ?? 'Default Header Text';
    }

    async clickAcceptCookieButton(): Promise<void> {
        await this.cookieConsentAcceptButtonSelector.click();
    }

    async expectCookiePopupVisible(): Promise<void> {
        await expect(this.cookieConsentSelector).toBeVisible();
    }

    async expectCookiePopupHidden(): Promise<void> {
        await expect(this.cookieConsentSelector).toBeHidden();
    }

    async getSectionsList(): Promise<string[]> {
        return (await this.page.locator('section').evaluateAll(
            (sections) => sections.map((section) => section.className.trim())
        ));

    }

    async getSectionByIndex(index: number): Promise<Locator> {
        return this.sections.nth(index);
    }

    async getScreenshotFileName(className: string, index: number): Promise<string> {
        const formattedName = className
            .replace(/\s+/g, '-')
            .replace(/[^\w-]/g, '')
            .toLowerCase();

        return `${index + 1}-${formattedName}.png`;
    }
}