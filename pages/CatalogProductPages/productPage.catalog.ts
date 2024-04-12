import { BaseCatalog } from "./baseCatalog";
import { PricesPage } from "./prices.catalog";
import { getInnerNumber} from "../../helpers/getInnerNum";

//interact with exact product pages pages 

export class ProductPage extends BaseCatalog{

    //LOCATORS
    private productH1TitleLocator = "//h1[@class = 'catalog-masthead__title js-nav-header']";
    private sellerOffersButtonLocator = "//a[@class='button button_orange button_big offers-description__button js-product-prices-count-link']";
    private mainPriceLocator = "//a[@class='offers-description__link offers-description__link_nodecor js-description-price-link']";


    //ELEMENTS
    get productTitleH1(){
        return this.page.locator(this.productH1TitleLocator);
    }
    
    get sellerOfferSButton(){
        return this.page.locator(this.sellerOffersButtonLocator);
    }
    
    get mainPrice (){
        return this.page.locator(this.mainPriceLocator);
        }
    


    //Methods

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



}