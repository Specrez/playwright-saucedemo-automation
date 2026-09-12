import { test, expect } from "@playwright/test";
import { LoginPage } from "../../pages/LoginPage";
import { users } from "../../test-data/users";

test.describe("Footer Tests", () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();

    await loginPage.login(users.standard.username, users.standard.password);

    await expect(page).toHaveURL(/inventory\.html/);
  });

  test("should display footer", async ({ page }) => {
    await expect(page.locator(".footer")).toBeVisible();
  });

  test("should display footer copyright information", async ({ page }) => {
    await expect(page.locator(".footer_copy")).toBeVisible();

    await expect(page.locator(".footer_copy")).toContainText("Sauce Labs");
  });

  test("should display Facebook link", async ({ page }) => {
    await expect(page.locator(".social_facebook")).toBeVisible();
  });

  test("should display LinkedIn link", async ({ page }) => {
    await expect(page.locator(".social_linkedin")).toBeVisible();
  });

  test("should have valid Facebook link", async ({ page }) => {
    const facebookLink = page.locator(".social_facebook a");
    await expect(facebookLink).toHaveAttribute("href", /.+/);
  });

  test("should have valid LinkedIn link", async ({ page }) => {
    const linkedInLink = page.locator(".social_linkedin a");
    await expect(linkedInLink).toHaveAttribute("href", /.+/);
  });
});
