import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { InventoryPage } from '../../pages/InventoryPage';
import { CartPage } from '../../pages/CartPage';
import { CheckoutPage } from '../../pages/CheckoutPage';
import { users } from '../../test-data/users';

test.describe('Checkout Information Tests', () => {

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);

    await loginPage.goto();

    await loginPage.login(
      users.standard.username,
      users.standard.password
    );

    await expect(page).toHaveURL(/inventory.html/);

    await inventoryPage.addProductToCart('Sauce Labs Backpack');

    await cartPage.openCart();

    await cartPage.checkout();

    await expect(page).toHaveURL(/checkout-step-one\.html/);
  });

  test('should display checkout information page', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);

    await checkoutPage.verifyCheckoutInformationPage();
  });

  test('should display first name field', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);

    await expect(checkoutPage.firstNameInput).toBeVisible();
  });

  test('should display last name field', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);

    await expect(checkoutPage.lastNameInput).toBeVisible();
  });

  test('should display postal code field', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);

    await expect(checkoutPage.postalCodeInput).toBeVisible();
  });

  test('should display Continue button', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);

    await expect(checkoutPage.continueButton).toBeVisible();
  });

  test('should display Cancel button', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);

    await expect(checkoutPage.cancelButton).toBeVisible();
  });

  test('should reject empty checkout form', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);

    await checkoutPage.continueToOverview();

    await expect(checkoutPage.errorMessage).toBeVisible();
  });

  test('should require first name', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);

    await checkoutPage.enterCustomerInformation(
      '',
      'Weerakoon',
      '20000'
    );

    await checkoutPage.continueToOverview();

    await expect(checkoutPage.errorMessage).toBeVisible();
  });

  test('should require last name', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);

    await checkoutPage.enterCustomerInformation(
      'Oshadha',
      '',
      '20000'
    );

    await checkoutPage.continueToOverview();
  });

  test('should require postal code', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);

    await checkoutPage.enterCustomerInformation(
      'Oshadha',
      'Weerakoon',
      ''
    );

    await checkoutPage.continueToOverview();

    await expect(checkoutPage.errorMessage).toBeVisible();
  });

  test('should accept valid customer information', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);

    await checkoutPage.enterCustomerInformation(
      'Oshadha',
      'Weerakoon',
      '20000'
    );

    await checkoutPage.continueToOverview();

    await expect(page).toHaveURL(/checkout-step-two\.html/);
  });

  test('should preserve entered customer information during checkout', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);

    await checkoutPage.enterCustomerInformation(
      'Oshadha',
      'Weerakoon',
      '20000'
    );

    await expect(checkoutPage.firstNameInput).toHaveValue('Oshadha');
    await expect(checkoutPage.lastNameInput).toHaveValue('Weerakoon');
    await expect(checkoutPage.postalCodeInput).toHaveValue('20000');
  });

  test('should cancel checkout and return to cart', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);

    await checkoutPage.cancelButton.click();

    await expect(page).toHaveURL(/cart\.html/);
    await expect(page.getByText('Your Cart')).toBeVisible();
  });

});