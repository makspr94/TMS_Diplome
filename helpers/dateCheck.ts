import { Locator, expect } from "@playwright/test";

const months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];

export function isToday(date: string){
    const today = new Date(); 
    const formattedToday = `${today.getDate()} ${months[today.getMonth()]}`
    expect(formattedToday).toEqual(date);
}

