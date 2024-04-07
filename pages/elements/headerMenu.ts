
import { CatalogMainPage } from "../catalogMain.page";
import { BasePage } from "../page";

export class HeaderMenu extends BasePage {
   
    //LOCATORS
    private catalogButtonLocator = "//span[contains(@class, 'b-main-navigation__text') and text()='Каталог']"


    //ELEMENTS 
    get catalogButton(){
        return this.page.locator(this.catalogButtonLocator);
    }

    //METHODS

    async openCatalog(){
        this.catalogButton.click();
        return new CatalogMainPage(this.page);
    }  
}