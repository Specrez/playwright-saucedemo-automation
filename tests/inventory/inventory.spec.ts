import { test, expect } from '../../fixtures/testFixture';
import { LoginPage } from '../../pages/LoginPage';
import { InventoryPage } from '../../pages/InventoryPage';
import { users } from '../../test-data/users';

test.describe('Inventory Functionality', () => {

test.beforeEach(async ({ authenticatedPage }) => {
  // User is already logged in
});


  test('User should be able to view inventory page', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    await inventoryPage.verifyInventoryPage();
  });


  test('Inventory should display products', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    const productCount = await inventoryPage.getProductCount();

    expect(productCount).toBeGreaterThan(0);
  });


  test('Products should display product names', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    const productNames = await inventoryPage.getProductNames();

    expect(productNames.length).toBeGreaterThan(0);
    expect(productNames).toContain('Sauce Labs Backpack');
  });


  test('Products should display prices', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    const productPrices = await inventoryPage.getProductPrices();

    expect(productPrices.length).toBeGreaterThan(0);
    expect(productPrices[0]).toMatch(/\$\d+\.\d{2}/);
  });


  // =========================
  // SORTING TESTS
  // =========================

  test('Products should be sorted by name A-Z', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    await inventoryPage.sortProducts('az');

    const productNames = await inventoryPage.getProductNames();

    const sortedNames = [...productNames].sort((a, b) =>
      a.localeCompare(b)
    );

    expect(productNames).toEqual(sortedNames);
  });


  test('Products should be sorted by name Z-A', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    await inventoryPage.sortProducts('za');

    const productNames = await inventoryPage.getProductNames();

    const sortedNames = [...productNames]
      .sort((a, b) => a.localeCompare(b))
      .reverse();

    expect(productNames).toEqual(sortedNames);
  });


  test('Products should be sorted by price low to high', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    await inventoryPage.sortProducts('lohi');

    const productPrices = await inventoryPage.getProductPrices();

    const prices = productPrices.map(price =>
      parseFloat(price.replace('$', ''))
    );

    const sortedPrices = [...prices].sort((a, b) => a - b);

    expect(prices).toEqual(sortedPrices);
  });


  test('Products should be sorted by price high to low', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    await inventoryPage.sortProducts('hilo');

    const productPrices = await inventoryPage.getProductPrices();

    const prices = productPrices.map(price =>
      parseFloat(price.replace('$', ''))
    );

    const sortedPrices = [...prices].sort((a, b) => b - a);

    expect(prices).toEqual(sortedPrices);
  });


  // =========================
  // CART TESTS
  // =========================

  test('User should be able to add a product to cart', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    await inventoryPage.addProductToCart('Sauce Labs Backpack');

    const cartCount = await inventoryPage.getCartCount();

    expect(cartCount).toBe(1);
  });


  test('User should be able to add multiple products to cart', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    await inventoryPage.addProductToCart('Sauce Labs Backpack');
    await inventoryPage.addProductToCart('Sauce Labs Bike Light');

    const cartCount = await inventoryPage.getCartCount();

    expect(cartCount).toBe(2);
  });


  test('User should be able to remove a product from cart', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    await inventoryPage.addProductToCart('Sauce Labs Backpack');

    expect(await inventoryPage.getCartCount()).toBe(1);

    await inventoryPage.removeProductFromCart('Sauce Labs Backpack');

    expect(await inventoryPage.getCartCount()).toBe(0);
  });


  test('User should be able to remove one product while keeping another', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    await inventoryPage.addProductToCart('Sauce Labs Backpack');
    await inventoryPage.addProductToCart('Sauce Labs Bike Light');

    expect(await inventoryPage.getCartCount()).toBe(2);

    await inventoryPage.removeProductFromCart('Sauce Labs Backpack');

    expect(await inventoryPage.getCartCount()).toBe(1);
  });

});