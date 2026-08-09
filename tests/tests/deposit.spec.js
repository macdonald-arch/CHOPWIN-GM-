import { test, expect } from '@playwright/test';
import LoginPage from '../../pages/LoginPage.js';

test('User can proceed to Wave payment after entering deposit amount', async ({ page }) => {
  const login = new LoginPage(page);

  // Login
  await login.navigate();
  await login.openLoginForm();
  await login.login('3354321', 'choplife2026');

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
  await page.getByRole('button', {
    name: 'Wave Wave'
  }).click();

  // Select deposit amount
  await page.getByRole('button', {
    name: '20',
    exact: true
  }).click();

  // Continue to payment
  await page.getByRole('button', {
    name: 'Continue'
  }).click();

  // Verify that the Wave payment page was reached
  await expect(page).toHaveURL(/pay\.wave\.com/, {
    timeout: 15000
  });
});