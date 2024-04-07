import { Page } from "@playwright/test";

export class baseCatalog {
    constructor(protected page: Page) {}

    //LOCATORS
    private productCatalogTitleLocator = "//h1[@class='catalog-form__title catalog-form__title_big-alter']";

    //ELEMENTS
    get productCatalogTitleText (){
        return this.page.locator(this.productCatalogTitleLocator).innerText();
    }

    //METHODS



}