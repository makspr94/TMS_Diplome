import { BasePage } from "./page";
import { Page, FrameLocator } from "@playwright/test";


export class QuickSearhFrame extends BasePage  {
    //LOCATOR
    private quickSearchInputLocator = "//input[contains(@class,'fast-search__input')]";
    private quickSearchFrameLocator = "//iframe[@src='/sdapi/catalog/search/iframe']";

    //ELEMENT

    get quickSearchInputField (){
        return this.page.locator(this.quickSearchInputLocator);
    }

    get QuickSearchFrame(){
        return this.page.locator(this.quickSearchFrameLocator);
    }

    //METHODS

    async inputInQuickSearch(text: string){
        this.quickSearchInputField.fill(text);
    }



    async iFrame (){
        

    }
    
    
    
//     static quickSearchFrameLocator = "//iframe[@src='/sdapi/catalog/search/iframe']";

//     static async SwitchToQuickSearchframe(){
//         return this.page.frameLocator(this.quickSearchFrameLocator);
//     };

//     static getMemCardsSearch(){
//         return this.page.locator(this.memCardsSearchLocator);
//     }

    
    
    
//     //locators
   
//     private memCardsSearchLocator = "//div[@class='result__wrapper']//a[contains(text(),'Карты памяти') and @href='https://catalog.onliner.by/memcards']"
    

//     //Elements
//     get memCardsSearch (){
//         return this.page.locator(this.memCardsSearchLocator);
//     }

//     Methods


// }

// class MyFrame {
//     constructor(page) {
//         this.page = page;
//     }

//     async getFrame() {
//         // Wait for the iframe to be attached to the page
//         const frameElement = await this.page.waitForSelector('#my-frame');
//         // Get the frame object
//         return await frameElement.contentFrame();
//     }

//     async clickSubmitButton() {
//         const frame = await this.getFrame();
//         const button = await frame.waitForSelector('text=Submit');
//         await button.click();
//     }
}