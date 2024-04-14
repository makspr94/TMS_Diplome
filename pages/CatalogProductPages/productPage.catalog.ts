import { BaseCatalog } from "./baseCatalog";
import { PricesPage } from "./prices.catalog";
import { getInnerNumber} from "../../helpers/getInnerNum";
import { expect } from "@playwright/test";
import { URLs } from "../../data/URLs";
import { ComparisonPage } from "./comparison.catalog";

//interact with exact product pages pages 

export class ProductPage extends BaseCatalog{

    //LOCATORS
    private locatorProductH1Title = "//h1[@class = 'catalog-masthead__title js-nav-header']";
    private locatorSellerOffersButton = "//a[@class='button button_orange button_big offers-description__button js-product-prices-count-link']";
    private locatorMainPrice = "//a[@class='offers-description__link offers-description__link_nodecor js-description-price-link']";
    private locatorCheckboxAddToCompare = "//li [@id='product-compare-control']//span[@class='i-checkbox__faux']";

    //ELEMENTS
    get productTitleH1(){
        return this.page.locator(this.locatorProductH1Title);
    }
    
    private get sellerOfferSButton(){
        return this.page.locator(this.locatorSellerOffersButton);
    }
    
    private get mainPrice (){
        return this.page.locator(this.locatorMainPrice);
        }
    
    private get checkboxAddToCompare(){
        return this.page.locator(this.locatorCheckboxAddToCompare);
    }
    


    //METHODS

    async clickSellersOffersButton(){
        await this.sellerOfferSButton.click();
        return new PricesPage(this.page)
    }

    async getMainPriceValue(){
        return await getInnerNumber(this.mainPrice)
    }

    async getProductTitleText(){
        return (await this.productTitleH1.innerText()).trim();
    }

    async addToCompare(){
        await this.checkboxAddToCompare.check();
        await expect(this.checkboxAddToCompare).toBeChecked();
    }

    async clickOnComparisonPopup(){
        await this.popupComparison.click();
        await this.page.waitForURL(`${URLs.comparisonPageUrl}\/**`,{waitUntil:"load"});
        return new ComparisonPage(this.page)
    }



}