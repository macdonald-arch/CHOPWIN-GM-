import 'dotenv/config';

import { test, expect } from '@playwright/test';

import LoginPage from '../../../pages/LoginPage.js';

import { markets } from '../../../config/markets.js';

const market = process.env.MARKET || 'gambia';

const credentials = markets[market];

test('Valid logout', async ({ page, context }) => {

  await context.clearCookies();

  const login = new LoginPage(page);

  await login.navigate();

  await login.openLoginForm();

  await login.login(credentials.phone, credentials.password);

  // Open wallet dropdown
  await page.getByRole('button', {
    name: 'Toggle wallet dropdown'
  }).click();

  // Logout
  await page.getByRole('button', {
    name: 'Logout'
  }).click();

  // Verify user is logged out
  if (market === 'sierraLeone') {
    // Sierra Leone returns to the lobby after logout
    await expect(
      page.getByRole('link', {
        name: 'lobby'
      })
    ).toBeVisible();
  } else {
    // Gambia and Uganda
    await expect(
      page.getByRole('link', {
        name: 'Log in'
      })
    ).toBeVisible();
  }
});