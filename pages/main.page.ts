import { LoginPage } from "./login.page";
import { BasePage } from "./page";
import { NewsPage } from "./news.page";

export class MainPage extends BasePage {
    // Locators
    private loginButtonLocator = "//*[contains(@class,'auth-bar__item') and text()='Вход']";
    private userAvatarLocator = "//*[@class = 'b-top-profile__image js-header-user-avatar']";
    private quickSearchInputLocator = "//input[contains(@class,'fast-search__input')]";
    private quickSearchFrameLocator = "//iframe[@src='/sdapi/catalog/search/iframe']";
    private autoNewsSectionLocator = "//div[header/h2/a[contains(text(),'Авто')]]";
    private autoNewsFirstNewsLocator = `${this.autoNewsSectionLocator}//div[contains(@class, 'b-main-page-grid-4__col b-main-page-grid-4__col-1x1 news-2__secondary-news-col')]//a[contains(@herf,'')]`
       
    
    // Elements

    private get loginButton() {
        return this.page.locator(this.loginButtonLocator);
    }

    get userAvatar (){
        return this.page.locator(this.userAvatarLocator);
    }

    get quickSearchInputField (){
        return this.page.locator(this.quickSearchInputLocator);
    }

    get QuickSearchFrame(){
        return this.page.locator(this.quickSearchFrameLocator);
    }

    get autoNewsFirstNews(){
        return this.page.locator(this.autoNewsFirstNewsLocator).first();
    }

    // Methods
   

    async openLoginPage(): Promise<LoginPage> {
        await this.loginButton.click();
        return new LoginPage(this.page);
    }

    async inputInQuickSearch(text: string){
        this.quickSearchInputField.fill(text);
    }

    async SwitchToQuickSearchframe(){
        return this.page.frameLocator(this.quickSearchFrameLocator);
    }

    async openFirstAutoNews(){
        await this.autoNewsFirstNews.click()
        return new NewsPage(this.page);
    };

}   

   