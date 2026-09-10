import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { InventoryPage } from '../../pages/InventoryPage';
import { users } from '../../test-data/users';

test.describe('Cart Navigation and Multi-Product Tests', () => {

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();

    await loginPage.login(
      users.standard.username,
      users.standard.password
    );

    await expect(page).toHaveURL(/inventory.html/);
  });

  test('should open empty cart', async ({ page }) => {
    await page.locator('.shopping_cart_link').click();

    await expect(page).toHaveURL(/cart.html/);
    await expect(page.locator('.cart_item')).toHaveCount(0);
  });

  test('should add multiple products to cart', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    await inventoryPage.addProductToCart('Sauce Labs Backpack');
    await inventoryPage.addProductToCart('Sauce Labs Bike Light');
    await inventoryPage.addProductToCart('Sauce Labs Bolt T-Shirt');

    await expect(
      page.locator('.shopping_cart_badge')
    ).toHaveText('3');
  });

  test('should display all selected products in cart', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    await inventoryPage.addProductToCart('Sauce Labs Backpack');
    await inventoryPage.addProductToCart('Sauce Labs Bike Light');
    await inventoryPage.addProductToCart('Sauce Labs Bolt T-Shirt');

    await page.locator('.shopping_cart_link').click();

    await expect(page.locator('.cart_item')).toHaveCount(3);

    await expect(page.locator('.cart_item')).toContainText(
      'Sauce Labs Backpack'
    );

    await expect(page.locator('.cart_item')).toContainText(
      'Sauce Labs Bike Light'
    );

    await expect(page.locator('.cart_item')).toContainText(
      'Sauce Labs Bolt T-Shirt'
    );
  });

  test('should update cart badge when removing one of multiple products', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    await inventoryPage.addProductToCart('Sauce Labs Backpack');
    await inventoryPage.addProductToCart('Sauce Labs Bike Light');

    await expect(
      page.locator('.shopping_cart_badge')
    ).toHaveText('2');

    await inventoryPage.removeProductFromCart('Sauce Labs Backpack');

    await expect(
      page.locator('.shopping_cart_badge')
    ).toHaveText('1');
  });

  test('should allow removing all products from cart', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    await inventoryPage.addProductToCart('Sauce Labs Backpack');
    await inventoryPage.addProductToCart('Sauce Labs Bike Light');

    await inventoryPage.removeProductFromCart('Sauce Labs Backpack');
    await inventoryPage.removeProductFromCart('Sauce Labs Bike Light');

    await expect(
      page.locator('.shopping_cart_badge')
    ).not.toBeVisible();
  });

});