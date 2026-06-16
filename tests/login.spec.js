import { test, expect } from '@playwright/test';
import LoginPage from '../pages/LoginPage.js';

test('Valid login', async ({ page, context }) => {
  await context.clearCookies();

  const login = new LoginPage(page);

  await login.navigate();
  await login.openLoginForm();
  await login.login('3354321', 'choplife2026');

  await expect(
    page.getByRole('link', { name: 'My Account' })
  ).toBeVisible();

  await expect(
    page.getByText('Balance')
  ).toBeVisible();
});

test('Invalid login', async ({ page, context }) => {
  await context.clearCookies();

  const login = new LoginPage(page);

  await login.navigate();
  await login.openLoginForm();
  await login.login('3354321', 'wrongpassword');

  // Verify error message appears
  await expect(login.errorMessage).toBeVisible();
});

test('Blank field validation', async ({ page, context }) => {
  await context.clearCookies();

  const login = new LoginPage(page);

  await login.navigate();
  await login.openLoginForm();
  await login.requiredFieldBlank('choplife2026');
});