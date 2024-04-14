
import { RegistrationForm } from "../src/registration";

describe( "registration form tests", () => {
    let registrationForm: RegistrationForm
    beforeEach(()=> {
     registrationForm = new RegistrationForm();
    })
    
    

    // - Пользователь может получить все посты
    test('set email', async () => {
        const testEmail = 'Correct.%_+-Email90@mail.com'
        registrationForm.setEmail(testEmail);
        expect(registrationForm.email).toEqual(testEmail);
       
    });

    test ('NEGATIVE. incorrect email', async () =>{
        const invalidEmails =[ 
            'incorrectEmail#@mail.com',
            '@mail.com',
            'symbol$@mail.com',
            'emailMail.com',
            'почта.почта.бел',
            'email@mail.r',
            'email@.com',
            '',
            //'Correct.%_+-Email90@mail.com'
        ];
        //registrationForm.setEmail(testEmail)
        invalidEmails.forEach((invalidEmail)=> {
            expect (()=> {
                registrationForm.setEmail(invalidEmail);
            }).toThrow("incorrect Email format");
        })
     })

     test('set password', async () => {
        const testPasswords = [
            '8symbols',
            'русские8',
            '!@#$%^&8',
            '12345678'
        ];
        testPasswords.forEach((password)=>{
            registrationForm.setPassword(password);
            expect(registrationForm.password).toEqual(password);
        })
    });

     test ('NEGATIVE. set password', async () =>{
        const invalidPasswords =[ 
            '7symbol',
            'symbolsOnly',
            'символы%%%',
            '1234567',
            '!@#$%^',
            '',
            //'Correct.%_+-Email90@mail.com'
        ];
        //registrationForm.setEmail(testEmail)
        invalidPasswords.forEach((password)=> {
            expect (()=> {
                registrationForm.setPassword(password);
            }).toThrow('The password must contain at least 8 characters including at least one digit');
        })
     });

     test('set userName', async () => {
        const testPasswords = [
            'UserName',
            'Имя',
            'Hello World',
            '        Name     '
        ];
        testPasswords.forEach((name)=>{
            registrationForm.setUsername(name);
            expect(registrationForm.username).toEqual(name);
        })
    });

    test ('NEGATIVE. set password', async () =>{
        const invalidPasswords =[ 
            '7symbol',
            'symbolsOnly',
            'символы%%%',
            '1234567',
            '!@#$%^',
            '',
            //'Correct.%_+-Email90@mail.com'
        ];
        //registrationForm.setEmail(testEmail)
        invalidPasswords.forEach((password)=> {
            expect (()=> {
                registrationForm.setPassword(password);
            }).toThrow('The password must contain at least 8 characters including at least one digit');
        })
     })
    

})






