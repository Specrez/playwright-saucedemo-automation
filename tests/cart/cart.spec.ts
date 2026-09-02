import { test, expect } from '../../fixtures/testFixture';
import { LoginPage } from '../../pages/LoginPage';
import { InventoryPage } from '../../pages/InventoryPage';
import { CartPage } from '../../pages/CartPage';
import { users } from '../../test-data/users';

test.describe('Shopping Cart Functionality', () => {

test.beforeEach(async ({ authenticatedPage }) => {
  // User is already logged in
});


  test('Cart should be accessible from inventory page', async ({ page }) => {

    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);

    await inventoryPage.openCart();

    await cartPage.verifyCartPage();

  });


  test('Added product should appear in cart', async ({ page }) => {

    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);

    await inventoryPage.addProductToCart('Sauce Labs Backpack');

    await inventoryPage.openCart();

    const products = await cartPage.getCartProductNames();

    expect(products).toContain('Sauce Labs Backpack');

  });


  test('Cart should display correct item count', async ({ page }) => {

    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);

    await inventoryPage.addProductToCart('Sauce Labs Backpack');

    await inventoryPage.addProductToCart('Sauce Labs Bike Light');

    await inventoryPage.openCart();

    const count = await cartPage.getCartItemCount();

    expect(count).toBe(2);

  });


  test('User should be able to remove product from cart', async ({ page }) => {

    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);

    await inventoryPage.addProductToCart('Sauce Labs Backpack');

    await inventoryPage.openCart();

    await cartPage.removeProduct('Sauce Labs Backpack');

    const count = await cartPage.getCartItemCount();

    expect(count).toBe(0);

  });


  test('Continue Shopping should return user to inventory', async ({ page }) => {

    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);

    await inventoryPage.openCart();

    await cartPage.continueShopping();

    await expect(page).toHaveURL(/inventory.html/);

  });

});