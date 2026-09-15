import { expect, Locator, Page } from '@playwright/test';

export class ProductDetailsPage {
    readonly page: Page;
    readonly productName: Locator;
    readonly productDescription: Locator;
    readonly productPrice: Locator;
    readonly addToCartButton: Locator;
    readonly removeButton: Locator;
    readonly backToProductsButton: Locator;
    readonly cartBadge: Locator;

    constructor(page: Page) {
        this.page = page;

        this.productName = page.locator('.inventory_details_name');

        this.productDescription = page.locator(
            '.inventory_details_desc'
        );

        this.productPrice = page.locator(
            '.inventory_details_price'
        );

        this.addToCartButton = page.locator(
            '.inventory_details button[data-test^="add-to-cart"]'
        );

        this.removeButton = page.locator(
            '.inventory_details button[data-test^="remove"]'
        );

        this.backToProductsButton = page.getByRole(
            'button',
            { name: 'Back to products' }
        );

        this.cartBadge = page.locator(
            '.shopping_cart_badge'
        );
    }

    async verifyProductDetailsPage() {
        await expect(this.page).toHaveURL(
            /inventory-item\.html/
        );

        await expect(this.productName).toBeVisible();
    }

    async addToCart() {
        await this.verifyProductDetailsPage();

        await expect(this.addToCartButton).toHaveCount(1);
        await expect(this.addToCartButton).toBeVisible();

        await this.addToCartButton.click();
    }

    async removeFromCart() {
        await this.verifyProductDetailsPage();

        await expect(this.removeButton).toHaveCount(1);
        await expect(this.removeButton).toBeVisible();

        await this.removeButton.click();
    }

    async verifyAddedToCart() {
        await expect(this.removeButton).toBeVisible();

        await expect(this.cartBadge).toHaveText('1');
    }

    async verifyRemovedFromCart() {
        await expect(this.addToCartButton).toBeVisible();

        await expect(this.cartBadge).not.toBeVisible();
    }

    async backToProducts() {
        await this.backToProductsButton.click();

        await expect(this.page).toHaveURL(
            /inventory\.html/
        );
    }
}