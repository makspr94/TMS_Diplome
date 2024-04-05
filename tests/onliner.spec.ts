import { test, expect, Page, chromium } from '@playwright/test';
import { MainPage } from '../pages/main.page';
import { validUser } from '../data/userData';
import { mainPageUrl } from '../data/URLs';
import { randomEmail } from '../helpers/random';
import { randomString } from '../helpers/random';


import fs from 'fs';


const authFile = 'data/.auth/user.json';

test.describe.configure({mode: 'parallel'});

test.describe ("Onliner tests with authonticated user", async () => {
       let mainPage: MainPage;


    
        

    // test.beforeAll (async () => {
    //     // const browser = await chromium.launch({headless: false});
    //     // const context = await browser.newContext();
    //     // page = await context.newPage();
    // });

    // test.beforeEach(async () => {
    //     // await page.goto('https://www.onliner.by/');
    //     // mainPage = new MainPage(page);
    //   });

    test.skip('login with valid credentials', async ({page, context})=>{
        await page.goto(mainPageUrl);
        mainPage = new MainPage(page);
        let loginPage = await mainPage.openLoginPage();
        await expect(loginPage.loginForm).toBeVisible();
        await loginPage.logIn(validUser.email, validUser.password);
        await expect(mainPage.userAvatar).toBeVisible({timeout:0});
        await page.context().storageState({path:authFile});
        const cookies = await page.context().cookies();
        fs.writeFileSync('./data/.auth/cookies.json', JSON.stringify(cookies));
       
        
        
        await page.waitForTimeout(5000);

    

        //const cookies = JSON.parse(fs.readFileSync('./data/.auth/cookies.json', 'utf-8'));
        //console.log(cookies);
        //await context.addCookies (cookies);
    })

   





})

test.describe ("Onliner tests without authantication", async () => {
    let mainPage: MainPage; 

    
    
    test ('registration', async ({page, context}) => {
        await page.goto(mainPageUrl);
        mainPage = new MainPage(page);
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






       
        
        await page.waitForTimeout(5000);


       
        
    })

}) 






