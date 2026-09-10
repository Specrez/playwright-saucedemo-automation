import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { users } from '../../test-data/users';

test.describe('Login Tests', () => {

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('should login successfully with valid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.login(
      users.standard.username,
      users.standard.password
    );

    await expect(page).toHaveURL(/inve.html/);
    await expect(page.getByText('Products')).toBeVisible();
  });

  test('should display error for locked out user', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.login(
      users.locked.username,
      users.locked.password
    );

    await expect(loginPage.errorMessage).toBeVisible();

    await expect(loginPage.errorMessage)
      .toContainText('locked out');
  });

  test('should reject invalid username', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.login(
      'invalid_user',
      users.standard.password
    );

    await expect(loginPage.errorMessage).toBeVisible();
  });

  test('should reject invalid password', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.login(
      users.standard.username,
      'wrong_password'
    );

    await expect(loginPage.errorMessage).toBeVisible();
  });

  test('should reject invalid username and password', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.login(
      'invalid_user',
      'wrong_password'
    );

    await expect(loginPage.errorMessage).toBeVisible();
  });

  test('should require username', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.login(
      '',
      users.standard.password
    );

    await expect(loginPage.errorMessage).toBeVisible();
  });

  test('should require password', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.login(
      users.standard.username,
      ''
    );

    await expect(loginPage.errorMessage).toBeVisible();
  });

  test('should require username and password', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.login('', '');

    await expect(loginPage.errorMessage).toBeVisible();
  });

});