import { Locator } from "@playwright/test";
import { getInnerNumber } from "../../helpers/getInnerNum";
import { BaseCatalog } from "./baseCatalog";

export class PricesPage extends BaseCatalog{
    //LOCATORS
    private locatorSectionOfferList = "//div[@class='offers-filter__part offers-filter__part_2']"
    private locatorDropdownSortingOffersList = "//select[@class='input-style__real']";
    private optionsDropdownSortingOffersList = {
        ascending: "price:asc",
        descending: "price:desc",
        byRating: "shop_rating:desc"
    }
    private locatorTileOffer = "//div[@class='offers-list__item']";
    private locatorOrangeButtonAddtoCart = `//div[@class = 'offers-list__control offers-list__control_default helpers_hide_tablet']//a[@class='button-style button-style_base-alter offers-list__button offers-list__button_cart button-style_expletive']`
    private locatorGreenButtonAddedinCart = "//div[@class = 'offers-list__control offers-list__control_default helpers_hide_tablet']//a[@class='button-style button-style_base-alter offers-list__button offers-list__button_cart button-style_another']"
    private locatorSectionRecommendedSidebar = "//div[@class = 'product-recommended__sidebar-overflow']";
    private locatorButtonCloseRecommendedSidebar = `//div[@class='product-recommended__sidebar-close']`
    private locatorPriceInOfferTile = "//div[@class='offers-list__description offers-list__description_alter-other offers-list__description_huge-alter offers-list__description_font-weight_bold offers-list__description_ellipsis offers-list__description_nodecor']";

    //ELEMENT
    get sectionOffersList () {
        return this.page.locator(this.locatorSectionOfferList);
    }

    get dropdownSortingOffersList (){
        return this.page.locator(this.locatorDropdownSortingOffersList);
    }
    
    get tileOffer(){
        return this.page.locator(this.locatorTileOffer);
    }

    get orangeButtonAddToCart(){ 
        return this.page.locator(this.locatorOrangeButtonAddtoCart);
    }
    
    get greenButtonAddedinCart(){
        return this.page.locator(this.locatorGreenButtonAddedinCart)
    }

    get sectionRecommendedSidebar(){
        return this.page.locator(this.locatorSectionRecommendedSidebar);
    }

    get buttonCloseRecommendedSidebar(){
        return this.page.locator(this.locatorButtonCloseRecommendedSidebar);
    }

    get priceInOfferTile(){
        return this.page.locator(this.locatorPriceInOfferTile);
    } 




    //METHODS
    async sortOffers_ascending(){
        this.dropdownSortingOffersList.selectOption(this.optionsDropdownSortingOffersList.ascending);
        this.page.waitForTimeout(1000);
    }

    async clickOrangeButtonFirstOffer(){     
        this.orangeButtonAddToCart.first().click();
    }

    async closeRecommendationSidebar(){
        await this.page.waitForTimeout(2000);
        if (await this.sectionRecommendedSidebar.isVisible()){
            await this.buttonCloseRecommendedSidebar.click();
            await this.page.waitForTimeout(2000);
        }
    }

    async getPriceInOfferTile(elementOfferTile:Locator){

        let price = getInnerNumber(elementOfferTile.locator(this.priceInOfferTile));
        return price
    }


}