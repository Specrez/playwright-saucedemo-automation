import { expect, Locator, Page } from '@playwright/test';

export class CheckoutPage {
  readonly page: Page;

  readonly pageTitle: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;
  readonly cancelButton: Locator;

  readonly errorMessage: Locator;

  readonly paymentInformation: Locator;
  readonly shippingInformation: Locator;
  readonly itemTotal: Locator;
  readonly tax: Locator;
  readonly total: Locator;
  readonly finishButton: Locator;

  readonly confirmationMessage: Locator;
  readonly backHomeButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // Checkout information
    this.pageTitle = page.getByText('Checkout: Your Information');

    this.firstNameInput = page.getByPlaceholder('First Name');
    this.lastNameInput = page.getByPlaceholder('Last Name');
    this.postalCodeInput = page.getByPlaceholder('Zip/Postal Code');

    this.continueButton = page.getByRole('button', {
      name: 'Continue',
    });

    this.cancelButton = page.getByRole('button', {
      name: 'Cancel',
    });

    this.errorMessage = page.locator('[data-test="error"]');

    // Checkout overview
    this.paymentInformation = page.getByText('Payment Information');
    this.shippingInformation = page.getByText('Shipping Information');

    this.itemTotal = page.locator('.summary_subtotal_label');
    this.tax = page.locator('.summary_tax_label');
    this.total = page.locator('.summary_total_label');

    this.finishButton = page.getByRole('button', {
      name: 'Finish',
    });

    // Checkout complete
    this.confirmationMessage = page.getByText(
      'Thank you for your order!'
    );

    this.backHomeButton = page.getByRole('button', {
      name: 'Back Home',
    });
  }

  async verifyCheckoutInformationPage() {
    await expect(this.pageTitle).toBeVisible();
  }

  async enterCustomerInformation(
    firstName: string,
    lastName: string,
    postalCode: string
  ) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
  }

  async continueToOverview() {
    await this.continueButton.click();
  }

  async getErrorMessage() {
    return await this.errorMessage.textContent();
  }

  async verifyCheckoutOverview() {
    await expect(
      this.page.getByText('Checkout: Overview')
    ).toBeVisible();
  }

  async getItemTotal() {
    return await this.itemTotal.textContent();
  }

  async getTax() {
    return await this.tax.textContent();
  }

  async getTotal() {
    return await this.total.textContent();
  }

  async finishOrder() {
    await this.finishButton.click();
  }

  async verifyOrderConfirmation() {
    await expect(this.confirmationMessage).toBeVisible();
  }

  async backToProducts() {
    await this.backHomeButton.click();
  }
}