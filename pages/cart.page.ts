import { expect } from "@playwright/test";
import { URLs } from "../data/URLs";
import { getInnerNumber } from "../helpers/getInnerNum";
import { BasePage } from "./page";



export class CartPage extends BasePage {

    //LOCATOR
    private locatorButtonRemoveProduct = "//a[@class='button-style button-style_auxiliary button-style_small cart-form__button cart-form__button_remove']";
    private locatorCartProductTitle = "//div[@class='cart-form__description cart-form__description_primary cart-form__description_base-alter cart-form__description_font-weight_semibold cart-form__description_condensed-specific']/a";
    private locatorCartBody = "//div[@class='cart-form__body']";
    private locatorProductPrice = "//div[@class='cart-form__offers-part cart-form__offers-part_price cart-form__offers-part_price_specific helpers_hide_tablet']//div[@class='cart-form__description cart-form__description_base-alter cart-form__description_font-weight_semibold cart-form__description_ellipsis cart-form__description_condensed']"
    private locatorButtonCheckout = "//a[@class='button-style button-style_small cart-form__button button-style_primary']"
    private locatorCheckoutHeader = "//div[@class='cart-form__title cart-form__title_base cart-form__title_nocondensed cart-form__title_condensed-other']";
    
    private locatorFieldStreet = "(//span[text()='Доставка']/following::input)[2]";
    private locatorFieldBuilding = "(//span[text()='Доставка']/following::input)[3]";
    private locatorFieldName = "//div[@id='container']/div[1]/div[1]/div[1]/div[1]/div[1]/div[2]/div[1]/div[2]/div[1]/div[1]/div[1]/div[1]/div[3]/div[1]/div[9]/div[1]/div[2]/div[1]/input[1]";
    private locatorFieldPhoneNum = "//div[@id='container']/div[1]/div[1]/div[1]/div[1]/div[1]/div[2]/div[1]/div[2]/div[1]/div[1]/div[1]/div[1]/div[3]/div[1]/div[10]/div[2]/div[2]/div[1]/input[1]";
    private locatorButtonProceedToPay = "//button";
    private locatorFormAddressSelection = "//div[@class='cart-form__choise-item']";
    private locatorCheckboxPaymentTypeCard = "//span[@class='cart-form__checkbox-text cart-form__checkbox-text_inline' and contains(text(), 'Картой')]";
    private locatorButtonsPaymentOptions = "//div[@class='cart-form__anchor-list']";
    private locatorButtonConfirmOrder = "//button[contains(@class,'button-style button-style_primary')]";
    
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

    get productPrice(){
        return this.page.locator(this.locatorProductPrice);
    }

    get buttonChechout(){
        return this.page.locator(this.locatorButtonCheckout);
    }

    get checkoutHeader(){
        return this.page.locator(this.locatorCheckoutHeader);
    }

    get fieldStreet(){
        return this.page.locator(this.locatorFieldStreet);
    }

    get fieldBuilding(){
        return this.page.locator(this.locatorFieldBuilding);
    }

    get fieldName(){
        return this.page.locator(this.locatorFieldName);
    }
    
    get fieldPhoneNum(){
        return this.page.locator(this.locatorFieldPhoneNum);
    }

    get buttonProceedToPay(){
        return this.page.locator(this.locatorButtonProceedToPay);
    }

    get formPrefilledAddress(){
        return this.page.locator(this.locatorFormAddressSelection);
    }

    get checkboxPaymentTypeCard (){
        return this.page.locator(this.locatorCheckboxPaymentTypeCard);
    }

    get buttonsPaymentOptions(){
        return this.page.locator(this.locatorButtonsPaymentOptions)
    }

    get buttonConfirmOrder(){
        return this.page.locator(this.locatorButtonConfirmOrder);
    }

    //METHODS
    async removeAllProducts() {
        if (this.page.url() != URLs.CartPageUrl) {
            await this.page.goto(URLs.CartPageUrl, {waitUntil: "load"});
            await this.cartBody.waitFor({state:"visible"});
            await this.page.waitForTimeout(2000);
        }
        console.log(await this.cartProductTitle.count())
        if ((await this.cartProductTitle.count()) > 0){
            while ((await this.cartProductTitle.count()) > 0) {
                await this.buttonRemoveProduct.first().hover({force:true});
                await this.buttonRemoveProduct.first().click({force:true});
                await this.page.waitForTimeout(1000);
            }
        }
        await this.page.goBack()
    }

    async getProductTitleText(){
        return (await this.cartProductTitle.innerText()).trim();
    }

    async getProductPrice(){
        console.log('cart getProductPrice')
        return await getInnerNumber(this.productPrice);
    }

    async clickButtonCheckout(){
        await this.buttonChechout.click();
        await this.page.waitForURL("https://cart.onliner.by/order", {waitUntil:"load"});
        expect(this.checkoutHeader).toBeVisible();
        await this.page.waitForTimeout(2000);
    }

    async clickButtonProceedToPay(){
        await this.buttonProceedToPay.click();
        await this.buttonsPaymentOptions.waitFor({state:"visible"})
    }

    async checkPaymentTypeByCard(){
        if(await this.checkboxPaymentTypeCard.isChecked()){
            return
        }
        await this.checkboxPaymentTypeCard.check();
    }


   
}
