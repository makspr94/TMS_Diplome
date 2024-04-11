import { Locator } from "@playwright/test";

export async function getInnerNumber(element: Locator){
    const matchResult = (await element.innerText()).match(/\d+/);
    const number =  matchResult ? parseInt(matchResult[0], 10) : null;
    return number; 
}