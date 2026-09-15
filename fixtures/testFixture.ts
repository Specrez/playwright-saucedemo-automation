import { test as base, expect } from '@playwright/test';

import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { ProductDetailsPage } from '../pages/ProductDetailsPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { users } from '../test-data/users';

type TestFixtures = {
    loginPage: LoginPage;
    inventoryPage: InventoryPage;
    productDetailsPage: ProductDetailsPage;
    cartPage: CartPage;
    checkoutPage: CheckoutPage;
    authenticatedPage: void;
};

export const test = base.extend<TestFixtures>({
    authenticatedPage: async ({ page }, use) => {
        const loginPage = new LoginPage(page);

        await loginPage.goto();

        await loginPage.login(
            users.standard.username,
            users.standard.password
        );

        await expect(page).toHaveURL(/inventory\.html/);

        await use();
    },

    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page));
    },

    inventoryPage: async ({ page }, use) => {
        await use(new InventoryPage(page));
    },

    productDetailsPage: async ({ page }, use) => {
        await use(new ProductDetailsPage(page));
    },

    cartPage: async ({ page }, use) => {
        await use(new CartPage(page));
    },

    checkoutPage: async ({ page }, use) => {
        await use(new CheckoutPage(page));
    },
});

export { expect };