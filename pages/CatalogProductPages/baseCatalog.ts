import { Page, expect } from "@playwright/test";
import { BasePage } from "../page";
import { getInnerNumber} from "../../helpers/getInnerNum";

export class BaseCatalog {
    constructor(protected page: Page) {}


    //LOCATORS
    protected productCatalogTitleLocator = "//h1[@class='catalog-form__title catalog-form__title_big-alter']";
    protected FilterMakerListLocator = "//div[contains(@class, 'catalog-form__group catalog-form__group_nonadaptive catalog-form__group_width_full')][descendant::div[contains(text(), 'Производитель')]]";
    protected numberOfProductsLocator = "//span[@class ='catalog-interaction__sub catalog-interaction__sub_main']";
    protected superPriceLabelLocator = "//label[@class='catalog-form__bonus-item catalog-form__bonus-item_additional']"
    protected selectedSuperPriceLabelLocator = "//div[@class ='button-style button-style_either button-style_small catalog-form__button catalog-form__button_tag' and contains(text(), 'Суперцена')]";


    protected productTileLocator = "//div[@class='catalog-form__offers-flex']";
    protected superPriceInProductTileLocator = `${this.productTileLocator}//div[@class='catalog-form__popover-trigger catalog-form__popover-trigger_hot-secondary']`
    
    //ELEMENTS
    get productCatalogTitleText (){
        return this.page.locator(this.productCatalogTitleLocator).innerText();
    }

    private get numberOfFilteredProducts(){
        return this.page.locator(this.numberOfProductsLocator);
    }

    private get superPriceFilter(){
        return this.page.locator(this.superPriceLabelLocator);
    }

    private get productTile(){
        return this.page.locator(this.productTileLocator);
    }

    get superPriceInProductTile(){
       return this.page.locator(this.superPriceInProductTileLocator); 
    }

    get selectedSuperPriceLaber(){
        return this.page.locator(this.selectedSuperPriceLabelLocator);
    }



    //METHODS

    async getNumberOfProducts(){
       return await getInnerNumber(this.numberOfFilteredProducts);
    }

    async getChangedNumOfProducts(previousNumOfProducts){
        let changedNumber = await getInnerNumber(this.numberOfFilteredProducts);
        while (changedNumber == previousNumOfProducts){
            await this.page.waitForTimeout(2000)
            changedNumber = await this.getChangedNumOfProducts(changedNumber);
        }
        expect(changedNumber).not.toEqual(previousNumOfProducts); //test if current number != to previous number of filtered products 
        return changedNumber;
    }

    async selectSuperPriceFilter(){
        await this.superPriceFilter.click();
    }

    async countAllProductTiles(){
        return await this.productTile.count();
    }

    async CountAllSuperPricesInProductCount(){
        return await this.superPriceInProductTile.count();
    }


}