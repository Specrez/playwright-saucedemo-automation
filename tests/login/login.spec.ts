
import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { users } from '../../test-data/users';

test.describe('Login Functionality', () => {

  test('Valid user should login successfully', async ({ page }) => {

    const loginPage = new LoginPage(page);

    await loginPage.goto();

    await loginPage.login(
      users.standard.username,
      users.standard.password
    );

    await expect(page).toHaveURL(/inventory.html/);

    await expect(
      page.getByText('Products')
    ).toBeVisible();

  });

});



test('Invalid credentials should display error message', async ({ page }) => {

  const loginPage = new LoginPage(page);

  await loginPage.goto();

  await loginPage.login(
    users.invalid.username,
    users.invalid.password
  );

  await expect(
    page.locator('[data-test="error"]')
  ).toContainText('Username and password do not match');
});


test('Locked user should not login', async ({ page }) => {

  const loginPage = new LoginPage(page);

  await loginPage.goto();

  await loginPage.login(
    users.locked.username,
    users.locked.password
  );

  await expect(
    page.locator('[data-test="error"]')
  ).toContainText('Sorry, this user has been locked out.');
});