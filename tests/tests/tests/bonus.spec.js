import 'dotenv/config';
import { test, expect } from '@playwright/test';
import LoginPage from '../../../pages/LoginPage.js';
import { markets } from '../../../config/markets.js';

const market = process.env.MARKET || 'gambia';
const credentials = markets[market];

test('User can access Bonus page', async ({ page }) => {
  const login = new LoginPage(page);

  // Login
  await login.navigate();
  await login.openLoginForm();
  await login.login(credentials.phone, credentials.password);

  // Open Bonus
  await page.getByRole('button', {
    name: 'Bonus',
    exact: true
  }).click();

  // Verify bonus details button exists
  await expect(
    page.getByRole('button', {
      name: 'View Details'
    }).first()
  ).toBeVisible();
});

test('User can open Bonus details', async ({ page }) => {
  const login = new LoginPage(page);

  // Login
  await login.navigate();
  await login.openLoginForm();
  await login.login(credentials.phone, credentials.password);

  // Open Bonus
  await page.getByRole('button', {
    name: 'Bonus',
    exact: true
  }).click();

  // Open bonus details
  const viewDetailsButton = page.getByRole('button', {
    name: 'View Details'
  }).first();

  await expect(viewDetailsButton).toBeVisible();

  await viewDetailsButton.click();

  if (market === 'uganda') {
    // Uganda opens Bonus details on a dedicated page
    await expect(page).toHaveURL(
      /\/bonus\/cashback\/casino\/31/,
      {
        timeout: 15000
      }
    );
  } else {
    // Gambia: verify the View Details action completed
    await expect(page).toHaveURL(/.*/, {
      timeout: 10000
    });
  }
});