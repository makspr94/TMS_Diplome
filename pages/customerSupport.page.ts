import { expect } from "@playwright/test";
import { BasePage } from "./page";
import { randomHelpers } from "../helpers/random";

export class CustomerSupportPage extends BasePage {
    // LOCATORS
    private locatorFieldName = "//input[@name='supportform[name]']";
    private locatorFieldEmail = "//input[@name='supportform[email]']";
    private locatorDropdownTracker = "//select[@name='supportform[tracker]']";
    private locatorDropdownCategory = "//select[@name='supportform[category]']";
    
    private optionsDropdownTracker = {
        bug: "Возникла проблема или ошибка",
        feature: "Хочу больше возможностей!",
        newfunction: "Хочу предложить новую функцию или сервис"
    }

    private optionsDropdownCategory = {
        forum: "Форум",
        catalog: "Каталог",
        baralog: "Барахолка в каталоге",
    }

    private locatorFieldSubject = "//input[@name='supportform[subject]']";
    private locatorFieldDescription = "//textarea[@name='supportform[description]']"
    private locatorFieldCaptcha = "//input[@name='supportform[captcha_keystring]']";
    private locatorImgCaptcha = "//img[@class='captcha']";
    private locatorButtonSubmit =  "//input[@name='supportform[submit]']";   

    //ELEMENTS
    private get fieldName(){
        return this.page.locator(this.locatorFieldName);
    }
    private get fieldEmail(){
        return this.page.locator(this.locatorFieldEmail);
    }

    private get dropdownTracker(){
        return this.page.locator(this.locatorDropdownTracker);
    }

    private get dropdownCategory(){
        return this.page.locator(this.locatorDropdownCategory);
    }

    get fieldSubject(){
        return this.page.locator(this.locatorFieldSubject);
    }

    get fieldDescription(){
        return this.page.locator(this.locatorFieldDescription);
    }

    get fieldCaptcha(){
        return this.page.locator(this.locatorFieldCaptcha);
    }

    get imgCaptcha(){
        return this.page.locator(this.locatorImgCaptcha);
    }
    
    get buttonSubmit(){
        return this.page.locator(this.locatorButtonSubmit);
    }

    //METHODS

    async fillInFieldName(name){
        await this.fieldName.fill(name);
        await expect(this.fieldName).toHaveValue(name);
    }

    async clearFieldName(){
        await this.fieldName.clear();
        await this.page.keyboard.press('Tab');
        await expect(this.fieldName).toHaveValue('Anonymous');
    }

    async fillFieldEmailRandomString(){
        let randomString = await randomHelpers.randomString.generate(6);
        await this.fieldEmail.fill(randomString);
        await this.page.keyboard.press('Tab');
        await expect(this.fieldEmail).toHaveClass('i-p error');
        const borderColor = await this.getFieldColor(this.fieldEmail);
        expect(borderColor).toEqual('rgb(255, 0, 0)') //red color - invalid data in the field
        

    }

    async fillFieldEmailCorrectEmail(){
        let randomEmail = await randomHelpers.randomEmail({domain: 'gmail.com'});
        await this.fieldEmail.fill(randomEmail);
        await this.page.keyboard.press('Tab');
        await expect(this.fieldEmail).toHaveClass('i-p valid');
        const borderColor = await this.getFieldColor(this.fieldEmail);
        expect(borderColor).toEqual('rgb(175, 175, 175)') //neutral color - valid data in the field

    }

    async getFieldColor(element){
        const computedStyles = await element.evaluate((element) => {
            const styles = window.getComputedStyle(element);
            return styles.borderBottomColor;
        })
        return computedStyles;
    }

    async checkDrowdownTracker(){
        await this.dropdownTracker.selectOption(this.optionsDropdownTracker.bug);
        await expect(this.dropdownTracker).toHaveValue(/bug/);
        await expect(this.dropdownTracker).toContainText(this.optionsDropdownTracker.bug);
        await this.dropdownTracker.selectOption(this.optionsDropdownTracker.feature);
        await expect(this.dropdownTracker).toHaveValue(/feature/);
        await expect(this.dropdownTracker).toContainText(this.optionsDropdownTracker.feature);
        await this.dropdownTracker.selectOption(this.optionsDropdownTracker.newfunction);
        await expect(this.dropdownTracker).toHaveValue(/newfunction/);   
        await expect(this.dropdownTracker).toContainText(this.optionsDropdownTracker.newfunction);
    }

    async checkDrowdownCategory(){
        await this.dropdownCategory.selectOption(this.optionsDropdownCategory.baralog);
        await expect(this.dropdownCategory).toContainText(this.optionsDropdownCategory.baralog);
        await expect(this.dropdownCategory).toHaveValue(/baralog/);
       
        await this.dropdownCategory.selectOption(this.optionsDropdownCategory.catalog);
        await expect(this.dropdownCategory).toContainText(this.optionsDropdownCategory.catalog);
        await expect(this.dropdownCategory).toHaveValue(/catalog/);
        
        await this.dropdownCategory.selectOption(this.optionsDropdownCategory.forum);
        await expect(this.dropdownCategory).toContainText(this.optionsDropdownCategory.forum);
        await expect(this.dropdownCategory).toHaveValue(/forum/);   
        
    }

    

   
}