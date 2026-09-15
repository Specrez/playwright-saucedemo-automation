import { test, expect } from '../../fixtures/testFixture';

test.describe('Product Details Tests', () => {

    test.beforeEach(async ({
        authenticatedPage,
        inventoryPage,
        productDetailsPage
    }) => {
        await inventoryPage.verifyInventoryPage();

        await inventoryPage.openProduct(
            'Sauce Labs Backpack'
        );

        // Explicitly wait until product details page is ready
        await productDetailsPage.verifyProductDetailsPage();
    });

    test('should open product details by clicking product name', async ({
        productDetailsPage
    }) => {
        await productDetailsPage.verifyProductDetailsPage();
    });

    test('should display product description', async ({
        productDetailsPage
    }) => {
        await expect(
            productDetailsPage.productDescription
        ).toBeVisible();

        await expect(
            productDetailsPage.productDescription
        ).not.toHaveText('');
    });

    test('should display product price', async ({
        productDetailsPage
    }) => {
        await expect(
            productDetailsPage.productPrice
        ).toBeVisible();

        await expect(
            productDetailsPage.productPrice
        ).toHaveText(/\$\d+\.\d{2}/);
    });

    test('should display add to cart button', async ({
        productDetailsPage
    }) => {
        await expect(
            productDetailsPage.addToCartButton
        ).toHaveCount(1);

        await expect(
            productDetailsPage.addToCartButton
        ).toBeVisible();

        await expect(
            productDetailsPage.addToCartButton
        ).toHaveText('Add to cart');
    });

    test('should add product to cart from product details', async ({
        productDetailsPage
    }) => {
        await productDetailsPage.addToCart();

        await productDetailsPage.verifyAddedToCart();
    });

    test('should remove product from cart from product details', async ({
        productDetailsPage
    }) => {
        await productDetailsPage.addToCart();

        await productDetailsPage.verifyAddedToCart();

        await productDetailsPage.removeFromCart();

        await productDetailsPage.verifyRemovedFromCart();
    });

    test('should return to inventory using Back to products', async ({
        productDetailsPage,
        inventoryPage
    }) => {
        await productDetailsPage.backToProducts();

        await inventoryPage.verifyInventoryPage();
    });

});