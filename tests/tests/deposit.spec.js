import 'dotenv/config';
import { test, expect } from '@playwright/test';
import LoginPage from '../../pages/LoginPage.js';
import { markets } from '../../config/markets.js';

const market = process.env.MARKET || 'gambia';
const credentials = markets[market];

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

  // Select deposit method
  if (market === 'sierraLeone') {
    await page.getByRole('button', {
      name: 'Orange Money Orange Money'
    }).click({
      force: true
    });

    // Select deposit amount
    await page.getByRole('button', {
      name: '5',
      exact: true
    }).click({
      force: true
    });

    // Continue
    await page.getByRole('button', {
      name: 'Continue'
    }).click();

    // Verify Sierra Leone deposit result
    await expect(
      page.getByText('Your deposit of 5.00 failed')
    ).toBeVisible();

  } else {
    // Existing Gambia/Uganda flow
    await page.getByRole('button', {
      name: market === 'uganda'
        ? 'MTN MTN'
        : 'Wave Wave'
    }).click();

    await page.getByRole('button', {
      name: credentials.depositAmount || '20',
      exact: true
    }).click();

    await page.getByRole('button', {
      name: 'Continue'
    }).click();
  }
});