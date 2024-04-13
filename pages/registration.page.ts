import { BasePage } from "./page";

export class RegistrationPage extends BasePage {
    // Locators
  
    private regFormBodyLocator = "//div[contains(@class, 'auth-form__body')]";
    private emailFieldLocator = "//input[contains(@type, 'email')]";
    private passwordLocator = "//input[contains(@type, 'password') and contains(@placeholder, 'Придумайте пароль')]";
    private repeatPasswordLocator = "//input[contains(@type, 'password') and contains(@placeholder, 'Повторите пароль')]";
    private policyCheckboxLocator = "//span[contains(@class, 'auth-checkbox__faux')]";
    private regButtonLocator = "//button[contains(@type, 'submit')]";
    private goToMailButtonLocator = "//a[contains(text(), 'Перейти в почту')]";
    private passwordErrorMessageLocator = "//div[div/div/input[contains(@type, 'password') and contains(@placeholder, 'Придумайте пароль')]]//div[contains(text(), 'Укажите пароль')]";
    private repeatPasswordErrorMessageLocator = "//div[div/div/input[contains(@type, 'password') and contains(@placeholder, 'Повторите пароль')]]//div[contains(text(), 'Укажите пароль')]";
    private secureBoxMessageLocator = "//div[contains(text(), 'Очень надежный пароль')]";
    private confitmEmailFormLocator = "//div[@class='auth-form__body']//div[contains(text(), 'Подтвердите') and contains(text(),'ваш')]"
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

    get passwordErrorMessage (){
        return this.page.locator(this.passwordErrorMessageLocator);
    }

    get repeatPasswordErrorMessage(){
        return this.page.locator(this.repeatPasswordErrorMessageLocator);
    }

    get secureBoxMessage(){
        return this.page.locator(this.secureBoxMessageLocator);
    }
    
    get confirmEmailForm(){
        return this.page.locator(this.confitmEmailFormLocator);
    }

    get goToMailButton (){
        return this.page.locator(this.goToMailButtonLocator);
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

    async getSecureMessageTextContent(): Promise<string|null> {
        return await this.secureBoxMessage.textContent();
    }


   
}