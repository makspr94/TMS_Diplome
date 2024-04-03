import { BasePage } from "./page";

export class LoginPage extends BasePage {
    // Locators
    private loginFieldLocator = "//input[contains(@class,'auth-input_primary') and @type='text']";
    private passwordFieldLocator = "//input[contains(@class,'auth-input_primary') and @type='password']";
    private logInButtonLocator = "//button[contains(@class,'auth-button_primary')]";
    private captchaFrameLocator = "//*[contains(@class,'auth-form__captcha')]";
    private authFormLocator = "//*[contains(@class, 'auth-form__body')]";

    // Elements
    private get loginField() {
        return this.page.locator(this.loginFieldLocator);
    }

    get authForm (){
        return this.page.locator(this.authFormLocator);
    }

    private get passwordField() {
        return this.page.locator(this.passwordFieldLocator);
    }

    private get logInButton() {
        return this.page.locator(this.logInButtonLocator);
    }

    private get captchaFrame() {
        return this.page.locator(this.captchaFrameLocator);
    }

    // Methods

    async logIn(login: string, password: string) {
        await this.loginField.fill(login);
        await this.passwordField.fill(password);
        await this.logInButton.click();
    }

    async waitCapchaFrameAppears() {
        return await this.captchaFrame.waitFor( { state: "visible", timeout: 5000 });
    }
}