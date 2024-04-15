import { BaseCatalog } from "./baseCatalog";
import { ProductPage } from "./productPage.catalog";

export class TVsCatalog extends BaseCatalog {
  //LOCATORS

  //ELEMENTS

  //METHODS

  async openFirstProduct() {
    await this.productTitle.first().click();
    return new ProductPage(this.page);
  }
  async openSecondProduct() {
    await this.productTitle.nth(1).click();
    return new ProductPage(this.page);
  }
}
