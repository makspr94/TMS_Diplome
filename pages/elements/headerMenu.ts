
import { CatalogMainPage } from "../catalogMain.page";
import { BasePage } from "../page";
import { getInnerNumber } from "../../helpers/getInnerNum";
import { CartPage } from "../cart.page";
import { URLs } from "../../data/URLs";

export class HeaderMenu extends BasePage {
   
    //LOCATORS
    private locatorButtonCatalog = "//span[contains(@class, 'b-main-navigation__text') and text()='Каталог']"
    private locatorButtonCart = "//a[@class='b-top-profile__cart']"
    private locatorCounterInButtonCart = `${this.locatorButtonCart}//span[@class='b-top-profile__counter']`

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

    //METHODS

    async openCatalog(){
        this.ButtonCatalog.click();
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


}