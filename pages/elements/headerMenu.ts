
import { CatalogMainPage } from "../catalogMain.page";
import { BasePage } from "../page";
import { getInnerNumber } from "../../helpers/getInnerNum";
import { CartPage } from "../cart.page";
import { URLs } from "../../data/URLs";
import { CurrencyPage } from "../currency.page";
import { realtPage } from "../realt.page";

export class HeaderMenu extends BasePage {
   
    //LOCATORS
    private locatorButtonCatalog = "//span[contains(@class, 'b-main-navigation__text') and text()='Каталог']"
    private locatorButtonCart = "//a[@class='b-top-profile__cart']"
    private locatorCounterInButtonCart = `${this.locatorButtonCart}//span[@class='b-top-profile__counter']`
    private locatorButtonCurrencyExchange = "//span[@class='_u js-currency-amount']";
    private locatorButtonRealtPage = "(//span[text()='Дома и квартиры'])[2]";
    //ELEMENTS 
    get ButtonCatalog(){
        return this.page.locator(this.locatorButtonCatalog);
    }

    get buttonCart(){
        return this.page.locator(this.locatorButtonCart);
    }

    
    get counterInButtonCart(){
        return this.page.locator(this.locatorCounterInButtonCart);
    }

    get buttonCurrencyExchange(){
        return this.page.locator(this.locatorButtonCurrencyExchange);
    }

    get ButtonRealtPage(){
        return this.page.locator(this.locatorButtonRealtPage);
    }

    //METHODS

    async openCatalog(){
        this.ButtonCatalog.click();
        await this.page.waitForURL(URLs.catalogUrl, {waitUntil:"load"});
        return new CatalogMainPage(this.page);
    }
    
    async openCart(){
        await this.buttonCart.click();
        await this.page.waitForURL(URLs.CartPageUrl, {waitUntil:"load"});
        return new CartPage(this.page);
    }

    async getNumberOfCartCounter(){
        const number = await getInnerNumber(this.counterInButtonCart);
        return number
    }

    async openCurrencyExhangePage(){
        await this.buttonCurrencyExchange.click();
        await this.page.waitForURL(URLs.currencyExhangeUrl, {waitUntil:"load"});
        return new CurrencyPage(this.page);
    }

    async openRealtPage(){
        await this.ButtonRealtPage.click();
        await this.page.waitForURL(URLs.realtPKPageUrl, {waitUntil:"load"});
        return new realtPage(this.page);
    }


}