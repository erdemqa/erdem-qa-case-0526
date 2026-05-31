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
exports.HomePage = void 0;
const test_1 = require("@playwright/test");
const BasePage_1 = require("./BasePage");
class HomePage extends BasePage_1.BasePage {
    constructor() {
        super(...arguments);
        this.headerSelector = 'h1';
        this.cookieConsentSelector = this.page.getByRole('dialog', { name: 'cookieconsent' });
        this.cookieConsentAcceptButtonSelector = this.cookieConsentSelector.getByRole('button', { name: 'Accept All' });
        this.sections = this.page.locator('section');
        this.careersLinkLocator = this.page.locator('a[href*="/careers"]').first();
    }
    getHeaderText() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            return (_a = (yield this.page.textContent(this.headerSelector))) !== null && _a !== void 0 ? _a : 'Default Header Text';
        });
    }
    clickAcceptCookieButton() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.cookieConsentAcceptButtonSelector.click();
        });
    }
    expectCookiePopupVisible() {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, test_1.expect)(this.cookieConsentSelector).toBeVisible();
        });
    }
    expectCookiePopupHidden() {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, test_1.expect)(this.cookieConsentSelector).toBeHidden();
        });
    }
    getSectionsList() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.page.locator('section').evaluateAll((sections) => sections.map((section) => section.className.trim())));
        });
    }
    getSectionByIndex(index) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.sections.nth(index);
        });
    }
    getScreenshotFileName(className, index) {
        return __awaiter(this, void 0, void 0, function* () {
            const formattedName = className
                .replace(/\s+/g, '-')
                .replace(/[^\w-]/g, '')
                .toLowerCase();
            return `${index + 1}-${formattedName}.png`;
        });
    }
    // Enhanced methods for comprehensive testing
    isCookiePopupVisible() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.cookieConsentSelector.isVisible().catch(() => false);
        });
    }
    getPageTitle() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.page.title();
        });
    }
    getPageURL() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.page.url();
        });
    }
    isHomePageHeaderVisible() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.page.locator(this.headerSelector).isVisible();
        });
    }
    getSectionsCount() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.sections.count();
        });
    }
    waitForHomePageToLoad(timeout = 5000) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.page.waitForLoadState('networkidle', { timeout });
        });
    }
    navigateFromHomeToCareers() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.careersLinkLocator.click();
        });
    }
    isCareersLinkVisible() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.careersLinkLocator.isVisible().catch(() => false);
        });
    }
    clickCareersLink() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.careersLinkLocator.click();
        });
    }
    expectPageUrlContains(urlPart) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, test_1.expect)(this.page).toHaveURL(new RegExp(urlPart));
        });
    }
    rejectCookiesIfAvailable() {
        return __awaiter(this, void 0, void 0, function* () {
            const rejectButton = this.cookieConsentSelector.getByRole('button', { name: /reject|decline/i });
            if (yield rejectButton.isVisible().catch(() => false)) {
                yield rejectButton.click();
                return true;
            }
            return false;
        });
    }
    getCookiePopupText() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.cookieConsentSelector.textContent();
        });
    }
    getAllSectionHeadings() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.page.locator('section h1, section h2, section h3').evaluateAll((headings) => headings.map((h) => { var _a, _b; return (_b = (_a = h.textContent) === null || _a === void 0 ? void 0 : _a.trim()) !== null && _b !== void 0 ? _b : ''; }).filter(Boolean));
        });
    }
    navigateToCareersPage(careersPageUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.page.goto(careersPageUrl, { waitUntil: 'domcontentloaded' });
        });
    }
    getPageLoadTime() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.page.evaluate(() => {
                const perfData = performance.timing;
                return perfData.loadEventEnd - perfData.navigationStart;
            });
        });
    }
}
exports.HomePage = HomePage;
