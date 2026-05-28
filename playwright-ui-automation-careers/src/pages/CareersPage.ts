import { Locator } from '@playwright/test';
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
        return this.page.locator(`.insiderone-icon-cards-grid-item[data-department="${department}"]`);
    }

    async getOpenPositionsLinkByDepartment(department: string): Promise<Locator> {
        return (await this.getTeamCardByDepartment(department)).locator('.insiderone-icon-cards-grid-item-btn');
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
}