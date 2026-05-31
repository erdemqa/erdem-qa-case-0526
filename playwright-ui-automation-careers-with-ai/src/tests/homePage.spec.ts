import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import expectedSections from '../data/homePage/SectionsList.json';

test.describe('Home Page Tests', () => {
    let homePage: HomePage;

    test.beforeEach(async ({ page }) => {
        homePage = new HomePage(page);
        await homePage.navigate('https://insiderone.com');
    });

    test('should display the correct header text', async () => {
        const headerText = await homePage.getHeaderText();
        expect(headerText).toBe('The leading Agentic Customer Engagement Platform');
    });

    test('should display the cookie popup and cookies can be accepted', async () => {
        await homePage.expectCookiePopupVisible();
        await homePage.clickAcceptCookieButton();
        await homePage.expectCookiePopupHidden();
    });

    test('should display all sections with expected visuals', async () => {
        await homePage.expectCookiePopupVisible();
        await homePage.clickAcceptCookieButton();
        const sections = await homePage.getSectionsList();
        expect(sections).toEqual(expectedSections);
        for (let i = 0; i < expectedSections.length; i++) {
            const section = await homePage.getSectionByIndex(i);
            const className = expectedSections[i];
            
            await expect(section).toBeVisible();
            await section.scrollIntoViewIfNeeded();
            const screenshotFileName =
                await homePage.getScreenshotFileName(className, i);

            await expect(section).toHaveScreenshot(
                screenshotFileName,
                {
                    animations: 'disabled',
                    caret: 'hide',
                    maxDiffPixelRatio: 0.01
                }
            );
        }
    });
});