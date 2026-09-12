import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { InventoryPage } from '../../pages/InventoryPage';
import { CartPage } from '../../pages/CartPage';
import { CheckoutPage } from '../../pages/CheckoutPage';
import { users } from '../../test-data/users';

test.describe('Checkout Complete Tests', () => {

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

    await checkoutPage.finishOrder();

    await expect(page).toHaveURL(/checkout-complete\.html/);
  });

  test('should display order confirmation page', async ({ page }) => {
    await expect(page).toHaveURL(/checkout-complete\.html/);
  });

  test('should display order confirmation message', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);

    await checkoutPage.verifyOrderConfirmation();
  });

  test('should display confirmation content', async ({ page }) => {
    await expect(
      page.getByText(/Your order has been dispatched/i)
    ).toBeVisible();
  });

  test('should display Back Home button', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);

    await expect(checkoutPage.backHomeButton).toBeVisible();
  });

  test('should return to products after clicking Back Home', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);

    await checkoutPage.backToProducts();

    await expect(page).toHaveURL(/inventory\.html/);
    await expect(page.getByText('Products')).toBeVisible();
  });

  test('should complete the full purchase journey', async ({ page }) => {
    // The beforeEach hook already completed:
    // Login → Product → Cart → Checkout → Overview → Finish

    await expect(page).toHaveURL(/checkout-complete\.html/);

    await expect(
      page.getByText('Thank you for your order!')
    ).toBeVisible();
  });

  test('should clear cart after successful order', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);

    await checkoutPage.backToProducts();

    await expect(page).toHaveURL(/inventory\.html/);

    await expect(
      page.locator('.shopping_cart_badge')
    ).not.toBeVisible();
  });

});