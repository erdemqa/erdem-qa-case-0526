import { test, expect } from '@playwright/test';
import { CareersPage } from '../pages/CareersPage';
import expectedSections from '../data/homePage/SectionsList.json';

test.describe('Careers Page Tests', () => {
    let careersPage: CareersPage;

    test.beforeEach(async ({ page }) => {
        careersPage = new CareersPage(page);
        await careersPage.navigate('https://insiderone.com/careers/#open-roles');
        await careersPage.expectCookiePopupVisible();
        await careersPage.clickAcceptCookieButton();
        await careersPage.expectCookiePopupHidden();

    });

    test('should display the correct header text', async () => {
        const headerText = await careersPage.getHeaderText();
        expect(headerText).toBe('Ready to disrupt?');
    });

    test('should not display Quality Assurance on page load', async () => {
        await careersPage.expectTeamNotVisible('Quality Assurance');
    });

    test('should display Quality Assurance team after clicking "See all teams" link', async () => {
        await careersPage.clickSeeAllTeamsLink();
        await careersPage.expectTeamVisible('Quality Assurance');
    });

    test('should redirect user to lever site for QA jobs', async ({ page }) => {
        await careersPage.clickSeeAllTeamsLink();
        await careersPage.expectTeamVisible('Quality Assurance');
        const qaJobsLink = await careersPage.getOpenPositionsLinkByDepartment('Quality Assurance');

        await expect( qaJobsLink).toBeVisible();


        await qaJobsLink.click({ noWaitAfter: false });

        await expect(page).toHaveURL(
            'https://jobs.lever.co/insiderone?team=Quality%20Assurance'
        );
    });

});