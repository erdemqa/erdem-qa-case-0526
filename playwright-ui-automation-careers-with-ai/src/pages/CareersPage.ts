import { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class CareersPage extends BasePage {

    private headerSelector = 'h1';
    private cookieConsentLocator = this.page.getByRole('dialog', { name: 'cookieconsent', });
    private cookieConsentAcceptButtonLocator = this.cookieConsentLocator.getByRole('button', { name: 'Accept All', });
    private teamsLocator = this.page.locator('.insiderone-icon-cards-grid-item');
    private seeAllTeamsLinkLocator = this.page.getByRole('link', { name: 'See all teams', });

    async getHeaderText(): Promise<string> {
        return (await this.page.textContent(this.headerSelector)) ?? 'Default Header Text';
    }

    async clickAcceptCookieButton(): Promise<void> {
        await this.cookieConsentAcceptButtonLocator.click();
    }

    async expectCookiePopupVisible(): Promise<void> {
        await expect(this.cookieConsentLocator).toBeVisible();
    }

    async expectCookiePopupHidden(): Promise<void> {
        await expect(this.cookieConsentLocator).toBeHidden();
    }

    async clickSeeAllTeamsLink(): Promise<void> {
        await this.seeAllTeamsLinkLocator.click();
    }

    async getShownTeamsTitles(): Promise<string[]> {
        return await this.teamsLocator.locator('h3').evaluateAll((elements) =>
            elements.map((el) => el.textContent?.trim() ?? '')
        );
    }

    getTeamCardByTitle(title: string): Locator {
        return this.teamsLocator.filter({
            has: this.page.getByRole('heading', { name: title }),
        });
    }

    async getTeamCardByDepartment(department: string): Promise<Locator> {
        // Try both data-department attribute and title-based lookup for reliability
        let card = this.page.locator(`.insiderone-icon-cards-grid-item[data-department="${department}"]`);
        
        // If data-department doesn't work, fall back to finding by title
        const count = await card.count();
        if (count === 0) {
            card = this.getTeamCardByTitle(department);
        }
        
        return card;
    }

    async getOpenPositionsLinkByDepartment(department: string): Promise<Locator> {
        // Get the team card using the more robust method
        const card = await this.getTeamCardByDepartment(department);
        
        // Find the link/button within the card
        return card.locator('a, button').first();
    }

    async expectTeamVisible(title: string): Promise<void> {
        await expect(this.getTeamCardByTitle(title)).toBeVisible();
    }

    async expectTeamNotVisible(title: string): Promise<void> {
        await expect(this.getTeamCardByTitle(title)).toHaveCount(0);
    }

    async expectTeamCount(count: number): Promise<void> {
        await expect(this.teamsLocator).toHaveCount(count);
    }

    // Enhanced methods for comprehensive testing
    async isSeeAllTeamsLinkVisible(): Promise<boolean> {
        return await this.seeAllTeamsLinkLocator.isVisible().catch(() => false);
    }

    async isSeeAllTeamsLinkEnabled(): Promise<boolean> {
        return await this.seeAllTeamsLinkLocator.isEnabled().catch(() => false);
    }

    async getInitialTeamsCount(): Promise<number> {
        return await this.teamsLocator.count();
    }

    async getPageTitle(): Promise<string> {
        return await this.page.title();
    }

    async isNavigationUrlValid(expectedUrl: string): Promise<boolean> {
        return this.page.url().includes(expectedUrl);
    }

    async waitForTeamsToLoad(timeout: number = 5000): Promise<void> {
        await this.page.waitForSelector('.insiderone-icon-cards-grid-item', { timeout });
    }

    async clickTeamByTitle(title: string): Promise<void> {
        await this.getTeamCardByTitle(title).click();
    }

    async getTeamLinkHref(department: string): Promise<string | null> {
        const link = (await this.getOpenPositionsLinkByDepartment(department)).last();
        return await link.getAttribute('href');
    }

    async expectPageUrlContains(urlPart: string): Promise<void> {
        await expect(this.page).toHaveURL(new RegExp(urlPart));
    }

    async getAllTeamDepartments(): Promise<string[]> {
        // First try data-department attributes
        const deptsByAttribute = await this.teamsLocator.evaluateAll((elements) =>
            elements.map((el) => el.getAttribute('data-department')).filter(Boolean) as string[]
        );
        
        // If that returns results, use them
        if (deptsByAttribute.length > 0) {
            return deptsByAttribute;
        }
        
        // Fallback: get teams by their title/heading
        return await this.getShownTeamsTitles();
    }

    async getTeamTitleByDepartment(department: string): Promise<string | null> {
        const card = await this.getTeamCardByDepartment(department);
        return await card.locator('h3').textContent();
    }

    async expectTeamCountGreaterThan(count: number): Promise<void> {
        const teamCount = await this.getInitialTeamsCount();
        expect(teamCount).toBeGreaterThan(count);
    }

    async navigateToCareersDirect(url: string): Promise<void> {
        await this.page.goto(url, { waitUntil: 'domcontentloaded' });
    }

    async getCareersPageURL(): Promise<string> {
        return this.page.url();
    }

    async waitForCookiePopup(timeout: number = 5000): Promise<void> {
        await this.page.waitForSelector('[role="dialog"]', { timeout });
    }
}