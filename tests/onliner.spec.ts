import { test, expect, Page, chromium } from '@playwright/test';
import { MainPage } from '../pages/main.page';
import { validUser } from '../data/userData';
import { mainPageUrl } from '../data/URLs';
import { randomEmail } from '../helpers/random';
import { randomString } from '../helpers/random';
import { NewsPage } from '../pages/news.page';


import fs from 'fs';
import { HeaderMenu } from '../pages/elements/headerMenu';
import { CatalogMainPage } from '../pages/catalogMain.page';


//const authFile = 'data/.auth/user.json';

test.describe.configure({mode: 'parallel'});

test.describe ("1. Onliner tests with authonticated user", async () => {
       let mainPage: MainPage;
       let headerMenu: HeaderMenu

    test ('login with valid credentials', async ({page, context})=>{
        await page.goto(mainPageUrl);
        mainPage = new MainPage(page);
        let loginPage = await mainPage.openLoginPage();
        await expect(loginPage.loginForm).toBeVisible();
        await loginPage.logIn(validUser.email, validUser.password);
        await page.bringToFront();
        await page.pause();
        await expect(mainPage.userAvatar).toBeVisible();
        //await page.context().storageState({path:authFile});
        const cookies = await page.context().cookies();
        fs.writeFileSync('./data/.auth/cookies.json', JSON.stringify(cookies));
       
    })

    test ('3. Reaction icons in AUTO news', async({page, context})=>{

        const cookies = JSON.parse(fs.readFileSync('./data/.auth/cookies.json', 'utf8'));
        await context.addCookies(cookies);
        
        await page.goto(mainPageUrl);

        mainPage = new MainPage(page);

        let newsPage = await mainPage.openFirstAutoNews();
        //await page.goto('https://auto.onliner.by/2024/04/05/voditel-napal-s-bitoj');
        //await page.pause();
        await newsPage.hoverFirstReactionSection();
        let CurrentReactionCounter = await newsPage.countAstonishedReactions();
        console.log(await newsPage.ReactionSection.isEnabled());
        await newsPage.clickReaction();
        console.log(await newsPage.ReactionSection.isDisabled());
        
        // Нажать на икноку 	"Остальные иконки перестали быть активными (кликабельными)
        // Количество соответствующих оценок увеличилось на 1"
        // Нажать на икноку                повторно	Оценка не снялась, кол-во оценок осталось прежним

        await page.pause();
        
        
    })
  
   





})

