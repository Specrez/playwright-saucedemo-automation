import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { InventoryPage } from '../../pages/InventoryPage';
import { users } from '../../test-data/users';

test.describe('Product Details Tests', () => {

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);

    await loginPage.goto();

    await loginPage.login(
      users.standard.username,
      users.standard.password
    );

    await expect(page).toHaveURL(/inventory.html/);
  });

  test('should open product details by clicking product name', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    await inventoryPage.openProduct('Sauce Labs Backpack');

    await expect(page).toHaveURL(/inventory-item\.html/);

    await expect(
      page.getByText('Sauce Labs Backpack', { exact: true })
    ).toBeVisible();
  });

  test('should display product description', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    await inventoryPage.openProduct('Sauce Labs Backpack');

    await expect(
      page.getByText(
        /carry.allthethings/i
      )
    ).toBeVisible();
  });

  test('should display product price', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    await inventoryPage.openProduct('Sauce Labs Backpack');

    await expect(
      page.locator('.inventory_details_price')
    ).toBeVisible();
  });

  test('should display add to cart button', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    await inventoryPage.openProduct('Sauce Labs Backpack');

    await expect(
      page.getByRole('button', { name: 'Add to cart' })
    ).toBeVisible();
  });

  test('should add product to cart from product details', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    await inventoryPage.openProduct('Sauce Labs Backpack');

    await page.getByRole('button', { name: 'Add to cart' }).click();

    await expect(
      page.getByRole('button', { name: 'Remove' })
    ).toBeVisible();

    await expect(
      page.locator('.shopping_cart_badge')
    ).toHaveText('1');
  });

  test('should remove product from cart from product details', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    await inventoryPage.openProduct('Sauce Labs Backpack');

    await page.getByRole('button', { name: 'Add to cart' }).click();

    await page.getByRole('button', { name: 'Remove' }).click();

    await expect(
      page.locator('.shopping_cart_badge')
    ).not.toBeVisible();
  });

  test('should return to inventory using Back to products', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    await inventoryPage.openProduct('Sauce Labs Backpack');

    await page.getByRole('button', { name: 'Back to products' }).click();

    await expect(page).toHaveURL(/inventory.html/);
    await expect(page.getByText('Products')).toBeVisible();
  });

});