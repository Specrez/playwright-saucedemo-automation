import { expect, Locator, Page } from "@playwright/test";

export class InventoryPage {
  readonly page: Page;

  readonly pageTitle: Locator;
  readonly productItems: Locator;
  readonly productNames: Locator;
  readonly productPrices: Locator;
  readonly sortDropdown: Locator;
  readonly cartLink: Locator;
  readonly cartBadge: Locator;

  constructor(page: Page) {
    this.page = page;

    this.pageTitle = page.getByText("Products");

    this.productItems = page.locator(".inventory_item");

    this.productNames = page.locator(".inventory_item_name");

    this.productPrices = page.locator(".inventory_item_price");

    this.sortDropdown = page.getByRole("combobox");

    this.cartLink = page.locator(".shopping_cart_link");

    this.cartBadge = page.locator(".shopping_cart_badge");
  }

  async verifyInventoryPage() {
    await expect(this.pageTitle).toBeVisible();
    await expect(this.productItems).toHaveCount(6);
  }

  async getProductCount() {
    await expect(this.productItems).toHaveCount(6);
    return await this.productItems.count();
  }

  async getProductNames() {
    await expect(this.productItems).toHaveCount(6);
    return await this.productNames.allTextContents();
  }

  async getProductPrices() {
    await expect(this.productItems).toHaveCount(6);
    return await this.productPrices.allTextContents();
  }

  async sortProducts(option: "az" | "za" | "lohi" | "hilo") {
    await expect(this.sortDropdown).toBeVisible();

    await this.sortDropdown.selectOption(option);

    await expect(this.sortDropdown).toHaveValue(option);
  }

  async addProductToCart(productName: string) {
    await expect(this.productItems).toHaveCount(6);

    const product = this.productItems.filter({
      hasText: productName,
    });

    await product.getByRole("button", { name: /add to cart/i }).click();
  }

  async removeProductFromCart(productName: string) {
    await expect(this.productItems).toHaveCount(6);

    const product = this.productItems.filter({
      hasText: productName,
    });

    await product.getByRole("button", { name: /remove/i }).click();
  }

  async getCartCount() {
    if (!(await this.cartBadge.isVisible())) {
      return 0;
    }

    return Number(await this.cartBadge.textContent());
  }

  async openCart() {
    await expect(this.cartLink).toBeVisible();
    await this.cartLink.click();
  }

async openProduct(productName: string) {
    await expect(this.productItems).toHaveCount(6);

    const product = this.productItems.filter({
        hasText: productName,
    });

    await expect(product).toHaveCount(1);

    await product
        .locator('.inventory_item_name')
        .click();

    await expect(this.page)
        .toHaveURL(/inventory-item\.html/);
}
}