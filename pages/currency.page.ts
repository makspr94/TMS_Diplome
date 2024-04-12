import { expect } from "@playwright/test";
import { isToday } from "../helpers/dateCheck";
import { BasePage } from "./page";
import { assert } from "console";

export class CurrencyPage extends BasePage{
    //LOCATORS
    private locatorH1Header ="//h1[text()='Лучшие курсы валют'] ";
    private locatorTodaysDate = "//th[@class='th-first']";
    private locatorButtonBuy = "//label[@for='buy']";
    private locatorInputConverter = "//div[@class='amount-i']//input[1]";
    private locatorConvertionResult = "//*[contains(@class,'js-cur-result')]";
    private LocatorEurBestBuyingRate = "(//p[@class='value fall']//b)[4]";  
    private locatorDropdownTypesCurrencyIn = "//li[@class='select']//select[1]";
    private optionsTypesCurrencyIn = {
        USD: "usd",
        EUR: "eur",
        RUB: "rub",
        BYN: "byn"
    }

    //ELEMENTS
    get H1Header(){
        return this.page.locator(this.locatorH1Header);
    }
    
    get todaysDate(){
       return this.page.locator(this.locatorTodaysDate);
    }

    get buttonBuy(){
        return this.page.locator(this.locatorButtonBuy);
    }

    get inputConverter(){
        return this.page.locator(this.locatorInputConverter);
    }

    get dropdownTypesCurrencyIn(){
        return this.page.locator(this.locatorDropdownTypesCurrencyIn);
    }

    get EurBestBuyingRate(){
        return this.page.locator(this.LocatorEurBestBuyingRate);
    }

    get ConvertionResult(){
        return this.page.locator(this.locatorConvertionResult);
    }

    //METHODS
    async checkCurrentDate(){
        isToday(await this.todaysDate.innerText());
    }

    async clickButtonBuy(){
        await this.buttonBuy.click();
        await expect(this.buttonBuy).toHaveClass("state-2 selected");
    }

    async inputTextInConverter(text:string){
        await this.inputConverter.pressSequentially(text);
    }

     async inputNumberInConverter(number: number){
        await this.inputConverter.fill(number.toString());
        await expect(this.inputConverter).toHaveValue(number.toString());
     }

     async selectEurInConverter(){
        await this.dropdownTypesCurrencyIn.selectOption(this.optionsTypesCurrencyIn.EUR);
    }

    async getEurBestBuyingRate(): Promise<number> {
        let EurBestBuyingRateText = (await this.EurBestBuyingRate.textContent())?.replace(" BYN", "");
        return +(EurBestBuyingRateText ?? "0").replace(",", ".");
    }

    async getConvertionResult(): Promise<number> {
        let convertionResultText = await this.ConvertionResult.textContent();
        return +(convertionResultText ?? "0").replace(" ", "").replace(",", ".");
    }

}



