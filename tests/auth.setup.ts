// import { test, expect, Page, chromium } from '@playwright/test';
// import { MainPage } from '../pages/main.page';
// import { LoginPage } from '../pages/login.page';
// import { validUser } from '../data/userData';
// import { TIMEOUT } from 'dns';

// const authFile = 'data/.auth/user.json';

// test.describe ("Onliner test", async () => {

//     let page: Page;
//     let mainPage: MainPage;

//     test.beforeAll (async () => {
//         const browser = await chromium.launch({headless: false});
//         const context = await browser.newContext();
//         page = await context.newPage();
//     });

//     test.beforeEach(async () => {
//         await page.goto('https://www.onliner.by/');
//         mainPage = new MainPage(page);
//       });

//     test('login with valid credentials', async ({})=>{
//         let loginPage = await mainPage.openLoginPage();
//         await expect(loginPage.authForm).toBeVisible();
//         await loginPage.logIn(validUser.email, validUser.password);
//         await expect(mainPage.userAvatar).toBeVisible({timeout:0});
//         await page.context().storageState({path:authFile});

//         await page.waitForTimeout(5000);

//         /*

//         Ввести email и пароль
//         Нажать кнопку "Войти"	-> Появилось окошко для ввода капчи*/

//     })

// })
