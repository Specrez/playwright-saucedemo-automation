import { test, expect } from '../../fixtures/testFixture';

test.describe('Inventory Navigation Tests', () => {

    test.beforeEach(async ({
        authenticatedPage,
        inventoryPage
    }) => {
        await inventoryPage.verifyInventoryPage();
    });

    test('should display all inventory products', async ({
        inventoryPage
    }) => {
        const productCount = await inventoryPage.getProductCount();

        expect(productCount).toBe(6);
    });

    test('should display product names', async ({
        inventoryPage
    }) => {
        const productNames = await inventoryPage.getProductNames();

        expect(productNames).toHaveLength(6);
    });

    test('should display product prices', async ({
        inventoryPage
    }) => {
        const productPrices = await inventoryPage.getProductPrices();

        expect(productPrices).toHaveLength(6);
    });

    test('should open product details from product image', async ({
        page,
        inventoryPage,
        productDetailsPage
    }) => {
        const firstProduct = inventoryPage.productItems.first();

        await firstProduct
            .locator('.inventory_item_img a')
            .click();

        await productDetailsPage.verifyProductDetailsPage();
    });

    test('should open product details from product name', async ({
        inventoryPage,
        productDetailsPage
    }) => {
        await inventoryPage.openProduct(
            'Sauce Labs Backpack'
        );

        await productDetailsPage.verifyProductDetailsPage();
    });

    test('should display shopping cart link', async ({
        inventoryPage
    }) => {
        await expect(
            inventoryPage.cartLink
        ).toBeVisible();
    });

    test('should navigate to cart from inventory', async ({
        inventoryPage,
        cartPage
    }) => {
        await inventoryPage.openCart();

        await cartPage.verifyCartPage();
    });

});