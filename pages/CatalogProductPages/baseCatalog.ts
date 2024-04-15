import { Page, expect } from "@playwright/test";
import { getInnerNumber } from "../../helpers/getInnerNum";

export class BaseCatalog {
  constructor(protected page: Page) {}

  //LOCATORS
  protected locatorCatalogPageTitle =
    "//h1[@class='catalog-form__title catalog-form__title_big-alter']";
  protected locatorFilterMakerList =
    "//div[contains(@class, 'catalog-form__group catalog-form__group_nonadaptive catalog-form__group_width_full')][descendant::div[contains(text(), 'Производитель')]]";
  protected locatorNumberOfProducts =
    "//span[@class ='catalog-interaction__sub catalog-interaction__sub_main']";
  protected locatorSuperPriceLabel =
    "//label[@class='catalog-form__bonus-item catalog-form__bonus-item_additional']";
  protected locatorSelectedSuperPriceLabel =
    "//div[@class ='button-style button-style_either button-style_small catalog-form__button catalog-form__button_tag' and contains(text(), 'Суперцена')]";
  protected locatorProductTile = "//div[@class='catalog-form__offers-flex']";
  protected locatorSuperPriceInProductTile = `${this.locatorProductTile}//div[@class='catalog-form__popover-trigger catalog-form__popover-trigger_hot-secondary']`;
  protected locatorProductTitle = `${this.locatorProductTile}//a[@class='catalog-form__link catalog-form__link_primary-additional catalog-form__link_base-additional catalog-form__link_font-weight_semibold catalog-form__link_nodecor']`;
  protected locatorPopupComparison =
    "//a[@class='compare-button__sub compare-button__sub_main']/span";

  //ELEMENTS

  get productCatalogTitleText() {
    return this.page.locator(this.locatorCatalogPageTitle).innerText();
  }

  protected get numberOfFilteredProducts() {
    return this.page.locator(this.locatorNumberOfProducts);
  }

  protected get superPriceFilter() {
    return this.page.locator(this.locatorSuperPriceLabel);
  }

  protected get productTile() {
    return this.page.locator(this.locatorProductTile);
  }

  protected get superPriceInProductTile() {
    return this.page.locator(this.locatorSuperPriceInProductTile);
  }

  get selectedSuperPriceLaber() {
    return this.page.locator(this.locatorSelectedSuperPriceLabel);
  }

  protected get productTitle() {
    return this.page.locator(this.locatorProductTitle);
  }

  protected get popupComparison() {
    return this.page.locator(this.locatorPopupComparison);
  }

  //METHODS

  async getNumberOfProducts() {
    return await getInnerNumber(this.numberOfFilteredProducts);
  }

  async getChangedNumOfProducts(previousNumOfProducts) {
    let changedNumber = await getInnerNumber(this.numberOfFilteredProducts);
    while (changedNumber == previousNumOfProducts) {
      await this.page.waitForTimeout(2000);
      changedNumber = await this.getChangedNumOfProducts(changedNumber);
    }
    expect(changedNumber).not.toEqual(previousNumOfProducts); //test if current number != to previous number of filtered products
    return changedNumber;
  }

  async selectSuperPriceFilter() {
    await this.superPriceFilter.click();
    await this.page.waitForTimeout(3000);
  }

  async countAllProductTiles() {
    return await this.productTile.count();
  }

  async countAllSuperPricesInProduct() {
    return await this.superPriceInProductTile.count();
  }

  async getNumberofProductsInComparison() {
    return await getInnerNumber(this.popupComparison);
  }
}
