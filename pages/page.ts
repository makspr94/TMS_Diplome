import { Page, expect } from "@playwright/test";

export class BasePage {
  constructor(protected page: Page) {}
}
