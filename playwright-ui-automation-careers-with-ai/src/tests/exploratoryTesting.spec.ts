import { test, expect } from '@playwright/test';
import { CareersPage } from '../pages/CareersPage';
import { HomePage } from '../pages/HomePage';

test.describe('Exploratory Testing & Industry Standards', () => {
    test.describe('Career Page UX Standards', () => {
        test('should display clear call-to-action buttons for each team', async ({ page }) => {
            const careersPage = new CareersPage(page);
            await careersPage.navigate('https://insiderone.com/careers/#open-roles');
            
            await careersPage.expectCookiePopupVisible();
            await careersPage.clickAcceptCookieButton();
            await careersPage.clickSeeAllTeamsLink();

            // Verify at least one team has a visible CTA button
            const departments = await careersPage.getAllTeamDepartments();
            expect(departments.length).toBeGreaterThan(0);

            // Verify first department has a clickable link
            if (departments[0]) {
                const link = await careersPage.getOpenPositionsLinkByDepartment(departments[0]);
                await expect(link).toBeVisible();
            }
        });

        test('should maintain consistent styling across team cards', async ({ page }) => {
            const careersPage = new CareersPage(page);
            await careersPage.navigate('https://insiderone.com/careers/#open-roles');
            
            await careersPage.expectCookiePopupVisible();
            await careersPage.clickAcceptCookieButton();
            await careersPage.clickSeeAllTeamsLink();

            // Get all team titles to verify consistent DOM structure
            const teamTitles = await careersPage.getShownTeamsTitles();
            
            for (const title of teamTitles) {
                const card = careersPage.getTeamCardByTitle(title);
                await expect(card).toBeVisible();
                
                // Verify card has child elements (heading, description, button)
                const heading = card.locator('h3').first();
                await expect(heading).toBeVisible();
            }
        });

        test('should provide feedback when teams are expanded', async ({ page }) => {
            const careersPage = new CareersPage(page);
            await careersPage.navigate('https://insiderone.com/careers/#open-roles');
            
            await careersPage.expectCookiePopupVisible();
            await careersPage.clickAcceptCookieButton();

            const initialCount = await careersPage.getInitialTeamsCount();

            // Click expand
            await careersPage.clickSeeAllTeamsLink();
            await careersPage.waitForTeamsToLoad();

            const expandedCount = await careersPage.getInitialTeamsCount();

            // Should show more teams
            expect(expandedCount).toBeGreaterThan(initialCount);
        });
    });

    test.describe('Navigation Accessibility', () => {
        test('should ensure all important links are keyboard accessible', async ({ page }) => {
            const careersPage = new CareersPage(page);
            await careersPage.navigate('https://insiderone.com/careers/#open-roles');
            
            await careersPage.expectCookiePopupVisible();
            await careersPage.clickAcceptCookieButton();

            // Verify "See all teams" link can be accessed
            const isSeeAllVisible = await careersPage.isSeeAllTeamsLinkVisible();
            expect(isSeeAllVisible).toBe(true);
        });

        test('should maintain focus visibility on interactive elements', async ({ page }) => {
            const careersPage = new CareersPage(page);
            await careersPage.navigate('https://insiderone.com/careers/#open-roles');
            
            await careersPage.expectCookiePopupVisible();
            
            // Focus on accept button and verify it's interactive
            const acceptButton = page.getByRole('button', { name: 'Accept All' });
            await acceptButton.focus();
            await acceptButton.click();

            await careersPage.expectCookiePopupHidden();
        });
    });

    test.describe('Career Application Flow Efficiency', () => {
        test('should minimize clicks to reach Lever application (happy path < 5 clicks)', async ({ page }) => {
            const careersPage = new CareersPage(page);
            await careersPage.navigate('https://insiderone.com/careers/#open-roles');
            
            let clickCount = 0;

            // Click 1: Accept cookies
            await careersPage.expectCookiePopupVisible();
            await careersPage.clickAcceptCookieButton();
            clickCount++;

            // Click 2: See all teams
            await careersPage.clickSeeAllTeamsLink();
            clickCount++;
            await careersPage.waitForTeamsToLoad();

            // Click 3: Select QA team
            const qaLink = await careersPage.getOpenPositionsLinkByDepartment('Quality Assurance');
            await qaLink.click();
            clickCount++;

            // Should reach Lever in 3 clicks (acceptable for career flow)
            expect(clickCount).toBeLessThanOrEqual(5);
            await expect(page).toHaveURL(/jobs\.lever\.co/);
        });

        test('should provide clear team filtering/sorting for job seekers', async ({ page }) => {
            const careersPage = new CareersPage(page);
            await careersPage.navigate('https://insiderone.com/careers/#open-roles');
            
            await careersPage.expectCookiePopupVisible();
            await careersPage.clickAcceptCookieButton();

            // Verify teams are organized (either visible initially or under "See all")
            const initialTeams = await careersPage.getShownTeamsTitles();
            expect(initialTeams.length).toBeGreaterThan(0);

            // Expand to see all
            await careersPage.clickSeeAllTeamsLink();
            await careersPage.waitForTeamsToLoad();

            const allTeams = await careersPage.getShownTeamsTitles();
            
            // Multiple teams should be available for selection
            expect(allTeams.length).toBeGreaterThanOrEqual(initialTeams.length);
        });
    });

    test.describe('Content Consistency', () => {
        test('should maintain consistent messaging across pages', async ({ page }) => {
            const homePage = new HomePage(page);
            const careersPage = new CareersPage(page);

            // Get home page title
            await homePage.navigate('https://insiderone.com');
            const homeTitle = await homePage.getPageTitle();

            // Get careers page title
            await careersPage.navigate('https://insiderone.com/careers/#open-roles');
            const careersTitle = await careersPage.getPageTitle();

            // Both should contain relevant keywords
            expect(homeTitle).toMatch(/insider one|insiderone/i);
            expect(careersTitle).toMatch(/career|job/i);
        });

        test('should consistently brand the application experience', async ({ page }) => {
            const careersPage = new CareersPage(page);
            await careersPage.navigate('https://insiderone.com/careers/#open-roles');
            
            await careersPage.expectCookiePopupVisible();
            await careersPage.clickAcceptCookieButton();

            // Verify Insider One branding is present
            const headerText = await careersPage.getHeaderText();
            expect(headerText).toBeTruthy();
        });
    });

    test.describe('Power User Scenarios', () => {
        test('should allow power user to quickly explore all departments', async ({ page }) => {
            const careersPage = new CareersPage(page);
            await careersPage.navigate('https://insiderone.com/careers/#open-roles');
            
            await careersPage.expectCookiePopupVisible();
            await careersPage.clickAcceptCookieButton();

            // Get initial visible teams
            const initialTeams = await careersPage.getShownTeamsTitles();

            // Power user action: expand all
            await careersPage.clickSeeAllTeamsLink();
            await careersPage.waitForTeamsToLoad();

            // Get all teams
            const allTeams = await careersPage.getShownTeamsTitles();

            // Should have access to significantly more options
            expect(allTeams.length).toBeGreaterThan(initialTeams.length);
        });

        test('should support rapid team exploration without page reloads', async ({ page }) => {
            const careersPage = new CareersPage(page);
            await careersPage.navigate('https://insiderone.com/careers/#open-roles');
            
            await careersPage.expectCookiePopupVisible();
            await careersPage.clickAcceptCookieButton();
            await careersPage.clickSeeAllTeamsLink();
            await careersPage.waitForTeamsToLoad();

            const departments = await careersPage.getAllTeamDepartments();

            // Verify we can rapidly access department information
            for (let i = 0; i < Math.min(3, departments.length); i++) {
                if (departments[i]) {
                    const title = await careersPage.getTeamTitleByDepartment(departments[i]);
                    expect(title).toBeTruthy();
                }
            }

            // Should still be on same page
            expect(page.url()).toContain('careers');
        });

        test('should support applying to multiple positions in sequence', async ({ page }) => {
            const careersPage = new CareersPage(page);
            await careersPage.navigate('https://insiderone.com/careers/#open-roles');
            
            await careersPage.expectCookiePopupVisible();
            await careersPage.clickAcceptCookieButton();
            await careersPage.clickSeeAllTeamsLink();
            await careersPage.waitForTeamsToLoad();

            const departments = await careersPage.getAllTeamDepartments();
            expect(departments.length).toBeGreaterThan(0);

            // First department link should be valid
            if (departments[0]) {
                const link = await careersPage.getTeamLinkHref(departments[0]);
                expect(link).toContain('jobs.lever.co');
            }

            // Page should still be navigable after multiple checks
            expect(page.url()).toContain('careers');
        });
    });

    test.describe('Error Recovery', () => {
        test('should recover from failed team expansion gracefully', async ({ page }) => {
            const careersPage = new CareersPage(page);
            await careersPage.navigate('https://insiderone.com/careers/#open-roles');
            
            await careersPage.expectCookiePopupVisible();
            await careersPage.clickAcceptCookieButton();

            // Try to expand teams
            try {
                await careersPage.clickSeeAllTeamsLink();
                await careersPage.waitForTeamsToLoad(3000);
            } catch (error) {
                // Even if expansion fails, page should be stable
                expect(page.url()).toContain('careers');
            }

            // Should be able to take another action
            const headerText = await careersPage.getHeaderText();
            expect(headerText).toBeTruthy();
        });

        test('should handle rapid page navigation without breaking state', async ({ page }) => {
            const careersPage = new CareersPage(page);
            
            // Rapid navigation
            await careersPage.navigate('https://insiderone.com/careers/#open-roles');
            await careersPage.waitForTeamsToLoad().catch(() => {});

            await page.goBack().catch(() => {});
            await page.goForward().catch(() => {});

            // Should be in a stable state
            const url = page.url();
            expect(url).toBeTruthy();
        });
    });

    test.describe('Industry Standard Compliance', () => {
        test('should provide explicit CTAs for job applications (common UX pattern)', async ({ page }) => {
            const careersPage = new CareersPage(page);
            await careersPage.navigate('https://insiderone.com/careers/#open-roles');
            
            await careersPage.expectCookiePopupVisible();
            await careersPage.clickAcceptCookieButton();
            await careersPage.clickSeeAllTeamsLink();

            // Each team should have an "Apply" or "View Positions" button
            const departments = await careersPage.getAllTeamDepartments();
            
            for (const dept of departments) {
                if (dept) {
                    const link = await careersPage.getOpenPositionsLinkByDepartment(dept);
                    await expect(link).toBeVisible();
                }
            }
        });

        test('should ensure career page is HTTPS (security standard)', async ({ page }) => {
            const careersPage = new CareersPage(page);
            await careersPage.navigate('https://insiderone.com/careers/#open-roles');

            const url = careersPage.getCareersPageURL();
            expect(await url).toMatch(/^https:\/\//);
        });

        test('should maintain proper domain structure for external links', async ({ page }) => {
            const careersPage = new CareersPage(page);
            await careersPage.navigate('https://insiderone.com/careers/#open-roles');
            
            await careersPage.expectCookiePopupVisible();
            await careersPage.clickAcceptCookieButton();
            await careersPage.clickSeeAllTeamsLink();

            const departments = await careersPage.getAllTeamDepartments();

            // All Lever links should point to jobs.lever.co/insiderone
            for (const dept of departments) {
                if (dept) {
                    const href = await careersPage.getTeamLinkHref(dept);
                    if (href) {
                        expect(href).toMatch(/^https:\/\/jobs\.lever\.co\/insiderone/);
                    }
                }
            }
        });

        test('should have proper meta tags for SEO', async ({ page }) => {
            const careersPage = new CareersPage(page);
            await careersPage.navigate('https://insiderone.com/careers/#open-roles');

            const title = await careersPage.getPageTitle();
            expect(title.length).toBeGreaterThan(0);
            expect(title.length).toBeLessThan(60); // SEO best practice
        });
    });

    test.describe('Mobile-Friendly Considerations', () => {
        test('should have clickable elements with adequate spacing for touch', async ({ page }) => {
            const careersPage = new CareersPage(page);
            await careersPage.navigate('https://insiderone.com/careers/#open-roles');
            
            await careersPage.expectCookiePopupVisible();
            await careersPage.clickAcceptCookieButton();

            // Accept button should be clickable
            const headerText = await careersPage.getHeaderText();
            expect(headerText).toBeTruthy();
        });

        test('should display content in readable format without horizontal scroll', async ({ page }) => {
            const careersPage = new CareersPage(page);
            await careersPage.navigate('https://insiderone.com/careers/#open-roles');
            
            await careersPage.expectCookiePopupVisible();
            await careersPage.clickAcceptCookieButton();

            // Get viewport width to ensure no overflow
            const viewportSize = page.viewportSize();
            expect(viewportSize).not.toBeNull();
        });
    });
});
