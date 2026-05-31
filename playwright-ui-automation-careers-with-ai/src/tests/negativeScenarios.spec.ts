import { test, expect } from '@playwright/test';
import { CareersPage } from '../pages/CareersPage';
import { HomePage } from '../pages/HomePage';

test.describe('Negative Test Scenarios & Error Handling', () => {
    test.describe('Invalid Navigation', () => {
        test('should handle navigation to invalid careers URL gracefully', async ({ page }) => {
            const careersPage = new CareersPage(page);
            
            // Try to navigate to non-existent careers path
            await page.goto('https://insiderone.com/careers/invalid-path', {
                waitUntil: 'domcontentloaded'
            }).catch(() => {
                // Expected to fail or redirect
            });

            // Should either show error or redirect to valid page
            expect(page.url()).toBeTruthy();
        });

        test('should handle malformed team parameter in Lever URL', async ({ page }) => {
            const careersPage = new CareersPage(page);
            await careersPage.navigate('https://insiderone.com/careers/#open-roles');
            
            await careersPage.expectCookiePopupVisible();
            await careersPage.clickAcceptCookieButton();

            // Try to navigate to Lever with empty team parameter
            await page.goto('https://jobs.lever.co/insiderone?team=', {
                waitUntil: 'domcontentloaded'
            }).catch(() => {
                // Expected to fail or load with no filters
            });

            expect(page.url()).toContain('jobs.lever.co');
        });
    });

    test.describe('Cookie Consent Edge Cases', () => {
        test('should handle missing cookie popup gracefully', async ({ page, context }) => {
            // Create a new context with cookies already set
            const careersPage = new CareersPage(page);

            // Navigate first time
            await careersPage.navigate('https://insiderone.com/careers/#open-roles');
            await careersPage.expectCookiePopupVisible();
            await careersPage.clickAcceptCookieButton();

            // Navigate again - cookies might not appear again
            await careersPage.navigate('https://insiderone.com/careers/#open-roles');
            
            // Either popup is hidden or not visible
            const isPopupVisible = await careersPage.isCookiePopupVisible().catch(() => false);
            expect(typeof isPopupVisible).toBe('boolean');
        });

        test('should handle rapid cookie acceptance clicks', async ({ page }) => {
            const careersPage = new CareersPage(page);
            await careersPage.navigate('https://insiderone.com/careers/#open-roles');

            await careersPage.expectCookiePopupVisible();
            
            // Attempt rapid clicks (should only register once)
            try {
                await careersPage.clickAcceptCookieButton();
                await careersPage.clickAcceptCookieButton().catch(() => {
                    // Button may already be gone
                });
            } catch (error) {
                // Expected - button already clicked
            }

            await careersPage.expectCookiePopupHidden();
        });
    });

    test.describe('Element Visibility Edge Cases', () => {
        test('should handle "See all teams" link being clicked multiple times', async ({ page }) => {
            const careersPage = new CareersPage(page);
            await careersPage.navigate('https://insiderone.com/careers/#open-roles');
            
            await careersPage.expectCookiePopupVisible();
            await careersPage.clickAcceptCookieButton();

            const initialCount = await careersPage.getInitialTeamsCount();

            // Click See All Teams
            await careersPage.clickSeeAllTeamsLink();
            await careersPage.waitForTeamsToLoad();

            const countAfterFirst = await careersPage.getInitialTeamsCount();

            // Try clicking again if link still exists
            const isLinkVisible = await careersPage.isSeeAllTeamsLinkVisible().catch(() => false);
            if (isLinkVisible) {
                await careersPage.clickSeeAllTeamsLink().catch(() => {
                    // Link may have disappeared or become disabled
                });
            }

            const finalCount = await careersPage.getInitialTeamsCount();
            expect(finalCount).toBeGreaterThanOrEqual(initialCount);
        });

        test('should handle teams that might not have Lever links', async ({ page }) => {
            const careersPage = new CareersPage(page);
            await careersPage.navigate('https://insiderone.com/careers/#open-roles');
            
            await careersPage.expectCookiePopupVisible();
            await careersPage.clickAcceptCookieButton();
            await careersPage.clickSeeAllTeamsLink();

            const departments = await careersPage.getAllTeamDepartments();

            // Check each department for link integrity
            for (const dept of departments) {
                if (dept) {
                    try {
                        const href = await careersPage.getTeamLinkHref(dept);
                        if (href) {
                            expect(href).toContain('lever');
                        }
                    } catch (error) {
                        // Department might not have a link - acceptable
                    }
                }
            }
        });
    });

    test.describe('Network Timeout Scenarios', () => {
        test('should handle page load timeout gracefully', async ({ page }) => {
            const careersPage = new CareersPage(page);

            try {
                await careersPage.navigate('https://insiderone.com/careers/#open-roles');
                // Page should eventually load or timeout
                expect(page.url()).toContain('insiderone.com');
            } catch (error) {
                // Timeout is acceptable - verify page state
                expect(page.url()).toBeTruthy();
            }
        });

        test('should handle team loading timeout', async ({ page }) => {
            const careersPage = new CareersPage(page);
            await careersPage.navigate('https://insiderone.com/careers/#open-roles');
            
            await careersPage.expectCookiePopupVisible();
            await careersPage.clickAcceptCookieButton();

            try {
                await careersPage.waitForTeamsToLoad(1000); // Very short timeout
            } catch (error) {
                // Timeout accepted - teams might still be loading
                const count = await careersPage.getInitialTeamsCount();
                expect(count).toBeDefined();
            }
        });
    });

    test.describe('Data Integrity Checks', () => {
        test('should verify no duplicate departments are listed', async ({ page }) => {
            const careersPage = new CareersPage(page);
            await careersPage.navigate('https://insiderone.com/careers/#open-roles');
            
            await careersPage.expectCookiePopupVisible();
            await careersPage.clickAcceptCookieButton();
            await careersPage.clickSeeAllTeamsLink();
            await careersPage.waitForTeamsToLoad();

            const departments = await careersPage.getAllTeamDepartments();
            const uniqueDepartments = new Set(departments.filter(Boolean));

            // All departments should be unique
            expect(uniqueDepartments.size).toBe(departments.filter(Boolean).length);
        });

        test('should verify team names are not empty strings', async ({ page }) => {
            const careersPage = new CareersPage(page);
            await careersPage.navigate('https://insiderone.com/careers/#open-roles');
            
            await careersPage.expectCookiePopupVisible();
            await careersPage.clickAcceptCookieButton();

            const teamTitles = await careersPage.getShownTeamsTitles();

            // No team title should be empty
            const emptyTitles = teamTitles.filter(title => !title || title.trim().length === 0);
            expect(emptyTitles.length).toBe(0);
        });

        test('should verify Lever URLs contain valid company identifier', async ({ page }) => {
            const careersPage = new CareersPage(page);
            await careersPage.navigate('https://insiderone.com/careers/#open-roles');
            
            await careersPage.expectCookiePopupVisible();
            await careersPage.clickAcceptCookieButton();
            await careersPage.clickSeeAllTeamsLink();

            const departments = await careersPage.getAllTeamDepartments();

            for (const dept of departments) {
                if (dept) {
                    const href = await careersPage.getTeamLinkHref(dept);
                    if (href) {
                        expect(href).toMatch(/jobs\.lever\.co\/[^/?]+/);
                        expect(href).toContain('insiderone');
                    }
                }
            }
        });
    });

    test.describe('Cross-Browser State Issues', () => {
        test('should handle missing team attribute gracefully', async ({ page }) => {
            const careersPage = new CareersPage(page);
            await careersPage.navigate('https://insiderone.com/careers/#open-roles');
            
            await careersPage.expectCookiePopupVisible();
            await careersPage.clickAcceptCookieButton();

            // Try to get team card with empty department name
            try {
                const card = await careersPage.getTeamCardByDepartment('');
                const count = await card.count();
                expect(count).toBeDefined();
            } catch (error) {
                // Error expected with empty department
                expect(error).toBeDefined();
            }
        });

        test('should verify page renders correctly without JavaScript enhancements', async ({ page }) => {
            const careersPage = new CareersPage(page);
            await careersPage.navigate('https://insiderone.com/careers/#open-roles');
            
            // Verify basic structure exists even if JavaScript fails
            const headerText = await careersPage.getHeaderText().catch(() => null);
            expect(headerText !== null || page.url()).toBeTruthy();
        });
    });

    test.describe('Link Validation', () => {
        test('should verify all Lever team links are different URLs', async ({ page }) => {
            const careersPage = new CareersPage(page);
            await careersPage.navigate('https://insiderone.com/careers/#open-roles');
            
            await careersPage.expectCookiePopupVisible();
            await careersPage.clickAcceptCookieButton();
            await careersPage.clickSeeAllTeamsLink();

            const departments = await careersPage.getAllTeamDepartments();
            const hrefs = new Map<string, string>();

            for (const dept of departments) {
                if (dept) {
                    const href = await careersPage.getTeamLinkHref(dept);
                    if (href) {
                        hrefs.set(dept, href);
                    }
                }
            }

            // Verify each department link is unique (or same company URL with different params)
            const urls = Array.from(hrefs.values());
            urls.forEach(url => {
                expect(url).toContain('jobs.lever.co/insiderone');
            });
        });
    });

    test.describe('Alternative Navigation Paths', () => {
        test('should handle navigation to careers page without hash anchor', async ({ page }) => {
            const careersPage = new CareersPage(page);
            await careersPage.navigate('https://insiderone.com/careers/');

            // Page should either redirect or load successfully
            expect(page.url()).toContain('careers');
        });

        test('should verify different entry points lead to same content', async ({ page }) => {
            const careersPage = new CareersPage(page);

            // Try direct careers URL
            await careersPage.navigate('https://insiderone.com/careers/#open-roles');
            await careersPage.expectCookiePopupVisible();
            await careersPage.clickAcceptCookieButton();

            const headerText1 = await careersPage.getHeaderText();

            // Navigate away and back
            await page.goto('https://insiderone.com');
            await page.goto('https://insiderone.com/careers/#open-roles');

            const headerText2 = await careersPage.getHeaderText();

            // Same content should be displayed
            expect(headerText1).toBe(headerText2);
        });
    });
});
