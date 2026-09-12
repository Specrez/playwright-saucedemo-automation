import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { users } from '../../test-data/users';

test.describe('Menu and Navigation Tests', () => {

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();

    await loginPage.login(
      users.standard.username,
      users.standard.password
    );

    await expect(page).toHaveURL(/inventory\.html/);
  });

  test('should open the side menu', async ({ page }) => {
    await page.getByRole('button', { name: /Open Menu/i }).click();

    await expect(
      page.locator('#inventory_sidebar_link')
    ).toBeVisible();
  });

  test('should close the side menu', async ({ page }) => {
    await page.getByRole('button', { name: /Open Menu/i }).click();

    await expect(
      page.locator('#inventory_sidebar_link')
    ).toBeVisible();

    await page.getByRole('button', { name: /Close Menu/i }).click();

    await expect(
      page.locator('#inventory_sidebar_link')
    ).not.toBeVisible();
  });

  test('should navigate to All Items', async ({ page }) => {
    await page.getByRole('button', { name: /Open Menu/i }).click();

    await page.locator('#inventory_sidebar_link').click();

    await expect(page).toHaveURL(/inventory\.html/);
    await expect(page.getByText('Products')).toBeVisible();
  });

  test('should navigate to About page', async ({ page }) => {
    await page.getByRole('button', { name: /Open Menu/i }).click();

    await page.locator('#about_sidebar_link').click();

    await expect(page).toHaveURL(/saucelabs\.com/);
  });

  test('should logout successfully', async ({ page }) => {
    await page.getByRole('button', { name: /Open Menu/i }).click();

    await page.locator('#logout_sidebar_link').click();

    await expect(page).toHaveURL(/\/$/);

    await expect(
      page.getByPlaceholder('Username')
    ).toBeVisible();
  });

  test('should reset application state', async ({ page }) => {

    // Add a product first
    await page.locator('.inventory_item').first()
      .getByRole('button', { name: 'Add to cart' })
      .click();

    await expect(
      page.locator('.shopping_cart_badge')
    ).toHaveText('1');

    // Open menu
    await page.getByRole('button', { name: /Open Menu/i }).click();

    // Reset application state
    await page.locator('#reset_sidebar_link').click();

    // Cart should be cleared
    await expect(
      page.locator('.shopping_cart_badge')
    ).not.toBeVisible();
  });

  test('should preserve inventory page after closing menu', async ({ page }) => {
    await page.getByRole('button', { name: /Open Menu/i }).click();

    await page.getByRole('button', { name: /Close Menu/i }).click();

    await expect(page).toHaveURL(/inventory\.html/);
    await expect(page.getByText('Products')).toBeVisible();
  });

});