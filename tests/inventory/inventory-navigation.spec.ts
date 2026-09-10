import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { InventoryPage } from '../../pages/InventoryPage';
import { users } from '../../test-data/users';

test.describe('Inventory Navigation Tests', () => {

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    await loginPage.login(
      users.standard.username,
      users.standard.password
    );

    await expect(page).toHaveURL(/inventory.html/);
  });

  test('should display all inventory products', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    await expect(inventoryPage.productItems).toHaveCount(6);
  });

  test('should display product names', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    const names = await inventoryPage.getProductNames();

    expect(names.length).toBe(6);
  });

  test('should display product prices', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    const prices = await inventoryPage.getProductPrices();

    expect(prices.length).toBe(6);
  });

  test('should open product details from product image', async ({ page }) => {
    await page.locator('.inventory_item_img').first().click();

    await expect(page).toHaveURL(/inventory-item\.html/);
  });

  test('should open product details from product name', async ({ page }) => {
    await page.locator('.inventory_item_name').first().click();

    await expect(page).toHaveURL(/inventory-item\.html/);
  });

  test('should display shopping cart link', async ({ page }) => {
    await expect(
      page.locator('.shopping_cart_link')
    ).toBeVisible();
  });

  test('should navigate to cart from inventory', async ({ page }) => {
    await page.locator('.shopping_cart_link').click();

    await expect(page).toHaveURL(/cart\.html/);
    await expect(page.getByText('Your Cart')).toBeVisible();
  });

});