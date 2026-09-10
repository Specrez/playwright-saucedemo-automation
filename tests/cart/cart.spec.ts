import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { InventoryPage } from '../../pages/InventoryPage';
import { CartPage } from '../../pages/CartPage';
import { users } from '../../test-data/users';

test.describe('Cart Functional Tests', () => {

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);

    await loginPage.goto();
    await loginPage.login(
      users.standard.username,
      users.standard.password
    );

    await expect(page).toHaveURL(/inventory.html/);

    await inventoryPage.addProductToCart('Sauce Labs Backpack');

    await page.locator('.shopping_cart_link').click();

    await expect(page).toHaveURL(/cart.html/);
  });

  test('should display cart page', async ({ page }) => {
    const cartPage = new CartPage(page);

    await cartPage.verifyCartPage();
  });

  test('should display added product in cart', async ({ page }) => {
    const cartPage = new CartPage(page);

    await expect(cartPage.cartItems).toHaveCount(1);

    const productNames = await cartPage.getCartProductNames();

    expect(productNames).toContain('Sauce Labs Backpack');
  });

  test('should display correct product quantity', async ({ page }) => {
    const cartPage = new CartPage(page);

    await expect(
      cartPage.cartItems.first().locator('.cart_quantity')
    ).toHaveText('1');
  });

  test('should display product description', async ({ page }) => {
    const cartPage = new CartPage(page);

    await expect(
      cartPage.cartItems.first().locator('.inventory_item_desc')
    ).toBeVisible();
  });

  test('should display product price', async ({ page }) => {
    const cartPage = new CartPage(page);

    await expect(
      cartPage.cartItems.first().locator('.inventory_item_price')
    ).toBeVisible();
  });

  test('should remove product from cart', async ({ page }) => {
    const cartPage = new CartPage(page);

    await cartPage.removeProduct('Sauce Labs Backpack');

    await expect(cartPage.cartItems).toHaveCount(0);
  });

  test('should remove cart badge after removing the only product', async ({ page }) => {
    const cartPage = new CartPage(page);

    await cartPage.removeProduct('Sauce Labs Backpack');

    await expect(
      page.locator('.shopping_cart_badge')
    ).not.toBeVisible();
  });

  test('should continue shopping from cart', async ({ page }) => {
    const cartPage = new CartPage(page);

    await cartPage.continueShopping();

    await expect(page).toHaveURL(/inventory.html/);
    await expect(page.getByText('Products')).toBeVisible();
  });

  test('should navigate to checkout from cart', async ({ page }) => {
    const cartPage = new CartPage(page);

    await cartPage.checkout();

    await expect(page).toHaveURL(/checkout-step-one\.html/);
    await expect(
      page.getByText('Checkout: Your Information')
    ).toBeVisible();
  });

  test('should preserve cart item when navigating to checkout', async ({ page }) => {
    const cartPage = new CartPage(page);

    await cartPage.checkout();

    await expect(page).toHaveURL(/checkout-step-one\.html/);

    await page.goBack();

    await expect(page).toHaveURL(/cart\.html/);

    await expect(cartPage.cartItems).toHaveCount(1);
    await expect(
      cartPage.cartItems.first()
    ).toContainText('Sauce Labs Backpack');
  });

});