import { BasePage } from "./page";

export class NewsPage extends BasePage {
    //LOCATORS
    private newsItemLocator = "//a[contains(@class, 'news-tidings__stub')]";
    private reactionSectionLocator = "//div[contains(@class, 'sharethis-inline-reaction-buttons st-inline-reaction-buttons st-justified  st-has-labels st-lang-ru')]";
    private astonishedReactionLocator = `${this.reactionSectionLocator}//div[@class='st-btn' and contains(@data-reaction, 'astonished')]`
    private selectedAstonishedReactionLocator = `${this.reactionSectionLocator}//div[@class='st-btn st-selected' and contains(@data-reaction, 'astonished')]`
    private astonishedReactionCounterLocator = `${this.astonishedReactionLocator}//span[contains(@class,'st-count')]`
    //ELEMENTS
    get newsItem(){
        return this.page.locator(this.newsItemLocator);
    }

    get ReactionSection (){
        return this.page.locator(this.reactionSectionLocator);
    }
    
    get astonishedReaction (){
        return this.page.locator(this.astonishedReactionLocator);
    }

    get astonishedReactionCounter (){
        return this.page.locator(this.astonishedReactionCounterLocator);
    }

    get selectedAstonishedReaction (){
        return this.page.locator(this.selectedAstonishedReactionLocator);
    }

    //METHODS

    async getAllNewsItems(){
        let allNews = await this.newsItem.all();
        return allNews;
    }

    async openFirstNews(){
        await this.newsItem.first().click();
    }

    async findFirstActiveReactionSection(){
        await this.scrollUntilReactionSection();
        await this.ReactionSection.scrollIntoViewIfNeeded();
        const id = await this.ReactionSection.getAttribute('id');
        const reactionSectionById = this.page.locator(`//div[@id='${id}']`);
        return reactionSectionById;
        

    } 

    async countAstonishedReaction(reactionSectionById){
        return await this.astonishedReactionCounter.first().innerText();
    }

    async clickReaction(){
        this.astonishedReaction.click()
    }

    async scrollUntilReactionSection() {
        let foundReactionSection = false;
    
        while (!foundReactionSection) {
            // Проверяем, есть ли секция со смайликами
            const ReactionSection = await this.ReactionSection.count();
            if (ReactionSection != 0) {
                foundReactionSection = true;
            } else {
                // Прокручиваем страницу вниз
               await this.page.keyboard.press("PageDown");
                
            }
        }
    }
    
    
}