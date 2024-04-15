import { Locator } from "@playwright/test";
import { BasePage } from "./page";

export class NewsPage extends BasePage {
  //LOCATORS
  private newsItemLocator = "//a[contains(@class, 'news-tidings__stub')]";
  private reactionSectionLocator =
    "//div[contains(@class, 'sharethis-inline-reaction-buttons st-inline-reaction-buttons st-justified  st-has-labels st-lang-ru')]";
  private astonishedReactionLocator = `${this.reactionSectionLocator}//div[@class='st-btn' and contains(@data-reaction, 'astonished')]`;
  //private selectedAstonishedReactionLocator = `${this.reactionSectionLocator}//div[@class='st-btn st-selected' and contains(@data-reaction, 'astonished')]`
  //private astonishedReactionCounterLocator = `${this.astonishedReactionLocator}//span[contains(@class,'st-count')]`
  locatorAstonishedReaction = "//div[@data-reaction='astonished']";
  private locatorReactionCounter = "//span[contains(@class,'st-count')]";
  //div[@id='st-4']//div[@data-reaction='astonished']//span[@class='st-count']

  //ELEMENTS
  get newsItem() {
    return this.page.locator(this.newsItemLocator);
  }

  get ReactionSection() {
    return this.page.locator(this.reactionSectionLocator);
  }

  get astonishedReaction() {
    return this.page.locator(this.astonishedReactionLocator);
  }

  // get astonishedReactionCounter (){
  //     return this.page.locator(this.astonishedReactionCounterLocator);
  // }

  // get selectedAstonishedReaction (){
  //     return this.page.locator(this.selectedAstonishedReactionLocator);
  // }

  //METHODS

  async getAllNewsItems() {
    let allNews = await this.newsItem.all();
    return allNews;
  }

  async openFirstNews() {
    await this.newsItem.first().click();
  }

  async findFirstActiveReactionSection() {
    await this.scrollUntilReactionSection();
    await this.ReactionSection.first().scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(2000);
    const id = await this.ReactionSection.first().getAttribute("id");
    console.log(id);
    const locatorReactionSectionById = `//div[@id='${id}']`;
    return locatorReactionSectionById;
  }

  async countAstonishedReaction(locatorReactionSectionById: string) {
    const counter = await this.page
      .locator(
        locatorReactionSectionById +
          this.locatorAstonishedReaction +
          this.locatorReactionCounter,
      )
      .innerText();
    return counter;
  }

  async clickReactionAstonished(sectionLocator) {
    let element = this.page.locator(
      sectionLocator + this.locatorAstonishedReaction,
    );
    await element.click();
  }

  async getClassName(sectionLocatorWithId) {
    await this.page.locator(sectionLocatorWithId).hover();
    let className = await this.page
      .locator(sectionLocatorWithId)
      .getAttribute("class");
    return className;
  }

  async scrollUntilReactionSection() {
    let foundReactionSection = false;

    while (!foundReactionSection) {
      // Проверяем, есть ли секция со смайликами
      const ReactionSectionСounter = await this.ReactionSection.count();
      if (ReactionSectionСounter > 1) {
        foundReactionSection = true;
      } else {
        await this.page.keyboard.press("PageDown");
      }
    }
  }
}
