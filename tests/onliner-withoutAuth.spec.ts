import { test, expect, Page, chromium } from "@playwright/test";
import { MainPage } from "../pages/main.page";
import { validUser } from "../data/userData";
import { URLs } from "../data/URLs";
import { randomHelpers } from "../helpers/random";
// import { randomString } from '../helpers/random';
import { NewsPage } from "../pages/news.page";
import fs from "fs";
import { HeaderMenu } from "../pages/elements/headerMenu";
import { CatalogMainPage } from "../pages/catalogMain.page";
import { ProductPage } from "../pages/CatalogProductPages/productPage.catalog";
import { PricesPage } from "../pages/CatalogProductPages/prices.catalog";
import { CartPage } from "../pages/cart.page";
import { QuickSearhFrame } from "../pages/iFrame.page";
import { randomInt } from "crypto";
import { FooterMenu } from "../pages/elements/footerMenu";

test.describe("тесты без авторизованного пользователя", async () => {
  let mainPage: MainPage;
  let headerMenu: HeaderMenu;
  let footerMenu: FooterMenu;

  test.beforeEach(async ({ page, context }) => {
    await page.goto(URLs.mainPageUrl);
    mainPage = new MainPage(page);
    headerMenu = new HeaderMenu(page);
    footerMenu = new FooterMenu(page);
  });

  test("2. registration", async ({ page, context }) => {
    let loginPage = await mainPage.openLoginPage();
    await expect(loginPage.loginForm).toBeVisible();
    // Перейти по ссылке "Зарегистрироваться на Onliner"	Открылась форма регистрации
    let registrationPage = await loginPage.openRegisterForm();
    await expect(registrationPage.regForm).toBeVisible();
    // Ввести валидный email, принять условия соглашения
    await registrationPage.inputValidEmail(
      await randomHelpers.randomEmail({ domain: "gmail.com" }),
    );
    await registrationPage.clickPolicyCheckbox();
    // Нажать на кнопку "Зарегистрироваться" => Поля пароля подсвечены, отображается алерт "Укажите пароль"
    await registrationPage.clickRegButton();
    await page.waitForTimeout(1000);
    expect(
      await registrationPage.getFieldColor(registrationPage.passwordField),
    ).toEqual("rgb(255, 231, 230)");
    expect(
      await registrationPage.getFieldColor(
        registrationPage.repeatPasswordField,
      ),
    ).toEqual("rgb(255, 231, 230)");
    await expect(registrationPage.passwordErrorMessage).toBeVisible();
    await expect(registrationPage.repeatPasswordErrorMessage).toBeVisible();
    // Ввести пароль в оба поля пароля (12 символов) => "Очень надежный пароль, 12 символов" отображается около поля пароля
    const passwordLenght: number = 12;
    let randomPassword =
      await randomHelpers.randomString.generate(passwordLenght);
    await registrationPage.passwordField.fill(randomPassword);
    await registrationPage.repeatPasswordField.fill(randomPassword);
    await expect(registrationPage.secureBoxMessage).toContainText(
      "Очень надежный пароль",
    );
    let secureMessage = await registrationPage.getSecureMessageTextContent();
    if (secureMessage != null) {
      const numberMatch = secureMessage.match(/\d+/);
      let number = numberMatch ? parseInt(numberMatch[0], 10) : null;
      expect(number).toEqual(passwordLenght);
    }
    // Нажать на кнопку "Зарегистрироваться" => Окно с просьбой подтверждения имейла открыто, отображается кнопка "перейти в почту"
    await registrationPage.regButton.click();
    await expect(registrationPage.confirmEmailForm).toBeVisible();
    await expect(registrationPage.goToMailButton).toBeVisible();
  });

  test("4. Пользователь может выполнить поиск", async ({ page }) => {
    // Ввести в поле поиска "Карты памяти"	Открылся попап поиска, среди результатов поиска присутствует ссылка на соответствующую категорию
    let quickSearchFrame = new QuickSearhFrame(page);
    await quickSearchFrame.inputInQuickSearch("Карты памяти");
    await expect(quickSearchFrame.quickSearchFrame).toBeVisible();
    const iFrame = quickSearchFrame.iFrame;

    const searchResultLocator = "//div[@class='result__wrapper']";
    const memCardsSearchLocator =
      "//div[@class='result__wrapper']//a[contains(text(),'Карты памяти') and @href='https://catalog.onliner.by/memcards']";
    const iFrameSearchInputLocator = "//input[@class='search__input']";

    await expect(iFrame.locator(memCardsSearchLocator)).toBeVisible();

    // Очистить поле поиска	Результаты поиска не отображаются
    await iFrame.locator(iFrameSearchInputLocator).clear();
    await expect(async () => {
      expect(await iFrame.locator(searchResultLocator).count()).toEqual(0);
    }).toPass();
    // Ввести название товара (любой уникальный)	В результатах поиска присутствует искомый товар, для него отображается цена, кнопка "Предложения"
    const mySearchRequest = "bose quiet";
    await iFrame.locator(iFrameSearchInputLocator).fill(mySearchRequest);
    await iFrame.locator(searchResultLocator).first().waitFor();
    let allFoundResultLocators = await iFrame
      .locator(
        searchResultLocator + "//a[contains(@class, 'product__title-link')]",
      )
      .all();
    let allFoundResultPrices = await iFrame
      .locator(
        searchResultLocator +
          "//a[contains(@class, 'product__price-value product__price-value_primary')]",
      )
      .all();
    let allFoundResultOfferButtons = await iFrame
      .locator(
        searchResultLocator +
          "//a[contains(@class, 'button button_orange product__button')]",
      )
      .all();
    expect(allFoundResultLocators.length).toEqual(
      allFoundResultOfferButtons.length,
    );
    expect(allFoundResultLocators.length).toEqual(allFoundResultPrices.length);
    for await (const locator of allFoundResultLocators) {
      let resultTitle = await locator.innerText();
      expect(resultTitle.toLocaleLowerCase()).toContain(mySearchRequest);
    }

    // Нажать на название найденного товара	Открыта страница товара, название соответствует искомому
    let secondFoundProduntTitle = await allFoundResultLocators[1].innerText();
    await allFoundResultLocators[1].click();
    await page
      .locator("//h1[@class='catalog-masthead__title js-nav-header']")
      .waitFor();
    let openedProductTitle = await page
      .locator("//h1[@class='catalog-masthead__title js-nav-header']")
      .innerText();
    expect(openedProductTitle).toEqual(secondFoundProduntTitle);
  });

  test ("5. Фильтрация страницы каталога", async ({ page }) => {
    test.setTimeout(150000);
    //Открыть https://www.catalog.onliner.by/

    // Перейти в категорию "Компьютеры и сети" ->
    //-> "Ноутбуки и комплектующие" -> "Ноутбуки"
    //result: Открыта страница каталога "Ноутбуки". Заголовок страницы = "Ноутбуки"
    let catalogMainPage = await headerMenu.openCatalog();
    let notebooksPage = await catalogMainPage.openNotebookCatalog();
    expect(page.url()).toEqual(URLs.NotebookCatalogUrl);
    expect(await notebooksPage.productCatalogTitleText).toContain("Ноутбуки");
    let currentNumOfProducts = await notebooksPage.getNumberOfProducts();

    // Установить Производитель = ASUS	В верхней части страницы появился фильтр "ASUS". Уменьшилось число найденных товаров
    await notebooksPage.checkASUSmaker();
    expect(notebooksPage.selectedAsusFilter).toBeVisible();
    currentNumOfProducts =
      await notebooksPage.getChangedNumOfProducts(currentNumOfProducts); //test is implemented within the method

    // Установить Частота матрицы от 120 до 165 Гц	В верхней части страницы появился фильтр "120 - 165 Гц". Уменьшилось число найденных товаров. Фильтр "ASUS" также присутствует
    await notebooksPage.setMatrixMinimalHzFilter_120();
    await expect(notebooksPage.selectedMatrixOptionLocator_120).toBeVisible();
    await notebooksPage.setMatrixMaxHzFilter_165();
    await expect(
      notebooksPage.selectedMatrixOptionLocator_120_165,
    ).toBeVisible();
    await expect(notebooksPage.selectedAsusFilter).toBeVisible();
    currentNumOfProducts =
      await notebooksPage.getChangedNumOfProducts(currentNumOfProducts); //test is implemented within the method

    // Применить фильтр "Суперцена"	В верхней части страницы появился фильтр "Суперцена". Отображаются только товары со значком            \
    await notebooksPage.selectSuperPriceFilter();
    await expect(notebooksPage.selectedSuperPriceLaber).toBeVisible();
    expect(await notebooksPage.countAllSuperPricesInProduct()).toEqual(
      await notebooksPage.countAllProductTiles(),
    );

    // Удалить фильтр "ASUS"	Фильтр ASUS удален, все остальные - присутствуют
    await notebooksPage.checkASUSmaker();
    expect(notebooksPage.selectedAsusFilter).not.toBeVisible();
    await expect(notebooksPage.selectedSuperPriceLaber).toBeVisible();
    expect(notebooksPage.countAllSuperPricesInProduct()).toEqual(
      notebooksPage.countAllProductTiles(),
    );
    await expect(
      notebooksPage.selectedMatrixOptionLocator_120_165,
    ).toBeVisible();
  });

  test ("7. Конвертер валют", async ({ page, context }) => {
    test.setTimeout(150000);
    //На главной странице нажать на ссылку с курсом доллара	Открыта страница "Лучшие курсы валют", отображается сегодняшняя дата, разделы курсов для USD, EUR, RUB
    let currencyPage = await headerMenu.openCurrencyExhangePage();

    await currencyPage.checkCurrentDate();
    // Нажать кнопку "Купить" в конвертере
    await currencyPage.clickButtonBuy();
    // Попробовать ввести текст в поле конвертера	Значение поля не изменилось, отображается стандартное "100"
    await currencyPage.inputTextInConverter("wrongInput");
    await expect(currencyPage.inputConverter).toHaveValue("100");
    // Ввести какое либо (генерируемое в тесте, f.e. от 10 до 1000) значение в поле конвертера
    let randomNumber = randomHelpers.getRandomInt(10, 1000);
    await currencyPage.inputNumberInConverter(randomNumber);
    // Выбрать валюту EUR	"Справа в конвертере подсчитано значение в BYN.
    await currencyPage.selectEurInConverter();
    // Проверить, что подсчитанное значение = введенное * курс EUR из раздела ""Банк продает"""]
    let convertionResult = await currencyPage.getConvertionResult();
    let bestEurBuyingRate = await currencyPage.getEurBestBuyingRate();
    console.log(convertionResult);
    console.log(bestEurBuyingRate, "  and  ", randomNumber);
    expect(convertionResult).toEqual(+(bestEurBuyingRate * randomNumber).toFixed(3));
  });

  test ("8. Работа с каталогом недвижимости", async ({}) => {
    test.setTimeout(60000);
    // Перейти на страницу "Дома и квартиры" -> "Аренда" -> "Минск" (tip: используй hover)	Страница каталога недвижимости открыта, отображается карта
    const realtPage = await headerMenu.openRealtPage();
    await realtPage.clickRentTab();
    let searchResultCounter: any = 0;
    await realtPage.setFilterCityStreet("Минск");
    searchResultCounter =
      await realtPage.updateResultCounter(searchResultCounter);
    // Выбрать фильтр "Квартира"	Кол-во результатов на странице уменьшилось, отображаюстся только объявления, помеченные "1к, 2к, 3к, 4к", но не "Комната"
    await realtPage.setFilterFlats();
    expect(
      await realtPage.updateResultCounter(searchResultCounter),
    ).toBeLessThan(searchResultCounter);
    searchResultCounter =
      await realtPage.updateResultCounter(searchResultCounter);
    await realtPage.checkAllResultsAreFlats();
    // Выбрать только 2-комнатные квартиры	Кол-во результатов на странице уменьшилось, отображаюстся только объявления, помеченные "2к"
    await realtPage.setFilter2Rooms();
    expect(
      await realtPage.updateResultCounter(searchResultCounter),
    ).toBeLessThan(searchResultCounter);
    await realtPage.checkAllResultsAre2Rooms();
    searchResultCounter =
      await realtPage.updateResultCounter(searchResultCounter);
    // Установить цену до 500$	Кол-во результатов на странице уменьшилось, отображаюстся только объявления, цена в $ которых <= 500$
    await realtPage.setFilterPriceMax(500);
    expect(
      await realtPage.updateResultCounter(searchResultCounter),
    ).toBeLessThan(searchResultCounter);
    searchResultCounter =
      await realtPage.updateResultCounter(searchResultCounter);
    await realtPage.checkMaxPriceOfResults(500);
    // Выбрать "Метро" -> "Возле метро"	Кол-во результатов на странице уменьшилось
    await realtPage.setFilterMetroNearMetro();
    expect(
      await realtPage.updateResultCounter(searchResultCounter),
    ).toBeLessThan(searchResultCounter);
    searchResultCounter =
      await realtPage.updateResultCounter(searchResultCounter);
    // Выбрать сортировку "Сначала дорогие"	Первой отображается не та квартира, которая отображалась до сортировки
    await realtPage.setSortingExpensiveFirst();
  });

  test("9. Форма поддержки пользователей", async ({ page, context }) => {
    // Перейти по ссылке "Поддержка пользователей" в футере главной страницы	Открыта страница "Запрос в службу поддержки"
    let customerSupportPage = await footerMenu.clickButtonCustomerSupport();
    // Заполнить поле имени	Поле имени заполнено
    await customerSupportPage.fillInFieldName("Ivan");
    // Очистить поле имени	В поле отображается "Anonymous"
    await customerSupportPage.clearFieldName();

    // Ввести рандомную строку в поле Email, убрать фокус с поля	Поле выделено красным
    await customerSupportPage.fillFieldEmailRandomString();
    // Ввести корректное (по маске "чтоугодно@что-то.что-то") значение почты, убрать фокус с поля	Выделение снято
    await customerSupportPage.fillFieldEmailCorrectEmail();
    // Сверить остальные поля и элементы:
    //      Отображаются дропдауны ""Тип проблемы"" и ""Где"", они содержат более 1-го значения
    await customerSupportPage.checkDrowdownTracker();
    await customerSupportPage.checkDrowdownCategory();
    //      Отображаются поля ""Краткое описание"", ""Подробное описание""
    // await customerSupportPage.fieldSubject.click()
    expect(await customerSupportPage.fieldSubject.count()).toEqual(1);
    //await customerSupportPage.fieldDescription.click()
    expect(await customerSupportPage.fieldDescription.count()).toEqual(1);

    //      Отображается поле для ввода капчи и капча
    //await customerSupportPage.fieldCaptcha.click()
    expect(await customerSupportPage.fieldCaptcha.count()).toEqual(1);
    //await customerSupportPage.imgCaptcha.click()
    await expect(customerSupportPage.imgCaptcha).toBeVisible();
    //      Отображается и enabled кнопка ""Добавить"""
    await expect(customerSupportPage.buttonSubmit).toBeEnabled();
  });

  test("10. Сравнение 2-х товаров", async ({ page, context }) => {
    // Перейти на вкладку "Каталог"
    const catalogMainPage = await headerMenu.openCatalog();
    // Выбрать раздел "телевизоры"
    const tvCatalogPage = await catalogMainPage.openTVsCatalog();

    // Кликнуть на название первого телевизора и перейти на страницу с описанием.	Открыта страница товара.
    const productPage = await tvCatalogPage.openFirstProduct();
    const firstTVTitle = await productPage.getProductTitleText();

    // Напротив названия телевизора отметить чек-бокс "Добавить к сравнению"	Чек-бокс отмечен. Появилась плашка "1 товар в сравнении"
    await productPage.addToCompare();
    expect(await productPage.getNumberofProductsInComparison()).toEqual(1);

    // Вернуться к списку со всеми телевизорами.
    await page.goBack();
    // Выбрать второй телевизор и проделать действия как в пункте №4	"Открыта страница телевизора. После добавления в сравнение
    await tvCatalogPage.openSecondProduct();
    const secondTVTitle = await productPage.getProductTitleText();
    await productPage.addToCompare();

    // на плашке уже ""2 товара в сравнении"""
    expect(await productPage.getNumberofProductsInComparison()).toEqual(2);
    // Кликнуть на появившийся поп-ап с названием "2 товара в сравнении"	"Пользователь должен быть перенаправлен на страницу ""Сравнение товаров"" и увидеть на странице 2 телевизора, которые выбирал ранее.
    await productPage.clickOnComparisonPopup();
    //  Отличающиеся характеристики должны быть подсвечены оранжевым цветом."
  });
});
