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
const BasePage_1 = require("./BasePage"); // Import BasePage from the correct path
class HomePage extends BasePage_1.BasePage {
    constructor() {
        super(...arguments);
        this.headerSelector = 'h1'; // Example selector for the header
        this.loginButtonSelector = 'button.login'; // Example selector for the login button
    }
    getHeaderText() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            return (_a = (yield this.page.textContent(this.headerSelector))) !== null && _a !== void 0 ? _a : 'Default Header Text';
        });
    }
    clickLoginButton() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.page.click(this.loginButtonSelector);
        });
    }
}
exports.HomePage = HomePage;
