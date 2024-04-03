import { test, expect, Page, chromium } from '@playwright/test';
import { MainPage } from '../pages/main.page';
import { LoginPage } from '../pages/login.page';
import { validUser } from '../data/userData';
import { TIMEOUT } from 'dns';
import fs from 'fs';


const authFile = 'data/.auth/user.json';

test.describe ("Onliner test", async () => {
    
    let page: Page;
    let mainPage: MainPage;
    
    

    test.beforeAll (async () => {
        const browser = await chromium.launch({headless: false});
        const context = await browser.newContext();
        page = await context.newPage();
    });

    test.beforeEach(async () => {
        await page.goto('https://www.onliner.by/');
        mainPage = new MainPage(page);
      });

    test('login with valid credentials', async ({context})=>{
        let loginPage = await mainPage.openLoginPage();
        await expect(loginPage.authForm).toBeVisible();
        await loginPage.logIn(validUser.email, validUser.password);
        await expect(mainPage.userAvatar).toBeVisible({timeout:0});
        await page.context().storageState({path:authFile});
        const cookies = await page.context().cookies();
        fs.writeFileSync('./data/.auth/cookies.json', JSON.stringify(cookies));
        
        
        await page.waitForTimeout(5000);

    

        /*
        
        Ввести email и пароль	
        Нажать кнопку "Войти"	-> Появилось окошко для ввода капчи*/
        
    })

    test ('open page with user', async ({context}) => {
        const cookies = JSON.parse(fs.readFileSync('./data/.auth/cookies.json', 'utf-8'));
        await context.addCookies (cookies);
        await page.reload();
        await page.waitForTimeout(5000);
    })





})