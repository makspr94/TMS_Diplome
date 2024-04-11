import { test, expect, Page, chromium } from '@playwright/test';
import { MainPage } from '../pages/main.page';
import { validUser } from '../data/userData';
import { URLs } from '../data/URLs';
import { randomEmail } from '../helpers/random';
import { randomString } from '../helpers/random';
import { NewsPage } from '../pages/news.page';
import fs from 'fs';
import { HeaderMenu } from '../pages/elements/headerMenu';
import { CatalogMainPage } from '../pages/catalogMain.page';
import { ProductPage } from '../pages/CatalogProductPages/productPage.catalog';
import { PricesPage } from '../pages/CatalogProductPages/prices.catalog';
import { CartPage } from '../pages/cart.page';


//const authFile = 'data/.auth/user.json';

test.describe.configure({mode: 'parallel'});



test.describe ("1. Тесты с авторизованным пользователем", async () => {
    let mainPage: MainPage;
    let headerMenu: HeaderMenu;
    let cartPage: CartPage;
    
    test ('1. Вход с валидными кредами', async ({page, context})=>{
        await page.goto(URLs.mainPageUrl);
        mainPage = new MainPage(page);
        let loginPage = await mainPage.openLoginPage();
        await expect(loginPage.loginForm).toBeVisible();
        await loginPage.logIn(validUser.email, validUser.password);
        await page.bringToFront();
        await page.pause(); //pause for CAPTCHA
        await expect(mainPage.userAvatar).toBeVisible();
        //await page.context().storageState({path:authFile});
        const cookies = await page.context().cookies();
        fs.writeFileSync('./data/.auth/cookies.json', JSON.stringify(cookies));
       
    })

    test ('3. Пользователь может поставить оценку статье', async({page, context})=>{

        const cookies = JSON.parse(fs.readFileSync('./data/.auth/cookies.json', 'utf8'));
        await context.addCookies(cookies);
        await page.goto(URLs.mainPageUrl);
        mainPage = new MainPage(page);

        let newsPage = await mainPage.openFirstAutoNews();
        await newsPage.hoverFirstReactionSection();
        let CurrentReactionCounter = await newsPage.countAstonishedReactions();
        console.log(await newsPage.ReactionSection.isEnabled());
        await newsPage.clickReaction();
        console.log(await newsPage.ReactionSection.isDisabled());
        
        // Нажать на икноку 	"Остальные иконки перестали быть активными (кликабельными)
        // Количество соответствующих оценок увеличилось на 1"
        // Нажать на икноку                повторно	Оценка не снялась, кол-во оценок осталось прежним
    })

    test.only ('6. Пользователь может оформить заказ (до оплаты)', async({page, context}) =>{
         // Открыть https://www.onliner.by/	
        const cookies = JSON.parse(fs.readFileSync('./data/.auth/cookies.json', 'utf8'));
        await context.addCookies(cookies);
        await page.goto(URLs.mainPageUrl);
        mainPage = new MainPage(page);

       // Открыть страницу товара (ч/з поиск)	Открыта страница товара
       const searchRequest = "Наушники Bose 45";
       const searchResultLocator = "//div[@class='result__wrapper']"
        const searchResultTitleLocator = `${searchResultLocator}//a[contains(@class, 'product__title-link')]`;
        await mainPage.inputInQuickSearch(searchRequest);
        const iFrame = await mainPage.SwitchToQuickSearchframe();
        await iFrame.locator(searchResultTitleLocator).first().waitFor();
        await iFrame.locator(searchResultTitleLocator).first().click();
        let productPage = new ProductPage(page);
        expect(productPage.productTitleH1).toBeVisible();
        let minimalProductPrice = await productPage.getMainPriceValue();
        let productTitle = await productPage.productTitleH1.textContent();
        console.log(productTitle);
        // Перейти на вкладку "Предложения продавцов"	Открыта вкладка "Предложения продавцов".
        let pricesPage = await  productPage.clickSellersOffersButton();
        await expect(pricesPage.sectionOffersList).toBeVisible();


        // Нажать "В корзину" для самого выгодного продавца	"В корзине" отображается вместо нажатой кнопки. 1 отображается около значка корзины в верхней части страницы
        
        let cartPage = new CartPage(page);
        await page.pause();
        await pricesPage.sortOffers_ascending();
        const firstOfferTile = pricesPage.tileOffer.first();
        const priceFirstOffetTile = await pricesPage.getPriceInOfferTile(firstOfferTile);
        
        
        console.log(priceFirstOffetTile)
        await page.pause();
        await expect(firstOfferTile.locator(pricesPage.orangeButtonAddToCart)).toBeVisible();
        expect(await firstOfferTile.locator(pricesPage.orangeButtonAddToCart).count()).toEqual(1);// первое предложение имеет кнопку "Добавить в корзину"
        await firstOfferTile.locator(pricesPage.orangeButtonAddToCart).click();
        
        await pricesPage.closeRecommendationSidebar();
        expect(await firstOfferTile.locator(pricesPage.orangeButtonAddToCart).count()).toEqual(0); //первое предложение не имеет кнопку "Добавить в корзину"
        await expect(firstOfferTile.locator(pricesPage.greenButtonAddedinCart)).toBeVisible();
        let headerMenu = new HeaderMenu(page);
        expect (await headerMenu.getNumberOfCartCounter()).toEqual(1);
        
        // Перейти в корзину нажатием на значок корзины	Открыта страница корзины, в ней 1 товар. Его название, цена соответствует цене и названию со страницы товара
        await headerMenu.openCart();
        await expect(cartPage.cartBody).toBeVisible();
        await page.waitForTimeout(4000);
        await expect(cartPage.cartProductTitle).toBeVisible();
        expect(await cartPage.cartProductTitle.count()).toEqual(1);
        console.log(await cartPage.cartProductTitle.textContent());
        expect(await cartPage.cartProductTitle.textContent()).toContain(productTitle);
        
        // Нажать на кнопку "Перейти к оформлению"	Открыта страница "Оформление заказа". Справа отображается товар с корректным именем, ценой
        // Заполнить поля адреса, поля контактов	
        // Нажать "Перейти к способу оплаты"	"Открыта страница, на которой представлены 3 способа оплаты: ""Картой онлайн"", ""Халвой онлайн"", ""При получении""
        // ""Картой при получении"" выбран по-дефолту
        // Отображается кнопка ""Перейти к подтверждению заказа"""
        await cartPage.removeAllProducts();
        await page.pause();
    })
        
    
  
   





})

