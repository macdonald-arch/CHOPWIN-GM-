import { test, expect } from '@playwright/test';
import LoginPage from '../../../pages/LoginPage.js';

test('User can access Withdrawal page and view withdrawal form', async ({ page }) => {
  const login = new LoginPage(page);

  // Login
  await login.navigate();
  await login.openLoginForm();
  await login.login('3354321', 'choplife2026');

  // Open My Account
  await page.getByRole('button', { name: 'Toggle wallet dropdown' }).click();
  await page.getByRole('link', { name: 'My Account' }).nth(1).click();

  // Open Withdrawal
  await page.getByRole('button', { name: 'Withdraw' }).click();

  // Select withdrawal method
  await page.getByRole('button', { name: 'Wave Wave' }).click();

  // Verify withdrawal amount field is visible
  await expect(
    page.getByRole('textbox', { name: 'Withdraw amount' })
  ).toBeVisible();
});

test('User cannot withdraw without meeting deposit requirement', async ({ page }) => {
  const login = new LoginPage(page);

  // Login
  await login.navigate();
  await login.openLoginForm();
  await login.login('3354321', 'choplife2026');

  // Open My Account
  await page.getByRole('button', { name: 'Toggle wallet dropdown' }).click();
  await page.getByRole('link', { name: 'My Account' }).nth(1).click();

  // Open Withdrawal
  await page.getByRole('button', { name: 'Withdraw' }).click();

  // Select withdrawal method
  await page.getByRole('button', { name: 'Wave Wave' }).click();

  // Select withdrawal amount
  await page.getByRole('button', { name: '20', exact: true }).click();

  // Attempt withdrawal
  await page.getByRole('button', { name: 'Continue' }).click();

  // Verify validation message
  await expect(
    page.getByText('Deposit at least 50.00 Dalasi')
  ).toBeVisible();
});