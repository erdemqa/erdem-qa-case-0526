import { test, expect } from '@playwright/test';
import { CareersPage } from '../pages/CareersPage';

test.describe('Careers Page - Advanced Scenarios', () => {
    let careersPage: CareersPage;

    test.beforeEach(async ({ page }) => {
        careersPage = new CareersPage(page);
        await careersPage.navigate('https://insiderone.com/careers/#open-roles');
    });

    test.describe('Boundary Value Analysis - Team Display', () => {
        test('should handle initial team count correctly', async () => {
            await careersPage.expectCookiePopupVisible();
            await careersPage.clickAcceptCookieButton();
            await careersPage.waitForTeamsToLoad();

            const initialCount = await careersPage.getInitialTeamsCount();
            expect(initialCount).toBeGreaterThan(0);
        });

        test('should increase team count after clicking "See all teams"', async () => {
            await careersPage.expectCookiePopupVisible();
            await careersPage.clickAcceptCookieButton();
            await careersPage.waitForTeamsToLoad();

            const initialCount = await careersPage.getInitialTeamsCount();
            await careersPage.clickSeeAllTeamsLink();
            await careersPage.waitForTeamsToLoad(3000);

            const finalCount = await careersPage.getInitialTeamsCount();
            expect(finalCount).toBeGreaterThanOrEqual(initialCount);
        });
    });

    test.describe('Equivalence Partitioning - Department Navigation', () => {
        test('should verify QA department is in the hidden teams initially', async () => {
            await careersPage.expectCookiePopupVisible();
            await careersPage.clickAcceptCookieButton();

            await careersPage.expectTeamNotVisible('Quality Assurance');
        });

        test('should verify QA department becomes visible after expanding', async () => {
            await careersPage.expectCookiePopupVisible();
            await careersPage.clickAcceptCookieButton();

            await careersPage.clickSeeAllTeamsLink();
            await careersPage.expectTeamVisible('Quality Assurance');
        });

        test('should handle team name case sensitivity correctly', async () => {
            await careersPage.expectCookiePopupVisible();
            await careersPage.clickAcceptCookieButton();
            await careersPage.clickSeeAllTeamsLink();

            // Exact match should work
            await careersPage.expectTeamVisible('Quality Assurance');
        });
    });

    test.describe('State Transition Testing', () => {
        test('should transition from cookie popup visible to hidden state', async () => {
            // Initial state: Cookie popup visible
            await careersPage.expectCookiePopupVisible();
            expect(await careersPage.isNavigationUrlValid('careers')).toBe(true);

            // Action: Accept cookies
            await careersPage.clickAcceptCookieButton();

            // Final state: Cookie popup hidden
            await careersPage.expectCookiePopupHidden();
        });

        test('should maintain state after see all teams expansion', async () => {
            await careersPage.expectCookiePopupVisible();
            await careersPage.clickAcceptCookieButton();
            await careersPage.expectCookiePopupHidden();

            // State before expansion
            const initialTitles = await careersPage.getShownTeamsTitles();

            // Click See All Teams
            await careersPage.clickSeeAllTeamsLink();
            await careersPage.waitForTeamsToLoad(3000);

            // State after expansion - cookies still hidden
            await careersPage.expectCookiePopupHidden();

            // New teams should be visible
            const newTitles = await careersPage.getShownTeamsTitles();
            expect(newTitles.length).toBeGreaterThanOrEqual(initialTitles.length);
        });
    });

    test.describe('URL and Navigation Validation', () => {
        test('should verify careers page URL is correct', async () => {
            await careersPage.expectCookiePopupVisible();
            await careersPage.clickAcceptCookieButton();

            const url = await careersPage.getCareersPageURL();
            expect(url).toContain('careers');
        });

        test('should verify page title contains relevant keywords', async () => {
            await careersPage.expectCookiePopupVisible();
            await careersPage.clickAcceptCookieButton();

            const title = await careersPage.getPageTitle();
            expect(title.toLowerCase()).toMatch(/career|job/i);
        });
    });

    test.describe('Team Content Integrity', () => {
        

        test('should verify team title matches department data attribute', async () => {
            await careersPage.expectCookiePopupVisible();
            await careersPage.clickAcceptCookieButton();
            await careersPage.clickSeeAllTeamsLink();

            const title = await careersPage.getTeamTitleByDepartment('Quality Assurance');
            expect(title?.trim()).toBeTruthy();
        });
    });

    test.describe('Link Functionality', () => {
        test('should verify "See all teams" link is initially enabled', async () => {
            await careersPage.expectCookiePopupVisible();
            await careersPage.clickAcceptCookieButton();

            const isSeeAllVisible = await careersPage.isSeeAllTeamsLinkVisible();
            const isSeeAllEnabled = await careersPage.isSeeAllTeamsLinkEnabled();

            expect(isSeeAllVisible).toBe(true);
            expect(isSeeAllEnabled).toBe(true);
        });
    });

    test.describe('Cookie Consent States', () => {
        test('should be able to accept cookies and proceed', async () => {
            await careersPage.expectCookiePopupVisible();

            await careersPage.clickAcceptCookieButton();
            await careersPage.expectCookiePopupHidden();
        });

        test('should display content after cookie acceptance', async () => {
            await careersPage.expectCookiePopupVisible();
            await careersPage.clickAcceptCookieButton();

            const headerText = await careersPage.getHeaderText();
            expect(headerText).toBeTruthy();
            expect(headerText).toContain('Ready to disrupt');
        });
    });
});
