import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { InventoryPage } from '../../pages/InventoryPage';
import { CartPage } from '../../pages/CartPage';
import { CheckoutPage } from '../../pages/CheckoutPage';
import { users } from '../../test-data/users';

test.describe('Checkout Overview Tests', () => {

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    await loginPage.goto();

    await loginPage.login(
      users.standard.username,
      users.standard.password
    );

    await expect(page).toHaveURL(/inventory.html/);

    await inventoryPage.addProductToCart('Sauce Labs Backpack');

    await cartPage.openCart();
    await cartPage.checkout();

    await checkoutPage.enterCustomerInformation(
      'Oshadha',
      'Weerakoon',
      '20000'
    );

    await checkoutPage.continueToOverview();

    await expect(page).toHaveURL(/checkout-step-two\.html/);
  });

  test('should display checkout overview page', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);

    await checkoutPage.verifyCheckoutOverview();
  });

  test('should display selected product in overview', async ({ page }) => {
    await expect(
      page.locator('.cart_item')
    ).toContainText('Sauce Labs Backpack');
  });

  test('should display product quantity', async ({ page }) => {
    await expect(
      page.locator('.cart_quantity')
    ).toHaveText('1');
  });

  test('should display product price', async ({ page }) => {
    await expect(
      page.locator('.inventory_item_price')
    ).toBeVisible();
  });

  test('should display product description', async ({ page }) => {
    await expect(
      page.locator('.inventory_item_desc')
    ).toBeVisible();
  });

  test('should display payment information', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);

    await expect(
      checkoutPage.paymentInformation
    ).toBeVisible();
  });

  test('should display shipping information', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);

    await expect(
      checkoutPage.shippingInformation
    ).toBeVisible();
  });

  test('should display item total', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);

    await expect(checkoutPage.itemTotal).toBeVisible();
    await expect(checkoutPage.itemTotal).toContainText('Item total');
  });

  test('should display tax', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);

    await expect(checkoutPage.tax).toBeVisible();
    await expect(checkoutPage.tax).toContainText('Tax');
  });

  test('should display total', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);

    await expect(checkoutPage.total).toBeVisible();
    await expect(checkoutPage.total).toContainText('Total');
  });

  test('should calculate total correctly', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);

    const itemTotalText = await checkoutPage.getItemTotal();
    const taxText = await checkoutPage.getTax();
    const totalText = await checkoutPage.getTotal();

    expect(itemTotalText).toBeTruthy();
    expect(taxText).toBeTruthy();
    expect(totalText).toBeTruthy();

    const itemTotal = parseFloat(
      itemTotalText!.replace(/[^0-9.]/g, '')
    );

    const tax = parseFloat(
      taxText!.replace(/[^0-9.]/g, '')
    );

    const total = parseFloat(
      totalText!.replace(/[^0-9.]/g, '')
    );

    expect(total).toBeCloseTo(itemTotal + tax, 2);
  });

  test('should display Cancel button', async ({ page }) => {
    await expect(
      page.getByRole('button', { name: 'Cancel' })
    ).toBeVisible();
  });

  test('should display Finish button', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);

    await expect(
      checkoutPage.finishButton
    ).toBeVisible();
  });

  test('should cancel checkout from overview', async ({ page }) => {
    await page.getByRole('button', { name: 'Cancel' }).click();

    await expect(page).toHaveURL(/inventory.html|cart\.html/);
  });

});