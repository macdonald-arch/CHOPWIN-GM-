import 'dotenv/config';
import { test, expect } from '@playwright/test';
import LoginPage from '../../../pages/LoginPage.js';
import { markets } from '../../../config/markets.js';

const market = process.env.MARKET || 'gambia';
const credentials = markets[market];
const marketConfig = markets[market];

test('User can access Withdrawal page and view withdrawal form', async ({ page }) => {
  const login = new LoginPage(page);

  // Login
  await login.navigate();
  await login.openLoginForm();
  await login.login(credentials.phone, credentials.password);

  // Open My Account
  await page.getByRole('button', {
    name: 'Toggle wallet dropdown'
  }).click();

  await page.getByRole('link', {
    name: 'My Account'
  }).nth(1).click();

  // Open Withdrawal
  await page.getByRole('button', {
    name: 'Withdraw'
  }).click();

  // Select withdrawal method
  await page.getByRole('button', {
    name: marketConfig.withdrawalMethod
  }).click();

  // Verify withdrawal amount field is visible
  await expect(
    page.getByRole('textbox', {
      name: 'Withdraw amount'
    })
  ).toBeVisible();
});

test('User cannot withdraw without meeting deposit requirement', async ({ page }) => {
  const login = new LoginPage(page);

  // Login
  await login.navigate();
  await login.openLoginForm();
  await login.login(credentials.phone, credentials.password);

  // Allow homepage to finish rendering
  await page.waitForTimeout(2000);

  // Close popup if it appears
  const closeButton = page.getByRole('button', { name: 'Close' });

  if (await closeButton.isVisible().catch(() => false)) {
    await closeButton.click();
  }

  // Open My Account
  await page.getByRole('button', {
    name: 'Toggle wallet dropdown'
  }).click();

  await page.getByRole('link', {
    name: 'My Account'
  }).nth(1).click();

  // Open Withdrawal
  await page.getByRole('button', {
    name: 'Withdraw'
  }).click();

  // Select withdrawal method
  await page.getByRole('button', {
    name: marketConfig.withdrawalMethod
  }).click();

  // Select market-specific withdrawal amount
  await page.getByRole('button', {
    name: marketConfig.withdrawalAmount,
    exact: true
  }).click();

  // Uganda has a different validation because the account has no balance
  if (market === 'uganda') {
    await expect(
      page.getByText(/Amount is bigger than your/i)
    ).toBeVisible();
  } else {
    // Gambia behavior
    await page.getByRole('button', {
      name: 'Continue'
    }).click();

    await expect(
      page.getByText('Deposit at least 50.00 Dalasi')
    ).toBeVisible();
  }
});