import { BasePage } from "./page";

export class RegistrationPage extends BasePage {
    // Locators
  
    private regFormBodyLocator = "//div[contains(@class, 'auth-form__body')]";
    private emailFieldLocator = "//input[contains(@type, 'email')]";
    private passwordLocator = "//input[contains(@type, 'password') and contains(@placeholder, 'Придумайте пароль')]";
    private repeatPasswordLocator = "//input[contains(@type, 'password') and contains(@placeholder, 'Повторите пароль')]";
    private policyCheckboxLocator = "//span[contains(@class, 'auth-checkbox__faux')]";
    private regButtonLocator = "//button[contains(@type, 'submit')]";


    // Elements

    get regForm (){
        return this.page.locator(this.regFormBodyLocator);
    }
    
    get emailField (){
        return this.page.locator(this.emailFieldLocator);
    }

    get passwordField (){
        return this.page.locator(this.passwordLocator);
    }

    get repeatPasswordField (){
        return this.page.locator(this.repeatPasswordLocator);
    }

    get policyCheckbox (){
        return this.page.locator(this.policyCheckboxLocator);
    }

    get regButton (){
        return this.page.locator(this.regButtonLocator);
    }
   
    // Methods

    async inputValidEmail(email){
        await this.emailField.fill(email);
    }
    
    async clickPolicyCheckbox(){
        await this.policyCheckbox.check();
    };

    async clickRegButton (){
        await this.regButton.click();
    }

    async getFieldColor(element){
        const computedStyles = await element.evaluate((element) => {
            const styles = window.getComputedStyle(element);
            return styles.backgroundColor;
        })
        return computedStyles;
    }

    // async logIn(login: string, password: string) {
    //     await this.loginField.fill(login);
    //     await this.passwordField.fill(password);
    //     await this.logInButton.click();
    // }

    // async waitCapchaFrameAppears() {
    //     return await this.captchaFrame.waitFor( { state: "visible", timeout: 5000 });
    // }

    // async openRegisterForm (){
    //     await this.registerButton.click();
    //     return new RegistrationPage(this.page);
    // }
}