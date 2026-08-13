import 'dotenv/config';
import { test, expect } from '@playwright/test';
import LoginPage from '../pages/LoginPage.js';
import { markets } from '../config/markets.js';

const market = process.env.MARKET || 'gambia';
const credentials = markets[market];

test('Valid login', async ({ page, context }) => {
  await context.clearCookies();

  const login = new LoginPage(page);

  await login.navigate();
  await login.openLoginForm();
  await login.login(credentials.phone, credentials.password);

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
  await login.login(credentials.phone, 'wrongpassword');

  // Verify error message appears
  await expect(login.errorMessage).toBeVisible();
});

test('Blank field validation', async ({ page, context }) => {
  await context.clearCookies();

  const login = new LoginPage(page);

  await login.navigate();
  await login.openLoginForm();
  await login.requiredFieldBlank(credentials.password);
});