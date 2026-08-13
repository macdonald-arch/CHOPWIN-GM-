import 'dotenv/config';
import { test, expect } from '@playwright/test';
import LoginPage from '../../pages/LoginPage.js';
import { markets } from '../../config/markets.js';

const market = process.env.MARKET || 'gambia';
const credentials = markets[market];
const marketConfig = markets[market];

test('User can proceed to payment after entering deposit amount', async ({ page }) => {
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

  // Open Deposit
  await page
    .locator('#deposit-profile')
    .getByRole('button', {
      name: 'Deposit'
    })
    .click();

  // Select market-specific deposit method
  await page.getByRole('button', {
    name: marketConfig.depositMethod
  }).click();

  // Select market-specific deposit amount
  await page.getByRole('button', {
    name: marketConfig.depositAmount,
    exact: true
  }).click();

  // Continue to payment
  await page.getByRole('button', {
    name: 'Continue'
  }).click();

  // Gambia reaches the Wave payment page
  if (market === 'gambia') {
    await expect(page).toHaveURL(/pay\.wave\.com/, {
      timeout: 15000
    });
  }

  // Uganda shows phone number validation
  if (market === 'uganda') {
    await expect(
      page.getByText('Invalid phone number')
    ).toBeVisible({
      timeout: 15000
    });
  }
});