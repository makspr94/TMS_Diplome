import { LoginPage } from "./login.page";
import { BasePage } from "./page";

export class MainPage extends BasePage {
    // Locators
    private loginButtonLocator = "//*[contains(@class,'auth-bar__item') and text()='Вход']";
    private userAvatarLocator = "//*[@class = 'b-top-profile__image js-header-user-avatar']";
    
    
    
    // Elements

    private get loginButton() {
        return this.page.locator(this.loginButtonLocator);
    }

    get userAvatar (){
        return this.page.locator(this.userAvatarLocator);
    }

    // Methods
   

    async openLoginPage(): Promise<LoginPage> {
        await this.loginButton.click();

        return new LoginPage(this.page);
    }
}