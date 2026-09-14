import { test, expect } from "@playwright/test";
import { LoginPage } from "../../pages/LoginPage";
import { InventoryPage } from "../../pages/InventoryPage";
import { ProductDetailsPage } from "../../pages/ProductDetailsPage";
import { users } from "../../test-data/users";

test.describe("Product Details Tests", () => {

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();

    await loginPage.login(
      users.standard.username,
      users.standard.password
    );

    await expect(page).toHaveURL(/inventory.html/);
  });


  test("should open product details by clicking product name", async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    await inventoryPage.openProduct("Sauce Labs Backpack");

    await expect(page).toHaveURL(/inventory-item\.html/);

    await expect(
      page.getByText("Sauce Labs Backpack", { exact: true })
    ).toBeVisible();
  });


  test("should display product description", async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    await inventoryPage.openProduct("Sauce Labs Backpack");

    await expect(
      page.getByText(/carry.allthethings/i)
    ).toBeVisible();
  });


  test("should display product price", async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    await inventoryPage.openProduct("Sauce Labs Backpack");

    await expect(
      page.locator(".inventory_details_price")
    ).toBeVisible();
  });


  test("should display add to cart button", async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    await inventoryPage.openProduct("Sauce Labs Backpack");

    await expect(
      page.getByRole("button", { name: "Add to cart" })
    ).toBeVisible();
  });


  test("should add product to cart from product details", async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const productDetailsPage = new ProductDetailsPage(page);

    await inventoryPage.openProduct("Sauce Labs Backpack");

    await productDetailsPage.verifyProductDetailsPage();

    await productDetailsPage.addToCart();

    await productDetailsPage.verifyAddedToCart();
  });


  test("should remove product from cart from product details", async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const productDetailsPage = new ProductDetailsPage(page);

    await inventoryPage.openProduct("Sauce Labs Backpack");

    await productDetailsPage.verifyProductDetailsPage();

    await productDetailsPage.addToCart();

    await productDetailsPage.verifyAddedToCart();

    await productDetailsPage.removeFromCart();

    await productDetailsPage.verifyRemovedFromCart();
  });


  test("should return to inventory using Back to products", async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const productDetailsPage = new ProductDetailsPage(page);

    await inventoryPage.openProduct("Sauce Labs Backpack");

    await productDetailsPage.verifyProductDetailsPage();

    await productDetailsPage.backToProducts();

    await expect(page).toHaveURL(/inventory.html/);

    await expect(
      page.getByText("Products")
    ).toBeVisible();
  });

});