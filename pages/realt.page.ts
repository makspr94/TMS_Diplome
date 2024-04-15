import { expect } from "@playwright/test";
import { URLs } from "../data/URLs";
import { getInnerNumber } from "../helpers/getInnerNum";
import { HeaderMenu } from "./elements/headerMenu";
import { BasePage } from "./page";

export class realtPage extends BasePage {
  //LOCATORS
  private locatorTabRent = "//span[text()='Аренда']";
  private locatorFilterInputCityStreet = "//input[@placeholder='Город, улица']";
  private locatorCounterSearchResults =
    "//div[@class='classifieds-bar__group']//div[1]";
  private locatorFilterFlats = "//span[text()='Квартира']";
  private locatorSearchResultType =
    "//span[@class='classified__caption-item classified__caption-item_type']";
  private locatorFilter2Rooms = "//span[text()='2']";
  private locatorFilterPriceMax = "//input[@id='search-filter-price-to']";
  private locatorFilterResultUSDprice = `//span[@data-bind="text: SearchApartments.formatPrice(apartment.price, 'USD')"]`;
  private locatorFilterMetro = "//div[contains(@class,'dropdown dropdown_2')]";
  private locatorFilterMetroNearMetro =
    "//li[text()[normalize-space()='Возле метро']]";
  private locatorSortingDropdown =
    "//div[contains(@class,'dropdown dropdown_right')]";
  private locatorSortingExpensiveFirst = "//li[text()='Сначала дорогие']";
  private locatorResultAdress =
    "//span[@data-bind='text: apartment.location.user_address']";

  //ELEMENTS
  private get tabRent() {
    return this.page.locator(this.locatorTabRent);
  }

  private get filterInputCityStreet() {
    return this.page.locator(this.locatorFilterInputCityStreet);
  }

  private get counterSearchResults() {
    return this.page.locator(this.locatorCounterSearchResults);
  }
  private get filterFlats() {
    return this.page.locator(this.locatorFilterFlats);
  }

  private get searchResultType() {
    return this.page.locator(this.locatorSearchResultType);
  }

  private get filter2Rooms() {
    return this.page.locator(this.locatorFilter2Rooms);
  }

  private get filterPriceMax() {
    return this.page.locator(this.locatorFilterPriceMax);
  }

  private get filterResultUSDprice() {
    return this.page.locator(this.locatorFilterResultUSDprice);
  }

  private get filterMetro() {
    return this.page.locator(this.locatorFilterMetro);
  }

  private get filterMetroNearMetro() {
    return this.page.locator(this.locatorFilterMetroNearMetro);
  }

  private get sortingDropdown() {
    return this.page.locator(this.locatorSortingDropdown);
  }

  private get sortingExpensiveFirst() {
    return this.page.locator(this.locatorSortingExpensiveFirst);
  }

  private get resultAdress() {
    return this.page.locator(this.locatorResultAdress);
  }

  //METHODS
  async clickRentTab() {
    await this.tabRent.click();
    await this.page.waitForURL(URLs.realtAKPageUrl, { waitUntil: "load" });
  }

  async setFilterCityStreet(input) {
    await this.filterInputCityStreet.hover();
    await this.filterInputCityStreet.fill(input);
    await this.filterInputCityStreet.press("Enter", { delay: 1000 });
  }

  async setFilterPriceMax(MaxPrice: number) {
    await this.filterPriceMax.hover();
    await this.filterPriceMax.fill(MaxPrice.toString());
    await this.filterPriceMax.press("Enter", { delay: 1000 });
  }

  async setFilterFlats() {
    await this.filterFlats.click();
  }

  async setFilter2Rooms() {
    await this.filter2Rooms.click();
  }

  async setFilterMetroNearMetro() {
    await this.filterMetro.hover();
    await this.filterMetro.click();
    await this.filterMetroNearMetro.click();
  }

  async setSortingExpensiveFirst() {
    let adressesBeforeSorting = [
      await this.resultAdress.first().innerText(),
      await this.resultAdress.nth(1).innerText(),
      await this.resultAdress.nth(2).innerText(),
    ];
    console.log("1", adressesBeforeSorting);
    // await this.page.pause();
    await this.sortingDropdown.click();
    await this.sortingExpensiveFirst.waitFor({ state: "visible" });
    await this.sortingExpensiveFirst.click();
    await expect(async () => {
      let addressesAfterSorting = [
        await this.resultAdress.first().innerText(),
        await this.resultAdress.nth(1).innerText(),
        await this.resultAdress.nth(2).innerText(),
      ];
      console.log("2", addressesAfterSorting);
      expect(adressesBeforeSorting).not.toEqual(addressesAfterSorting);
    }).toPass();
  }

  async updateResultCounter(previousResultCounter) {
    await this.page.waitForTimeout(1000);
    let currentResult = await getInnerNumber(this.counterSearchResults);
    if (previousResultCounter == currentResult) {
      await this.page.waitForTimeout(1000);
      currentResult = await this.updateResultCounter(previousResultCounter);
    }
    return currentResult;
  }

  async checkAllResultsAreFlats() {
    (await this.searchResultType.all()).forEach(async (element) => {
      expect(await element.innerText()).not.toEqual("Комната");
    });
  }

  async checkAllResultsAre2Rooms() {
    (await this.searchResultType.all()).forEach(async (element) => {
      expect(await element.innerText()).toEqual("2к");
    });
  }

  async checkMaxPriceOfResults(filterMaxPrice: number) {
    (await this.filterResultUSDprice.all()).forEach(async (resultPrice) => {
      expect(await getInnerNumber(resultPrice)).toBeLessThan(
        filterMaxPrice + 1,
      );
    });
  }
}
