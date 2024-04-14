import { RegistrationForm } from "../src/registration";

describe("registration form tests", () => {
  let registrationForm: RegistrationForm;
  beforeEach(() => {
    registrationForm = new RegistrationForm();
  });

  test("set email", async () => {
    const testEmail = "Correct.%_+-Email90@mail.com";
    registrationForm.setEmail(testEmail);
    expect(registrationForm.email).toEqual(testEmail);
  });

  test("NEGATIVE. incorrect email", async () => {
    const invalidEmails = [
      "incorrectEmail#@mail.com",
      "@mail.com",
      "symbol$@mail.com",
      "emailMail.com",
      "почта.почта.бел",
      "email@mail.r",
      "email@.com",
      "",
      //'Correct.%_+-Email90@mail.com'
    ];
    invalidEmails.forEach((invalidEmail) => {
      expect(() => {
        registrationForm.setEmail(invalidEmail);
      }).toThrow("incorrect Email format");
    });
  });

  test("set password", async () => {
    const testPasswords = ["8symbols", "русские8", "!@#$%^&8", "12345678"];
    testPasswords.forEach((password) => {
      registrationForm.setPassword(password);
      expect(registrationForm.password).toEqual(password);
    });
  });

  test("NEGATIVE. set password", async () => {
    const invalidPasswords = [
      "7symbol",
      "symbolsOnly",
      "символы%%%",
      "1234567",
      "!@#$%^",
      "",
    ];
    invalidPasswords.forEach((password) => {
      expect(() => {
        registrationForm.setPassword(password);
      }).toThrow(
        "The password must contain at least 8 characters including at least one digit",
      );
    });
  });

  test("set userName", async () => {
    const userNames = ["UserName", "Имя", "Hello World", "        Name     "];
    userNames.forEach((name) => {
      registrationForm.setUsername(name);
      expect(registrationForm.username).toEqual(name);
    });
  });

  test("NEGATIVE. set userName", async () => {
    const invalidUserNames = [""];
    invalidUserNames.forEach((name) => {
      expect(() => {
        registrationForm.setUsername(name);
      }).toThrow("username field must be filled");
    });
  });

  test("set age", async () => {
    const userNames = [1, 55, 149];
    userNames.forEach((age) => {
      registrationForm.setAge(age);
      expect(registrationForm.age).toEqual(age);
    });
  });

  test("NEGATIVE. set age", async () => {
    const invalidUserNames = [-1, 0, 150, 151, '', '12', 'hello'];
    invalidUserNames.forEach((age) => {
      expect(() => {
        registrationForm.setAge(age);
      }).toThrow("incorrect age");
    });
  });

  test("set agreed with Terms", async () => {
   registrationForm.agreedWithTerms();
   expect(registrationForm.termsAgreement).toBeTruthy();
  });

  test("NEGATIVE. set age", async () => {
    expect(registrationForm.termsAgreement).toBeFalsy();
  });

  test("registration", async () => {
    registrationForm.email = 'correctEmail@mail.com';
    registrationForm.password = "password1";
    registrationForm.username = "userName";
    registrationForm.age = 20;
    registrationForm.termsAgreement = true;
    const registrationDate = new Date().toLocaleString();
    expect(registrationForm.register()).toEqual(`Registration is successful. Date of registration: ${registrationDate}`);
    expect(registrationForm.termsAgreement).toBeTruthy();
   });

   test("NEGATIVE. registration -> missed email", async () => {
    registrationForm.email = '';
    registrationForm.password = "password1";
    registrationForm.username = "userName";
    registrationForm.age = 20;
    registrationForm.termsAgreement = true;
    const registrationDate = new Date().toLocaleString();
    expect(registrationForm.register()).toEqual(`registration is not allowed. Please, check fields`);
    expect(registrationForm.termsAgreement).toBeTruthy();
   });

});
