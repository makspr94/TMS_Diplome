import { URLs } from "../data/URLs";
import { HeaderMenu } from "./elements/headerMenu";
import { BasePage } from "./page";


export class CartPage extends BasePage {

    //LOCATOR
    private locatorButtonRemoveProduct = "//a[@class='button-style button-style_auxiliary button-style_small cart-form__button cart-form__button_remove']";
    private locatorCartProductTitle = "//div[@class='cart-form__description cart-form__description_primary cart-form__description_base-alter cart-form__description_font-weight_semibold cart-form__description_condensed-specific']/a";
    private locatorCartBody = "//div[@class='cart-form__body']";
    //ELEMENT
    get buttonRemoveProduct() {
        return this.page.locator(this.locatorButtonRemoveProduct);
    }

    get cartProductTitle() {
        return this.page.locator(this.locatorCartProductTitle);
    }
    
    get cartBody(){
        return this.page.locator(this.locatorCartBody);
    }

    //METHODS
    async removeAllProducts() {
        if (this.page.url() != URLs.CartPageUrl) {
            await this.page.goto(URLs.CartPageUrl, {waitUntil: "load"});
            await this.cartBody.waitFor({state:"visible"});
            await this.page.waitForTimeout(4000);
        }
        console.log(await this.cartProductTitle.count())
        if ((await this.cartProductTitle.count()) > 0){
            while ((await this.cartProductTitle.count()) > 0) {
                await this.buttonRemoveProduct.first().hover({force:true});
                await this.buttonRemoveProduct.first().click({force:true});
            }
        }
        await this.page.goBack()
    }
}
