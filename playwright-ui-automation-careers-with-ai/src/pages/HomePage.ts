import { Locator } from 'playwright';
import { expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
    private headerSelector = 'h1';
    private cookieConsentSelector = this.page.getByRole('dialog', { name: 'cookieconsent' });
    private cookieConsentAcceptButtonSelector = this.cookieConsentSelector.getByRole('button', { name: 'Accept All' });
    private sections = this.page.locator('section');
    private careersLinkLocator = this.page.locator('a[href*="/careers"]').first();

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

    // Enhanced methods for comprehensive testing
    async isCookiePopupVisible(): Promise<boolean> {
        return await this.cookieConsentSelector.isVisible().catch(() => false);
    }

    async getPageTitle(): Promise<string> {
        return await this.page.title();
    }

    async getPageURL(): Promise<string> {
        return this.page.url();
    }

    async isHomePageHeaderVisible(): Promise<boolean> {
        return await this.page.locator(this.headerSelector).isVisible();
    }

    async getSectionsCount(): Promise<number> {
        return await this.sections.count();
    }

    async waitForHomePageToLoad(timeout: number = 5000): Promise<void> {
        await this.page.waitForLoadState('networkidle', { timeout });
    }

    async navigateFromHomeToCareers(): Promise<void> {
        await this.careersLinkLocator.click();
    }

    async isCareersLinkVisible(): Promise<boolean> {
        return await this.careersLinkLocator.isVisible().catch(() => false);
    }

    async clickCareersLink(): Promise<void> {
        await this.careersLinkLocator.click();
    }

    async expectPageUrlContains(urlPart: string): Promise<void> {
        await expect(this.page).toHaveURL(new RegExp(urlPart));
    }

    async rejectCookiesIfAvailable(): Promise<boolean> {
        const rejectButton = this.cookieConsentSelector.getByRole('button', { name: /reject|decline/i });
        if (await rejectButton.isVisible().catch(() => false)) {
            await rejectButton.click();
            return true;
        }
        return false;
    }

    async getCookiePopupText(): Promise<string | null> {
        return await this.cookieConsentSelector.textContent();
    }

    async getAllSectionHeadings(): Promise<string[]> {
        return await this.page.locator('section h1, section h2, section h3').evaluateAll(
            (headings) => headings.map((h) => h.textContent?.trim() ?? '').filter(Boolean)
        );
    }

    async navigateToCareersPage(careersPageUrl: string): Promise<void> {
        await this.page.goto(careersPageUrl, { waitUntil: 'domcontentloaded' });
    }

    async getPageLoadTime(): Promise<number> {
        return await this.page.evaluate(() => {
            const perfData = performance.timing;
            return perfData.loadEventEnd - perfData.navigationStart;
        });
    }
}