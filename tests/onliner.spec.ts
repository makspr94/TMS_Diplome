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
import { QuickSearhFrame } from '../pages/iFrame.page';


//const authFile = 'data/.auth/user.json';

test.describe.configure({mode: 'parallel'});



test.describe ("1. Тесты с авторизованным пользователем", async () => {
    let mainPage: MainPage;
    let headerMenu: HeaderMenu;
    let cartPage: CartPage;
    let quickSearch: QuickSearhFrame;
    
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

    test ('6. Пользователь может оформить заказ (до оплаты)', async({page, context}) =>{
         // Открыть https://www.onliner.by/	
        test.setTimeout(150000);
        const cookies = JSON.parse(fs.readFileSync('./data/.auth/cookies.json', 'utf8'));
        await context.addCookies(cookies);
        await page.goto(URLs.mainPageUrl);

        //Открыть страницу товара (ч/з поиск)
        quickSearch = new QuickSearhFrame(page);
        let cartPage = new CartPage(page);
        const productPage =  await quickSearch.openProductBySearchRequest("Наушники Bose 45");
        expect(productPage.productTitleH1).toBeVisible();
        let productTitle = await productPage.getProductTitleText();

        // Перейти на вкладку "Предложения продавцов"	Открыта вкладка "Предложения продавцов".
        let pricesPage = await  productPage.clickSellersOffersButton();
        await expect(pricesPage.sectionOffersList).toBeVisible();

        // Нажать "В корзину" для самого выгодного продавца	"В корзине" отображается вместо нажатой кнопки. 1 отображается около значка корзины в верхней части страницы 
        await pricesPage.sortOffers_ascending();
        const firstOfferTile = pricesPage.tileOffer.first();
        const priceFirstOffetTile = await pricesPage.getPriceInOfferTile(firstOfferTile);
        await expect(firstOfferTile.locator(pricesPage.orangeButtonAddToCart)).toBeVisible();
        expect(firstOfferTile.locator(pricesPage.orangeButtonAddToCart).count()).toEqual(1);// первое предложение имеет кнопку "Добавить в корзину"
        await firstOfferTile.locator(pricesPage.orangeButtonAddToCart).click();
        await pricesPage.closeRecommendationSidebar();
        expect(await firstOfferTile.locator(pricesPage.greenButtonAddedinCart).count()).toEqual(1);
        let headerMenu = new HeaderMenu(page);
        expect (await headerMenu.getNumberOfCartCounter()).toEqual(1);
        
        // Перейти в корзину нажатием на значок корзины	Открыта страница корзины, в ней 1 товар. Его название, цена соответствует цене и названию со страницы товара
        await headerMenu.openCart();
        await expect(cartPage.cartBody).toBeVisible();
        await page.waitForTimeout(4000);
        await expect(cartPage.cartProductTitle).toBeVisible();
        expect(await cartPage.cartProductTitle.count()).toEqual(1);
        expect(await cartPage.getProductTitleText()).toContain(productTitle);
        expect(await cartPage.getProductPrice()).toEqual(priceFirstOffetTile)
        
        // Нажать на кнопку "Перейти к оформлению"	Открыта страница "Оформление заказа". Справа отображается товар с корректным именем, ценой
        await cartPage.clickButtonCheckout();
        
        // Заполнить поля адреса, поля контактов
        //await cartPage.fillInCheckoutForm();
        await cartPage.clickButtonProceedToPay();
        // Нажать "Перейти к способу оплаты"	"Открыта страница, на которой представлены 3 способа оплаты: ""Картой онлайн"", ""Халвой онлайн"", ""При получении""
        // ""Картой при получении"" выбран по-дефолту
        // Отображается кнопка ""Перейти к подтверждению заказа"""
        await cartPage.checkPaymentTypeByCard()
        await cartPage.buttonConfirmOrder.waitFor({state:'visible'});
        await cartPage.removeAllProducts();
    })

    
        
    
  
   





})








