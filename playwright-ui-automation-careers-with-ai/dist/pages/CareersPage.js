"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CareersPage = void 0;
const test_1 = require("@playwright/test");
const BasePage_1 = require("./BasePage");
class CareersPage extends BasePage_1.BasePage {
    constructor() {
        super(...arguments);
        this.headerSelector = 'h1';
        this.cookieConsentLocator = this.page.getByRole('dialog', { name: 'cookieconsent', });
        this.cookieConsentAcceptButtonLocator = this.cookieConsentLocator.getByRole('button', { name: 'Accept All', });
        this.teamsLocator = this.page.locator('.insiderone-icon-cards-grid-item');
        this.seeAllTeamsLinkLocator = this.page.getByRole('link', { name: 'See all teams', });
    }
    getHeaderText() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            return (_a = (yield this.page.textContent(this.headerSelector))) !== null && _a !== void 0 ? _a : 'Default Header Text';
        });
    }
    clickAcceptCookieButton() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.cookieConsentAcceptButtonLocator.click();
        });
    }
    expectCookiePopupVisible() {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, test_1.expect)(this.cookieConsentLocator).toBeVisible();
        });
    }
    expectCookiePopupHidden() {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, test_1.expect)(this.cookieConsentLocator).toBeHidden();
        });
    }
    clickSeeAllTeamsLink() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.seeAllTeamsLinkLocator.click();
        });
    }
    getShownTeamsTitles() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.teamsLocator.locator('h3').evaluateAll((elements) => elements.map((el) => { var _a, _b; return (_b = (_a = el.textContent) === null || _a === void 0 ? void 0 : _a.trim()) !== null && _b !== void 0 ? _b : ''; }));
        });
    }
    getTeamCardByTitle(title) {
        return this.teamsLocator.filter({
            has: this.page.getByRole('heading', { name: title }),
        });
    }
    getTeamCardByDepartment(department) {
        return __awaiter(this, void 0, void 0, function* () {
            // Try both data-department attribute and title-based lookup for reliability
            let card = this.page.locator(`.insiderone-icon-cards-grid-item[data-department="${department}"]`);
            // If data-department doesn't work, fall back to finding by title
            const count = yield card.count();
            if (count === 0) {
                card = this.getTeamCardByTitle(department);
            }
            return card;
        });
    }
    getOpenPositionsLinkByDepartment(department) {
        return __awaiter(this, void 0, void 0, function* () {
            // Get the team card using the more robust method
            const card = yield this.getTeamCardByDepartment(department);
            // Find the link/button within the card
            return card.locator('a, button').first();
        });
    }
    expectTeamVisible(title) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, test_1.expect)(this.getTeamCardByTitle(title)).toBeVisible();
        });
    }
    expectTeamNotVisible(title) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, test_1.expect)(this.getTeamCardByTitle(title)).toHaveCount(0);
        });
    }
    expectTeamCount(count) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, test_1.expect)(this.teamsLocator).toHaveCount(count);
        });
    }
    // Enhanced methods for comprehensive testing
    isSeeAllTeamsLinkVisible() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.seeAllTeamsLinkLocator.isVisible().catch(() => false);
        });
    }
    isSeeAllTeamsLinkEnabled() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.seeAllTeamsLinkLocator.isEnabled().catch(() => false);
        });
    }
    getInitialTeamsCount() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.teamsLocator.count();
        });
    }
    getPageTitle() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.page.title();
        });
    }
    isNavigationUrlValid(expectedUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.page.url().includes(expectedUrl);
        });
    }
    waitForTeamsToLoad(timeout = 5000) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.page.waitForSelector('.insiderone-icon-cards-grid-item', { timeout });
        });
    }
    clickTeamByTitle(title) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.getTeamCardByTitle(title).click();
        });
    }
    getTeamLinkHref(department) {
        return __awaiter(this, void 0, void 0, function* () {
            const link = (yield this.getOpenPositionsLinkByDepartment(department)).last();
            return yield link.getAttribute('href');
        });
    }
    expectPageUrlContains(urlPart) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, test_1.expect)(this.page).toHaveURL(new RegExp(urlPart));
        });
    }
    getAllTeamDepartments() {
        return __awaiter(this, void 0, void 0, function* () {
            // First try data-department attributes
            const deptsByAttribute = yield this.teamsLocator.evaluateAll((elements) => elements.map((el) => el.getAttribute('data-department')).filter(Boolean));
            // If that returns results, use them
            if (deptsByAttribute.length > 0) {
                return deptsByAttribute;
            }
            // Fallback: get teams by their title/heading
            return yield this.getShownTeamsTitles();
        });
    }
    getTeamTitleByDepartment(department) {
        return __awaiter(this, void 0, void 0, function* () {
            const card = yield this.getTeamCardByDepartment(department);
            return yield card.locator('h3').textContent();
        });
    }
    expectTeamCountGreaterThan(count) {
        return __awaiter(this, void 0, void 0, function* () {
            const teamCount = yield this.getInitialTeamsCount();
            (0, test_1.expect)(teamCount).toBeGreaterThan(count);
        });
    }
    navigateToCareersDirect(url) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.page.goto(url, { waitUntil: 'domcontentloaded' });
        });
    }
    getCareersPageURL() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.page.url();
        });
    }
    waitForCookiePopup(timeout = 5000) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.page.waitForSelector('[role="dialog"]', { timeout });
        });
    }
}
exports.CareersPage = CareersPage;
