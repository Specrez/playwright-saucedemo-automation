import { test, expect } from '../../fixtures/testFixture';
import { LoginPage } from '../../pages/LoginPage';
import { InventoryPage } from '../../pages/InventoryPage';
import { users } from '../../test-data/users';

test.describe('Product Details', () => {

test.beforeEach(async ({ authenticatedPage }) => {
  // User is already logged in
});


  test('User should be able to open product details', async ({ page }) => {

    const inventoryPage = new InventoryPage(page);

    await inventoryPage.openProduct('Sauce Labs Backpack');

    await expect(page).toHaveURL(/inventory-item\.html/);

    await expect(
      page.getByText('Sauce Labs Backpack')
    ).toBeVisible();

  });


  test('Product details should display price', async ({ page }) => {

    const inventoryPage = new InventoryPage(page);

    await inventoryPage.openProduct('Sauce Labs Backpack');

    await expect(
      page.locator('.inventory_details_price')
    ).toBeVisible();

  });


  test('Product details should display description', async ({ page }) => {

    const inventoryPage = new InventoryPage(page);

    await inventoryPage.openProduct('Sauce Labs Backpack');

    await expect(
      page.locator('.inventory_details_desc')
    ).toBeVisible();

  });

});