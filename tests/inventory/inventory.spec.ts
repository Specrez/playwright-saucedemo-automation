import { test, expect } from '../../fixtures/testFixture';

test.describe('Inventory Functionality', () => {

    test.beforeEach(async ({
        authenticatedPage,
        inventoryPage
    }) => {
        await inventoryPage.verifyInventoryPage();
    });

    test('User should be able to view inventory page', async ({
        inventoryPage
    }) => {
        await inventoryPage.verifyInventoryPage();
    });

    test('Inventory should display products', async ({
        inventoryPage
    }) => {
        const productCount = await inventoryPage.getProductCount();

        expect(productCount).toBe(6);
    });

    test('Products should display product names', async ({
        inventoryPage
    }) => {
        const productNames = await inventoryPage.getProductNames();

        expect(productNames).toHaveLength(6);
        expect(productNames).toContain('Sauce Labs Backpack');
    });

    test('Products should display prices', async ({
        inventoryPage
    }) => {
        const productPrices = await inventoryPage.getProductPrices();

        expect(productPrices).toHaveLength(6);
        expect(productPrices[0]).toMatch(/\$\d+\.\d{2}/);
    });

    test('Products should be sorted by name A-Z', async ({
        inventoryPage
    }) => {
        await inventoryPage.sortProducts('az');

        const productNames = await inventoryPage.getProductNames();

        const sortedNames = [...productNames].sort((a, b) =>
            a.localeCompare(b)
        );

        expect(productNames).toEqual(sortedNames);
    });

    test('Products should be sorted by name Z-A', async ({
        inventoryPage
    }) => {
        await inventoryPage.sortProducts('za');

        const productNames = await inventoryPage.getProductNames();

        const sortedNames = [...productNames]
            .sort((a, b) => a.localeCompare(b))
            .reverse();

        expect(productNames).toEqual(sortedNames);
    });

    test('Products should be sorted by price low to high', async ({
        inventoryPage
    }) => {
        await inventoryPage.sortProducts('lohi');

        const productPrices = await inventoryPage.getProductPrices();

        const prices = productPrices.map(price =>
            parseFloat(price.replace('$', ''))
        );

        const sortedPrices = [...prices].sort((a, b) => a - b);

        expect(prices).toEqual(sortedPrices);
    });

    test('Products should be sorted by price high to low', async ({
        inventoryPage
    }) => {
        await inventoryPage.sortProducts('hilo');

        const productPrices = await inventoryPage.getProductPrices();

        const prices = productPrices.map(price =>
            parseFloat(price.replace('$', ''))
        );

        const sortedPrices = [...prices].sort((a, b) => b - a);

        expect(prices).toEqual(sortedPrices);
    });

    test('User should be able to add a product to cart', async ({
        inventoryPage
    }) => {
        await inventoryPage.addProductToCart(
            'Sauce Labs Backpack'
        );

        const cartCount = await inventoryPage.getCartCount();

        expect(cartCount).toBe(1);
    });

    test('User should be able to add multiple products to cart', async ({
        inventoryPage
    }) => {
        await inventoryPage.addProductToCart(
            'Sauce Labs Backpack'
        );

        await inventoryPage.addProductToCart(
            'Sauce Labs Bike Light'
        );

        const cartCount = await inventoryPage.getCartCount();

        expect(cartCount).toBe(2);
    });

    test('User should be able to remove a product from cart', async ({
        inventoryPage
    }) => {
        await inventoryPage.addProductToCart(
            'Sauce Labs Backpack'
        );

        expect(
            await inventoryPage.getCartCount()
        ).toBe(1);

        await inventoryPage.removeProductFromCart(
            'Sauce Labs Backpack'
        );

        expect(
            await inventoryPage.getCartCount()
        ).toBe(0);
    });

    test('User should be able to remove one product while keeping another', async ({
        inventoryPage
    }) => {
        await inventoryPage.addProductToCart(
            'Sauce Labs Backpack'
        );

        await inventoryPage.addProductToCart(
            'Sauce Labs Bike Light'
        );

        expect(
            await inventoryPage.getCartCount()
        ).toBe(2);

        await inventoryPage.removeProductFromCart(
            'Sauce Labs Backpack'
        );

        expect(
            await inventoryPage.getCartCount()
        ).toBe(1);
    });

});