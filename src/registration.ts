import { error } from "console";


export class RegistrationForm {
    
    email: string;
    password: string;
    username: string;
    age: number;
    termsAgreement: boolean = false;
    registered: boolean = false;


    setEmail (email:string){
        const emailRegEx = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/ //allowed symbols in the name: . _ % + -
         if (emailRegEx.test(email)){
            this.email = email
         }
         else{
            throw new Error('incorrect Email format');
         }
    }

    setPassword(password: string){
        if (password.length >= 8 && /\d/.test(password)){
            this.password = password
        }
        else{
            throw new Error ('The password must contain at least 8 characters including at least one digit');
        }
    }

    setUsername(username: string) {
        if (username.trim() !== ""){
            this.username = username
        }
        else{
            throw new Error ('username field must be filled')
        }
    }
    
    setAge(age: number){
        if (age > 0  && age <150 ){
            this.age = age;
        }
        else {
            throw new Error ('incorrect age')
        }
    }

    agreedWithTerms(){
        this.termsAgreement = true;
    }

    register(){
        if (this.email && this.password && this.username && this. age && this.termsAgreement){
            this.registered = true;
            const registrationDate = new Date().toLocaleString();
            return `Registration is successful. Date of registration: ${registrationDate}`
        }
        else{
            return "registration is not allowed. Please, check fields"
        }
    }
}
