import { URLs } from "../data/URLs";
import { NotebookCatalog } from "./CatalogProductPages/notebooks.catalog";
import { TVsCatalog } from "./CatalogProductPages/tv.catalog";
import { BasePage } from "./page"

export class CatalogMainPage extends BasePage{
    
    //LOCATORS
    private locatorL1PcAndNetworsLocator = "//span[contains(@class,'catalog-navigation-classifier__item-title-wrapper') and contains(text(),'Компьютеры и сети')]";
    private locatorL1Electronics = "//span[contains(@class,'catalog-navigation-classifier__item-title-wrapper') and contains(text(),'Электроника')]"
    private locatorL2TVandVideo = "//div[text()[normalize-space()='Телевидение и видео']]"
    private locatorL3Notebooks = "//span[contains(@class,'catalog-navigation-list__dropdown-title') and contains(text(),'Ноутбуки')]"
    private locatorL3TVs = "//span[contains(@class,'catalog-navigation-list__dropdown-title') and contains(text(),'Телевизоры')]"


    //ELEMENTS
    private get l1PcAndNetworks(){
        return this.page.locator(this.locatorL1PcAndNetworsLocator)
    }

    private get l1Electronics(){
        return this.page.locator(this.locatorL1Electronics);
    }

    private get l2TVandVideo(){
        return this.page.locator(this.locatorL2TVandVideo);
    }
    
    private get l3Notebooks(){
        return this.page.locator(this.locatorL3Notebooks);
    }

    private get l3TVs(){
        return this.page.locator(this.locatorL3TVs);
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

    async openTVsCatalog(){
        await this.l1Electronics.click();
        if (await this.l2TVandVideo.isVisible()){
            await this.l2TVandVideo.hover();
            await this.l3TVs.click();
        }
        else {await this.openTVsCatalog()};
        await this.page.waitForURL(URLs.TVsCatalogUrl, {waitUntil:"load"});
        return new TVsCatalog(this.page);
    }

}