test.describe ("Onliner tests without authantication", async () => {
    let mainPage: MainPage; 
    let headerMenu: HeaderMenu

    test.beforeEach(async ({page, context}) => {
        await page.goto(mainPageUrl);
        mainPage = new MainPage(page);
        headerMenu = new HeaderMenu(page)
    })
    

    
    
    test ('2. registration', async ({page, context}) => {
        let loginPage = await mainPage.openLoginPage();
        await expect(loginPage.loginForm).toBeVisible();
        // Перейти по ссылке "Зарегистрироваться на Onliner"	Открылась форма регистрации
        let registrationPage = await loginPage.openRegisterForm();
        await expect(registrationPage.regForm).toBeVisible();
        // Ввести валидный email, принять условия соглашения	
        await registrationPage.inputValidEmail(await randomEmail({domain: 'gmail.com'}));
        await registrationPage.clickPolicyCheckbox();
        // Нажать на кнопку "Зарегистрироваться" => Поля пароля подсвечены, отображается алерт "Укажите пароль"
        await registrationPage.clickRegButton();
        await page.waitForTimeout(1000);
        expect(await registrationPage.getFieldColor(registrationPage.passwordField)).toEqual("rgb(255, 231, 230)");
        expect(await registrationPage.getFieldColor(registrationPage.repeatPasswordField)).toEqual("rgb(255, 231, 230)");
        await expect (registrationPage.passwordErrorMessage).toBeVisible();
        await expect (registrationPage.repeatPasswordErrorMessage).toBeVisible();
        // Ввести пароль в оба поля пароля (12 символов) => "Очень надежный пароль, 12 символов" отображается около поля пароля
        const passwordLenght: number = 12;
        let randomPassword = await randomString.generate(passwordLenght); 
        await registrationPage.passwordField.fill(randomPassword);
        await registrationPage.repeatPasswordField.fill(randomPassword);
        await expect( registrationPage.secureBoxMessage).toContainText("Очень надежный пароль");
        let secureMessage = await registrationPage.getSecureMessageTextContent();
        if (secureMessage != null){
            const numberMatch = secureMessage.match(/\d+/);
            let number = numberMatch ? parseInt(numberMatch[0], 10) : null;
            expect(number).toEqual(passwordLenght);
        }
        // Нажать на кнопку "Зарегистрироваться" => Окно с просьбой подтверждения имейла открыто, отображается кнопка "перейти в почту"
        await registrationPage.regButton.click();
        await expect (registrationPage.confirmEmailForm).toBeVisible();
        await expect (registrationPage.goToMailButton).toBeVisible();       
        
    })


    test('4. Quick search on main page', async ({page})=>{
             
        // Ввести в поле поиска "Карты памяти"	Открылся попап поиска, среди результатов поиска присутствует ссылка на соответствующую категорию
        await mainPage.inputInQuickSearch('Карты памяти');
        await expect(mainPage.QuickSearchFrame).toBeVisible();
        const iFrame = await mainPage.SwitchToQuickSearchframe();
        
        const searchResultLocator = "//div[@class='result__wrapper']"
        const memCardsSearchLocator = "//div[@class='result__wrapper']//a[contains(text(),'Карты памяти') and @href='https://catalog.onliner.by/memcards']";
        const iFrameSearchInputLocator = "//input[@class='search__input']";

        await expect(iFrame.locator(memCardsSearchLocator)).toBeVisible();

        // Очистить поле поиска	Результаты поиска не отображаются
        await iFrame.locator(iFrameSearchInputLocator).clear();
        await expect( async () => {
            expect(await iFrame.locator(searchResultLocator).count()).toEqual(0);
        }).toPass()
        // Ввести название товара (любой уникальный)	В результатах поиска присутствует искомый товар, для него отображается цена, кнопка "Предложения"
        const mySearchRequest = 'bose quiet'
        await iFrame.locator(iFrameSearchInputLocator).fill(mySearchRequest);
        await iFrame.locator(searchResultLocator).first().waitFor()
        let allFoundResultLocators = await iFrame.locator(searchResultLocator+"//a[contains(@class, 'product__title-link')]").all();
        let allFoundResultPrices = await iFrame.locator(searchResultLocator+"//a[contains(@class, 'product__price-value product__price-value_primary')]").all();
        let allFoundResultOfferButtons = await iFrame.locator(searchResultLocator+"//a[contains(@class, 'button button_orange product__button')]").all();
        expect(allFoundResultLocators.length).toEqual(allFoundResultOfferButtons.length);
        expect(allFoundResultLocators.length).toEqual(allFoundResultPrices.length);
        for await (const locator of allFoundResultLocators) {
           let resultTitle =  await locator.innerText();
           expect(resultTitle.toLocaleLowerCase()).toContain(mySearchRequest);
            
        };
        
        // Нажать на название найденного товара	Открыта страница товара, название соответствует искомому
        let secondFoundProduntTitle = await allFoundResultLocators[1].innerText();
        await allFoundResultLocators[1].click();
        //await page.pause();
        await page.locator("//h1[@class='catalog-masthead__title js-nav-header']").waitFor();
        let openedProductTitle = await page.locator("//h1[@class='catalog-masthead__title js-nav-header']").innerText();
        expect(openedProductTitle).toEqual(secondFoundProduntTitle);
    })

    test.only('Catalog page filtering', async ({page})=>{
        //Открыть https://www.catalog.onliner.by/	
      
        // Перейти в категорию "Компьютеры и сети" ->
        //-> "Ноутбуки и комплектующие" -> "Ноутбуки"	
        //result: Открыта страница каталога "Ноутбуки". Заголовок страницы = "Ноутбуки"

        let catalogMainPage = await headerMenu.openCatalog();
        let notebooksPage = await catalogMainPage.openNotebookCatalog();


        expect(page.url()).toEqual("https://catalog.onliner.by/notebook")
        expect(await notebooksPage.productCatalogTitleText).toContain('Ноутбуки');
        await page.pause(); 
        
        
        // Установить Производитель = ASUS	В верхней части страницы появился фильтр "ASUS". Уменьшилось число найденных товаров
        // Установить Частота матрицы от 120 до 165 Гц	В верхней части страницы появился фильтр "120 - 165 Гц". Уменьшилось число найденных товаров. Фильтр "ASUS" также присутствует
        // Применить фильтр "Суперцена"	В верхней части страницы появился фильтр "Суперцена". Отображаются только товары со значком            \
        // Удалить фильтр "ASUS"	Фильтр ASUS удален, все остальные - присутствуют
    })

}) 






