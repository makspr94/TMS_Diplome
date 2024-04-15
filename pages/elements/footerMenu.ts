import { CatalogMainPage } from "../catalogMain.page";
import { BasePage } from "../page";
import { getInnerNumber } from "../../helpers/getInnerNum";
import { CartPage } from "../cart.page";
import { URLs } from "../../data/URLs";
import { CurrencyPage } from "../currency.page";
import { realtPage } from "../realt.page";
import { CustomerSupportPage } from "../customerSupport.page";

export class FooterMenu extends BasePage {
  //LOCATORS
  private locatorButtonCustomerSupport =
    "//a[@href='https://support.onliner.by']";

  //ELEMENTS
  private get buttonCustomerSupport() {
    return this.page.locator(this.locatorButtonCustomerSupport);
  }

  //METHODS
  async clickButtonCustomerSupport() {
    await this.buttonCustomerSupport.click();
    await this.page.waitForURL(URLs.customerSupportUrl, { waitUntil: "load" });
    return new CustomerSupportPage(this.page);
  }
}
