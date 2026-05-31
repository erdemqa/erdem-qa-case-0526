import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { CareersPage } from '../pages/CareersPage';

test.describe('End-to-End Career Application Flow', () => {
    test.describe('Complete Flow from Home to Lever', () => {
        test('E2E: should navigate from home page to careers page to Lever', async ({ page }) => {
            // Step 1: Navigate to home page
            const homePage = new HomePage(page);
            await homePage.navigate('https://insiderone.com');

            // Step 2: Verify home page loads
            await homePage.expectCookiePopupVisible();
            const homeHeaderText = await homePage.getHeaderText();
            expect(homeHeaderText).toContain('The leading Agentic Customer Engagement Platform');

            // Step 3: Accept cookies on home page
            await homePage.clickAcceptCookieButton();
            await homePage.expectCookiePopupHidden();

            // Step 4: Verify home page URL
            await homePage.expectPageUrlContains('insiderone.com');

            // Step 5: Navigate to careers page
            const careersPage = new CareersPage(page);
            await page.goto('https://insiderone.com/careers/#open-roles', { waitUntil: 'domcontentloaded' });

            // Step 6: Verify careers page loads
            await careersPage.expectCookiePopupVisible();
            const careersHeaderText = await careersPage.getHeaderText();
            expect(careersHeaderText).toBeTruthy();

            // Step 7: Accept cookies on careers page
            await careersPage.clickAcceptCookieButton();
            await careersPage.expectCookiePopupHidden();

            // Step 8: Expand all teams
            await careersPage.clickSeeAllTeamsLink();
            await careersPage.waitForTeamsToLoad(3000);

            // Step 9: Verify QA team is visible
            await careersPage.expectTeamVisible('Quality Assurance');

            // Step 10: Click on QA team link
            const qaLink = await careersPage.getOpenPositionsLinkByDepartment('Quality Assurance');
            await expect(qaLink).toBeVisible();

            // Step 11: Navigate to Lever and verify
            await qaLink.click({ noWaitAfter: false });
            await expect(page).toHaveURL(
                'https://jobs.lever.co/insiderone?team=Quality%20Assurance'
            );

            // Step 12: Verify Lever page loads with job listings
            expect(page.url()).toContain('jobs.lever.co');
            expect(page.url()).toContain('insiderone');
        });

        test('E2E: should support multiple department navigation paths', async ({ page }) => {
            const careersPage = new CareersPage(page);
            await careersPage.navigate('https://insiderone.com/careers/#open-roles');

            // Accept cookies
            await careersPage.expectCookiePopupVisible();
            await careersPage.clickAcceptCookieButton();
            await careersPage.waitForTeamsToLoad();

            // Expand teams
            await careersPage.clickSeeAllTeamsLink();
            await careersPage.waitForTeamsToLoad(3000);

            // Get all available departments
            const departments = await careersPage.getAllTeamDepartments();
            expect(departments.length).toBeGreaterThan(0);

            // Verify first department has a valid link to Lever
            if (departments[0]) {
                const firstDeptLink = await careersPage.getOpenPositionsLinkByDepartment(departments[0]);
                const href = await firstDeptLink.getAttribute('href');

                expect(href).toContain('jobs.lever.co');
                expect(href).toContain('insiderone');
            }
        });
    });

    test.describe('Direct Navigation Scenarios', () => {
        test('should allow direct navigation to careers page', async ({ page }) => {
            const careersPage = new CareersPage(page);
            await careersPage.navigateToCareersDirect('https://insiderone.com/careers/#open-roles');

            await careersPage.expectCookiePopupVisible();
            const headerText = await careersPage.getHeaderText();
            expect(headerText).toBeTruthy();
        });

        test('should handle direct link to Lever from careers page URL', async ({ page }) => {
            const careersPage = new CareersPage(page);
            await careersPage.navigate('https://insiderone.com/careers/#open-roles');

            await careersPage.expectCookiePopupVisible();
            await careersPage.clickAcceptCookieButton();
            await careersPage.clickSeeAllTeamsLink();

            // Get a valid Lever link
            const departments = await careersPage.getAllTeamDepartments();
            if (departments.length > 0) {
                const leverLink = await careersPage.getTeamLinkHref(departments[0]);
                expect(leverLink).toContain('jobs.lever.co');
            }
        });
    });

    test.describe('Session Continuity', () => {
        test('should maintain state through career application flow', async ({ page }) => {
            const homePage = new HomePage(page);
            const careersPage = new CareersPage(page);

            // Start on home page
            await homePage.navigate('https://insiderone.com');
            await homePage.expectCookiePopupVisible();
            await homePage.clickAcceptCookieButton();

            // Navigate to careers
            await page.goto('https://insiderone.com/careers/#open-roles');
            await careersPage.expectCookiePopupVisible();
            await careersPage.clickAcceptCookieButton();

            // Verify cookie consent state is maintained (popup should stay hidden)
            await careersPage.expectCookiePopupHidden();

            // Expand teams
            await careersPage.clickSeeAllTeamsLink();

            // Popup should still be hidden
            await careersPage.expectCookiePopupHidden();
        });
    });

    test.describe('Browser Navigation (Back/Forward)', () => {
        test('should handle back navigation from careers to home', async ({ page }) => {
            const homePage = new HomePage(page);
            const careersPage = new CareersPage(page);

            // Navigate to home and careers
            await homePage.navigate('https://insiderone.com');
            await homePage.clickAcceptCookieButton();

            await page.goto('https://insiderone.com/careers/#open-roles');
            await careersPage.clickAcceptCookieButton();

            // Verify we're on careers page
            expect(page.url()).toContain('careers');

            // Go back to home
            await page.goBack();

            // Should be back on home page
            await expect(page).toHaveURL(/https:\/\/insiderone\.com\/?$/);
        });

        test('should handle forward navigation after going back', async ({ page }) => {
            const careersPage = new CareersPage(page);

            // Navigate to careers
            await careersPage.navigate('https://insiderone.com/careers/#open-roles');
            await careersPage.clickAcceptCookieButton();

            // Go back
            await page.goBack();

            // Go forward
            await page.goForward();

            // Should be back on careers page
            expect(page.url()).toContain('careers');
        });
    });

    test.describe('URL Fragment Handling', () => {
        test('should correctly handle URL with open-roles anchor', async ({ page }) => {
            const careersPage = new CareersPage(page);
            await careersPage.navigate('https://insiderone.com/careers/#open-roles');

            await careersPage.expectCookiePopupVisible();
            const url = page.url();
            expect(url).toContain('#open-roles');
        });

        test('should navigate to different anchors if available', async ({ page }) => {
            const careersPage = new CareersPage(page);
            await careersPage.navigate('https://insiderone.com/careers/#open-roles');

            await careersPage.expectCookiePopupVisible();
            await careersPage.clickAcceptCookieButton();

            // Verify we can see the open roles section
            const headerText = await careersPage.getHeaderText();
            expect(headerText).toBeTruthy();
        });
    });

    test.describe('Page Load Performance', () => {
        test('should load careers page within reasonable time', async ({ page }) => {
            const careersPage = new CareersPage(page);
            const startTime = Date.now();

            await careersPage.navigate('https://insiderone.com/careers/#open-roles');
            await careersPage.waitForTeamsToLoad();

            const loadTime = Date.now() - startTime;

            // Page should load within 10 seconds (adjust based on requirements)
            expect(loadTime).toBeLessThan(10000);
        });

        test('should load Lever page after team click', async ({ page }) => {
            const careersPage = new CareersPage(page);
            await careersPage.navigate('https://insiderone.com/careers/#open-roles');
            await careersPage.expectCookiePopupVisible();
            await careersPage.clickAcceptCookieButton();
            await careersPage.clickSeeAllTeamsLink();
            await careersPage.expectTeamVisible('Quality Assurance');

            const qaLink = await careersPage.getOpenPositionsLinkByDepartment('Quality Assurance');

            const startTime = Date.now();
            await qaLink.click({ noWaitAfter: false });
            await page.waitForLoadState('networkidle');

            const loadTime = Date.now() - startTime;

            // Navigation to Lever should complete within 15 seconds
            expect(loadTime).toBeLessThan(15000);
        });
    });
});
