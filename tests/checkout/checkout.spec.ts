import { test, expect } from '../../fixtures/testFixture';

test.describe('Checkout Functionality', () => {

test.beforeEach(async ({
  authenticatedPage,
  inventoryPage,
  cartPage,
}) => {
  await inventoryPage.addProductToCart('Sauce Labs Backpack');

  await inventoryPage.openCart();

  await cartPage.verifyCartPage();

  await cartPage.checkout();
});


  test('User should be able to open checkout information page', async ({
    checkoutPage,
  }) => {

    await checkoutPage.verifyCheckoutInformationPage();

    await expect(checkoutPage.firstNameInput).toBeVisible();
    await expect(checkoutPage.lastNameInput).toBeVisible();
    await expect(checkoutPage.postalCodeInput).toBeVisible();
  });


  test('Checkout should require first name', async ({
    checkoutPage,
  }) => {

    await checkoutPage.lastNameInput.fill('Doe');
    await checkoutPage.postalCodeInput.fill('10001');

    await checkoutPage.continueToOverview();

    await expect(checkoutPage.errorMessage).toContainText(
      'First Name is required'
    );
  });


  test('Checkout should require last name', async ({
    checkoutPage,
  }) => {

    await checkoutPage.firstNameInput.fill('John');
    await checkoutPage.postalCodeInput.fill('10001');

    await checkoutPage.continueToOverview();

    await expect(checkoutPage.errorMessage).toContainText(
      'Last Name is required'
    );
  });


  test('Checkout should require postal code', async ({
    checkoutPage,
  }) => {

    await checkoutPage.firstNameInput.fill('John');
    await checkoutPage.lastNameInput.fill('Doe');

    await checkoutPage.continueToOverview();

    await expect(checkoutPage.errorMessage).toContainText(
      'Postal Code is required'
    );
  });


  test('User should be able to continue with valid information', async ({
    checkoutPage,
  }) => {

    await checkoutPage.enterCustomerInformation(
      'John',
      'Doe',
      '10001'
    );

    await checkoutPage.continueToOverview();

    await checkoutPage.verifyCheckoutOverview();
  });


  test('Checkout overview should display payment information', async ({
    checkoutPage,
  }) => {

    await checkoutPage.enterCustomerInformation(
      'John',
      'Doe',
      '10001'
    );

    await checkoutPage.continueToOverview();

    await expect(
      checkoutPage.paymentInformation
    ).toBeVisible();
  });


  test('Checkout overview should display shipping information', async ({
    checkoutPage,
  }) => {

    await checkoutPage.enterCustomerInformation(
      'John',
      'Doe',
      '10001'
    );

    await checkoutPage.continueToOverview();

    await expect(
      checkoutPage.shippingInformation
    ).toBeVisible();
  });


  test('Checkout should display item total', async ({
    checkoutPage,
  }) => {

    await checkoutPage.enterCustomerInformation(
      'John',
      'Doe',
      '10001'
    );

    await checkoutPage.continueToOverview();

    await expect(checkoutPage.itemTotal).toBeVisible();

    await expect(checkoutPage.itemTotal).toContainText(
      '$29.99'
    );
  });


  test('Checkout should calculate tax', async ({
    checkoutPage,
  }) => {

    await checkoutPage.enterCustomerInformation(
      'John',
      'Doe',
      '10001'
    );

    await checkoutPage.continueToOverview();

    await expect(checkoutPage.tax).toBeVisible();
  });


  test('Checkout should display final total', async ({
    checkoutPage,
  }) => {

    await checkoutPage.enterCustomerInformation(
      'John',
      'Doe',
      '10001'
    );

    await checkoutPage.continueToOverview();

    await expect(checkoutPage.total).toBeVisible();
  });


  test('User should be able to complete an order', async ({
    checkoutPage,
  }) => {

    await checkoutPage.enterCustomerInformation(
      'John',
      'Doe',
      '10001'
    );

    await checkoutPage.continueToOverview();

    await checkoutPage.finishOrder();

    await checkoutPage.verifyOrderConfirmation();
  });


  test('Order confirmation should display correct message', async ({
    checkoutPage,
  }) => {

    await checkoutPage.enterCustomerInformation(
      'John',
      'Doe',
      '10001'
    );

    await checkoutPage.continueToOverview();

    await checkoutPage.finishOrder();

    await expect(
      checkoutPage.confirmationMessage
    ).toHaveText('Thank you for your order!');
  });


  test('User should be able to return to products after completing order', async ({
    checkoutPage,
  }) => {

    await checkoutPage.enterCustomerInformation(
      'John',
      'Doe',
      '10001'
    );

    await checkoutPage.continueToOverview();

    await checkoutPage.finishOrder();

    await checkoutPage.backToProducts();

    await expect(checkoutPage.page).toHaveURL(
      /inventory.html/
    );
  });

});