test.describe ("тесты без авторизованного пользователя", async () => {
    let mainPage: MainPage; 
    let headerMenu: HeaderMenu

    test.beforeEach(async ({page, context}) => {
        await page.goto(URLs.mainPageUrl);
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


    test('4. Пользователь может выполнить поиск', async ({page})=>{
             
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
        await page.locator("//h1[@class='catalog-masthead__title js-nav-header']").waitFor();
        let openedProductTitle = await page.locator("//h1[@class='catalog-masthead__title js-nav-header']").innerText();
        expect(openedProductTitle).toEqual(secondFoundProduntTitle);
    })

    test('5. Фильтрация страницы каталога', async ({page})=>{
        //Открыть https://www.catalog.onliner.by/	
      
        // Перейти в категорию "Компьютеры и сети" ->
        //-> "Ноутбуки и комплектующие" -> "Ноутбуки"	
        //result: Открыта страница каталога "Ноутбуки". Заголовок страницы = "Ноутбуки"
        let catalogMainPage = await headerMenu.openCatalog();
        let notebooksPage = await catalogMainPage.openNotebookCatalog();
        expect(page.url()).toEqual(URLs.NotebookCatalogUrl)
        expect(await notebooksPage.productCatalogTitleText).toContain('Ноутбуки');
        let currentNumOfProducts = await notebooksPage.getNumberOfProducts();
        
        // Установить Производитель = ASUS	В верхней части страницы появился фильтр "ASUS". Уменьшилось число найденных товаров
        await notebooksPage.checkASUSmaker();
        expect(notebooksPage.selectedAsusFilter).toBeVisible();
        currentNumOfProducts = await notebooksPage.getChangedNumOfProducts(currentNumOfProducts);//test is implemented within the method
       
        // Установить Частота матрицы от 120 до 165 Гц	В верхней части страницы появился фильтр "120 - 165 Гц". Уменьшилось число найденных товаров. Фильтр "ASUS" также присутствует
        await notebooksPage.setMatrixMinimalHzFilter_120();
        await expect(notebooksPage.selectedMatrixOptionLocator_120).toBeVisible();
        await notebooksPage.setMatrixMaxHzFilter_165();
        await expect(notebooksPage.selectedMatrixOptionLocator_120_165).toBeVisible();
        await expect(notebooksPage.selectedAsusFilter).toBeVisible();
        currentNumOfProducts = await notebooksPage.getChangedNumOfProducts(currentNumOfProducts); //test is implemented within the method
        
        // Применить фильтр "Суперцена"	В верхней части страницы появился фильтр "Суперцена". Отображаются только товары со значком            \
        await notebooksPage.selectSuperPriceFilter();
        await expect(notebooksPage.selectedSuperPriceLaber).toBeVisible()
        expect(notebooksPage.CountAllSuperPricesInProductCount()).toEqual(notebooksPage.countAllProductTiles());
        
        // Удалить фильтр "ASUS"	Фильтр ASUS удален, все остальные - присутствуют
        await notebooksPage.checkASUSmaker();
        expect(notebooksPage.selectedAsusFilter).not.toBeVisible();
        await expect(notebooksPage.selectedSuperPriceLaber).toBeVisible();
        expect(notebooksPage.CountAllSuperPricesInProductCount()).toEqual(notebooksPage.countAllProductTiles());
        await expect(notebooksPage.selectedMatrixOptionLocator_120_165).toBeVisible();

    

    })

}) 






