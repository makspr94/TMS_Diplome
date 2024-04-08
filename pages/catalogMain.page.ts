import { URLs } from "../data/URLs";
import { NotebookCatalog } from "./CatalogProductPages/notebooks.catalog";
import { BasePage } from "./page"

export class CatalogMainPage extends BasePage{
    
    //LOCATORS
    private l1PcAndNetworsLocator = "//span[contains(@class,'catalog-navigation-classifier__item-title-wrapper') and contains(text(),'Компьютеры и сети')]";
    private l3NotebooksLocator = "//span[contains(@class,'catalog-navigation-list__dropdown-title') and contains(text(),'Ноутбуки')]"



    //ELEMENTS
    get l1PcAndNetworks(){
        return this.page.locator(this.l1PcAndNetworsLocator)
    }

    get l3Notebooks(){
        return this.page.locator(this.l3NotebooksLocator);
    }


    //METHODS

    async openNotebookCatalog(){
        await this.l1PcAndNetworks.click();
        if (await this.l3Notebooks.isVisible()){
            await this.l3Notebooks.click();
        }
        else {await this.openNotebookCatalog()};
        await this.page.waitForURL(URLs.NotebookCatalogUrl, {waitUntil:"load"});
        
        
        return new NotebookCatalog(this.page);

    }

}