import { expect, Locator, Page } from '@playwright/test';

export class CartPage {
  readonly page: Page;

  readonly pageTitle: Locator;
  readonly cartItems: Locator;
  readonly checkoutButton: Locator;
  readonly continueShoppingButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.pageTitle = page.getByText('Your Cart');

    this.cartItems = page.locator('.cart_item');

    this.checkoutButton = page.getByRole('button', {
      name: 'Checkout',
    });

    this.continueShoppingButton = page.getByRole('button', {
      name: 'Continue Shopping',
    });
  }

  async verifyCartPage() {
    await expect(this.pageTitle).toBeVisible();
  }

  async getCartItemCount() {
    return await this.cartItems.count();
  }

  async getCartProductNames() {
    return await this.cartItems
      .locator('.inventory_item_name')
      .allTextContents();
  }

  async removeProduct(productName: string) {

    const item = this.cartItems.filter({
      hasText: productName,
    });

    await item.getByRole('button', { name: /remove/i }).click();
  }

  async checkout() {
    await this.checkoutButton.click();
  }

  async continueShopping() {
    await this.continueShoppingButton.click();
  }
}