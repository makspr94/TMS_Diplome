import { ProductPage } from "./CatalogProductPages/productPage.catalog";
import { BasePage } from "./page";
import { Page, FrameLocator } from "@playwright/test";

export class QuickSearhFrame extends BasePage {
  public searchRequest = "Наушники Bose 45";
  private locatorQuickSearchFrame =
    "//iframe[@src='/sdapi/catalog/search/iframe']";
  public iFrame = this.page.frameLocator(this.locatorQuickSearchFrame);

  //LOCATOR

  private locatorQuickSearchInput =
    "//input[contains(@class,'fast-search__input')]";

  private locatorSearchResult = "//div[@class='result__wrapper']";
  private locatorTitleSearchResult = `${this.locatorSearchResult}//a[contains(@class, 'product__title-link')]`;

  //ELEMENT

  get quickSearchInputField() {
    return this.page.locator(this.locatorQuickSearchInput);
  }

  get quickSearchFrame() {
    return this.page.locator(this.locatorQuickSearchFrame);
  }

  // get iFrame () {
  //     return this.page.frameLocator(this.locatorQuickSearchFrame)}

  get titleSearchResult() {
    return this.page.locator(this.locatorTitleSearchResult);
  }

  //METHODS

  async inputInQuickSearch(text: string) {
    this.quickSearchInputField.fill(text);
    this.iFrame;
  }

  // switchToQuickSearchframe(){
  //     return this.page.frameLocator(this.locatorQuickSearchFrame);
  // }

  async openProductBySearchRequest(searchRequest: string) {
    await this.inputInQuickSearch(searchRequest);
    await this.iFrame.locator(this.titleSearchResult).first().waitFor();
    await this.iFrame.locator(this.titleSearchResult).first().click();
    return new ProductPage(this.page);
  }

  // get iFrame (){
  //     let iframe = this.switchToQuickSearchframe();
  //     return iframe
  // }

  //     static locatorQuickSearchFrame = "//iframe[@src='/sdapi/catalog/search/iframe']";

  //     static async SwitchToQuickSearchframe(){
  //         return this.page.frameLocator(this.locatorQuickSearchFrame);
  //     };

  //     static getMemCardsSearch(){
  //         return this.page.locator(this.memCardsSearchLocator);
  //     }

  //     //locators

  //     private memCardsSearchLocator = "//div[@class='result__wrapper']//a[contains(text(),'Карты памяти') and @href='https://catalog.onliner.by/memcards']"

  //     //Elements
  //     get memCardsSearch (){
  //         return this.page.locator(this.memCardsSearchLocator);
  //     }

  //     Methods

  // }

  // class MyFrame {
  //     constructor(page) {
  //         this.page = page;
  //     }

  //     async getFrame() {
  //         // Wait for the iframe to be attached to the page
  //         const frameElement = await this.page.waitForSelector('#my-frame');
  //         // Get the frame object
  //         return await frameElement.contentFrame();
  //     }

  //     async clickSubmitButton() {
  //         const frame = await this.getFrame();
  //         const button = await frame.waitForSelector('text=Submit');
  //         await button.click();
  //     }
}
