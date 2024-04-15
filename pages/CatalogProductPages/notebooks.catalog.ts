import { BaseCatalog } from "./baseCatalog";

export class NotebookCatalog extends BaseCatalog {
  //LOCATORS
  private makerASUScheckboxLocator = `${this.locatorFilterMakerList}//div[contains(@class, 'i-checkbox catalog-form__checkbox catalog-form__checkbox_base')][descendant::div[contains(text(), 'ASUS')]]`;
  private selectedAsusFilterLocator =
    "//div[@class ='button-style button-style_either button-style_small catalog-form__button catalog-form__button_tag' and contains(text(), 'ASUS')]";

  private matrixHzFilterLocator =
    "//div[contains(@class, 'catalog-form__group catalog-form__group_nonadaptive catalog-form__group_width_full')][descendant::div[contains(text(), 'Частота матрицы')]]";
  private matrixMinimalHzLocator = `${this.matrixHzFilterLocator}//div[contains(@class, 'input-style__wrapper catalog-form__input-wrapper catalog-form__input-wrapper_width_full')][1]//select`;
  private matrixMaxHzLocator = `${this.matrixHzFilterLocator}//div[contains(@class, 'input-style__wrapper catalog-form__input-wrapper catalog-form__input-wrapper_width_full')][2]//select`;
  public optionsMatrix = {
    120: "120hz",
    165: "165hz",
  };
  private locatorsSelectedMatrixOptions = {
    120: "//div[@class ='button-style button-style_either button-style_small catalog-form__button catalog-form__button_tag' and contains(text(), '120 Гц')]",
    "120-165":
      "//div[@class ='button-style button-style_either button-style_small catalog-form__button catalog-form__button_tag' and contains(text(), '120 Гц - 165 Гц')]",
  };
  private Selected;

  //private matrixFilter120HzLocator = "//option[@value = '120hz']"
  //private matrixFilter165HzLocaotr = "//option[@value = '165hz']"
  // private priceFilterLocator: string = `//div[contains(@class, 'catalog-form__group catalog-form__group_nonadaptive catalog-form__group_width_full')][descendant::div[contains(text(), 'Цена')]]`;
  // private priceMinimalLocator: string = `(${this.priceFilterLocator}//input[contains(@placeholder,'от')])`;
  // private pricaMaxLocator: string = `(${this.priceFilterLocator}//input[contains(@placeholder,'до')])`;

  //ELEMENTS
  get makerASUScheckbox() {
    return this.page.locator(this.makerASUScheckboxLocator);
  }

  get selectedAsusFilter() {
    return this.page.locator(this.selectedAsusFilterLocator);
  }

  get matrixMinimalHz() {
    return this.page.locator(this.matrixMinimalHzLocator);
  }

  get matrixMaxHz() {
    return this.page.locator(this.matrixMaxHzLocator);
  }

  get selectedMatrixOptionLocator_120() {
    return this.page.locator(this.locatorsSelectedMatrixOptions[120]);
  }

  get selectedMatrixOptionLocator_120_165() {
    return this.page.locator(this.locatorsSelectedMatrixOptions["120-165"]);
  }

  //METHODS

  async checkASUSmaker() {
    await this.makerASUScheckbox.click();
  }
  async setMatrixMinimalHzFilter_120() {
    await this.matrixMinimalHz.selectOption(this.optionsMatrix[120]);
  }

  async setMatrixMaxHzFilter_165() {
    await this.matrixMaxHz.selectOption(this.optionsMatrix[165]);
  }
}
